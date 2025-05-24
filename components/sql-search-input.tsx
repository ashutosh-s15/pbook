'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/lib/toast';
import { useState } from 'react';

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

  return (
    <div className="space-y-2 w-full">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter SELECT query (e.g., SELECT * FROM patients WHERE age > 30)"
          className="flex-1"
          disabled={loading}
        />
        <Button onClick={handleSearch} disabled={loading || !query.trim()}>
          Run Query
        </Button>
        <Button variant="outline" onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </div>
    </div>
  );
}
