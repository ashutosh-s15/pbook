import { FORBIDDEN_QUERY_KEYWORDS } from '@/constant/constants';
import { getDB } from '@/db/pglite';

export class SqlQueryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SqlQueryValidationError';
  }
}

export async function executeSelectQuery(query: string): Promise<{
  rows: Record<string, any>[];
  columns: string[];
}> {
  const validatedQuery = validateSqlQuery(query);
  const db = await getDB();

  try {
    const result = await db.exec(validatedQuery);

    if (!result.length || !result[0].rows.length) {
      return { rows: [], columns: [] };
    }

    return {
      rows: result[0].rows,
      columns: Object.keys(result[0].rows[0]),
    };
  } catch (error) {
    throw new SqlQueryValidationError(
      error instanceof Error ? error.message : 'Query execution failed'
    );
  }
}

function validateSqlQuery(query: string): string {
  query = query.trim();

  if (!query) {
    throw new SqlQueryValidationError('Query cannot be empty');
  }

  // Convert to lowercase for validation
  const lowerQuery = query.toLowerCase();

  // Check if query starts with SELECT
  if (!lowerQuery.startsWith('select')) {
    throw new SqlQueryValidationError('Only SELECT queries are allowed');
  }

  // Check for forbidden keywords
  for (const keyword of FORBIDDEN_QUERY_KEYWORDS) {
    if (lowerQuery.includes(keyword)) {
      throw new SqlQueryValidationError(
        `Query contains forbidden keyword: ${keyword}`
      );
    }
  }

  // Check for multiple statements
  if (query.includes(';')) {
    throw new SqlQueryValidationError('Multiple statements are not allowed');
  }

  // Check for comments
  if (query.includes('--') || query.includes('/*') || query.includes('*/')) {
    throw new SqlQueryValidationError('SQL comments are not allowed');
  }

  // Add LIMIT if not present (to prevent large result sets)
  if (!lowerQuery.includes('limit') && !lowerQuery.includes('where')) {
    query += ` LIMIT 100`;
  }

  return query;
}
