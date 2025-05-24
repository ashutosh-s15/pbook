'use client';

import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/toast';
import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css'; // or any other theme you prefer
import TableInfo from './table-info';

export function SqlSearchInput({
  onSearch,
  onReset,
  loading,
}: {
  onSearch: (query: string) => Promise<void>;
  onReset: () => void;
  loading: boolean;
}) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      await onSearch(query);
    } catch (error) {
      showToast({
        title: 'SQL Error',
        description:
          error instanceof Error ? error.message : 'Invalid SQL query',
        type: 'error',
      });
    }
  };

  const highlight = (code: string) => {
    return Prism.highlight(code, Prism.languages.sql, 'sql');
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 relative rounded-md border border-input shadow-sm focus-within:ring-1 focus-within:ring-ring min-w-[250px]">
          <Editor
            value={query}
            onValueChange={setQuery}
            highlight={highlight}
            padding={12}
            placeholder={'Enter SQL query'}
            disabled={loading}
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.875rem',
              lineHeight: '0.5rem',
              backgroundColor: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              caretColor: 'hsl(var(--primary))',
            }}
            textareaClassName="focus:outline-none"
            preClassName="m-0"
            className="w-full rounded-md"
          />
        </div>
        <Button onClick={handleSearch} disabled={loading || !query.trim()}>
          Run Query
        </Button>
        <Button variant="outline" onClick={onReset} disabled={loading}>
          Reset
        </Button>
        <TableInfo />
      </div>
    </div>
  );
}
