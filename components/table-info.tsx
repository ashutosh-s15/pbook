'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Info } from 'lucide-react';
import Image from 'next/image';

function TableInfo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Show table structure and query guidelines"
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>SQL Query Guidelines</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-2">
          {/* Table Structure Diagram */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">
              Patients Table Structure
            </h3>
            <div className="border rounded-md p-4 bg-white shadow-sm">
              <Image
                src="/patient-table-structure.png"
                alt="Patients table structure diagram"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Query Validation Rules */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Query Requirements</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted/20 rounded-md border">
                <h4 className="font-medium mb-2 text-primary">
                  Allowed Operations
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Only <code className="bg-muted px-1 rounded">SELECT</code>{' '}
                    queries are permitted
                  </li>
                  <li>
                    Queries must start with{' '}
                    <code className="bg-muted px-1 rounded">SELECT</code>{' '}
                    (case-insensitive)
                  </li>
                  <li>Results are automatically limited to 100 rows</li>
                </ul>
              </div>

              <div className="p-4 bg-muted/20 rounded-md border">
                <h4 className="font-medium mb-2 text-destructive">
                  Restricted Operations
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    No <code className="bg-muted px-1 rounded">INSERT</code>,{' '}
                    <code className="bg-muted px-1 rounded">UPDATE</code>,{' '}
                    <code className="bg-muted px-1 rounded">DELETE</code>
                  </li>
                  <li>
                    No <code className="bg-muted px-1 rounded">DROP</code>,{' '}
                    <code className="bg-muted px-1 rounded">ALTER</code>,{' '}
                    <code className="bg-muted px-1 rounded">CREATE</code>
                  </li>
                  <li>
                    No multiple statements (cannot use{' '}
                    <code className="bg-muted px-1 rounded">;</code> separator)
                  </li>
                  <li>
                    No SQL comments (
                    <code className="bg-muted px-1 rounded">--</code> or{' '}
                    <code className="bg-muted px-1 rounded">/* */</code>)
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-muted/20 rounded-md border">
                <h4 className="font-medium mb-2 text-primary">Query Tips</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Whitespace is automatically trimmed from your query</li>
                  <li>Syntax errors will show user-friendly messages</li>
                  <li>Results are always returned in safe object format</li>
                  <li>The database is in read-only mode</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-lg">Example Queries</h3>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-md">
                <code className="text-sm font-mono block">{`SELECT firstname, lastname FROM patients WHERE age > 30`}</code>
                <p className="text-muted-foreground text-sm mt-1">
                  Get names of patients over 30 years old
                </p>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <code className="text-sm font-mono block">
                  SELECT city, COUNT(*) as patient_count FROM patients GROUP BY
                  city
                </code>
                <p className="text-muted-foreground text-sm mt-1">
                  Count patients by city
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TableInfo;
