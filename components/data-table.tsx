'use client';

import * as React from 'react';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconPlus,
} from '@tabler/icons-react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Inbox, Loader2 } from 'lucide-react';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  pageCount?: number;
  manualPagination?: boolean;
  showAddItemButton?: boolean;
  addItemButtonTitle?: string;
  addItemButtonClickHandler?: () => void;
}

export function DataTable<TData>({
  data,
  columns,
  loading,
  pagination: propPagination,
  onPaginationChange,
  showAddItemButton,
  addItemButtonTitle,
  addItemButtonClickHandler,
  pageCount = -1,
  manualPagination = false,
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isResizing, setIsResizing] = React.useState(false);

  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const pagination = propPagination || internalPagination;
  const setPagination = React.useCallback(
    (
      updater: PaginationState | ((prev: PaginationState) => PaginationState)
    ) => {
      if (onPaginationChange) {
        const newPagination =
          typeof updater === 'function'
            ? updater(propPagination || internalPagination)
            : updater;
        onPaginationChange(newPagination);
      } else {
        setInternalPagination(updater);
      }
    },
    [onPaginationChange, propPagination, internalPagination]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    pageCount,
    manualPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode: 'onChange',
    defaultColumn: {
      minSize: 60,
      size: 150,
      maxSize: 500,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: manualPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // Handle column resizing
  const startResizing = React.useCallback(
    (headerId: string, event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsResizing(true);

      const headerElement = event.currentTarget.parentElement;
      if (!headerElement) return;

      const startWidth = headerElement.offsetWidth;
      const startX = event.clientX;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        table.setColumnSizing(old => ({
          ...old,
          [headerId]: Math.max(60, Math.min(500, newWidth)),
        }));
      };

      const onMouseUp = () => {
        setIsResizing(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [table]
  );

  React.useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isResizing]);

  return (
    <div className="flex w-full flex-col justify-start gap-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  column =>
                    typeof column.accessorFn !== 'undefined' &&
                    column.getCanHide()
                )
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {showAddItemButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={addItemButtonClickHandler}
            >
              <IconPlus />
              <span className="hidden lg:inline">
                {addItemButtonTitle || 'Add Item'}
              </span>
            </Button>
          )}
        </div>
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <div className="relative w-full overflow-auto min-h-[400px]">
            {loading || !table.getRowModel().rows.length ? (
              <div className="flex min-h-[400px] items-center justify-center bg-white">
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <Inbox className="h-4 w-4 opacity-50" />
                    <span className="text-muted-foreground ml-1">
                      No results
                    </span>
                  </>
                )}
              </div>
            ) : (
              <Table className="h-full">
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map(headerGroup => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            width: header.getSize(),
                            position: 'relative',
                          }}
                          className="group overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </div>
                          <div
                            className={`
                              absolute right-0 top-0 h-full w-1 
                              cursor-col-resize bg-gray-300 
                              hover:bg-blue-500 
                              ${isResizing ? 'bg-blue-600' : ''}
                              opacity-0 group-hover:opacity-100
                            `}
                            onMouseDown={e => startResizing(header.id, e)}
                          />
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map(row => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.getSize(),
                            minWidth: cell.column.getSize(),
                            maxWidth: cell.column.getSize(),
                          }}
                          className="overflow-hidden text-ellipsis"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${pagination.pageSize}`}
                onValueChange={value => {
                  setPagination(prev => ({
                    ...prev,
                    pageSize: Number(value),
                    pageIndex: 0, // Reset to first page when page size changes
                  }));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {pagination.pageIndex + 1} of{' '}
              {pageCount > 0 ? pageCount : table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() =>
                  setPagination(prev => ({ ...prev, pageIndex: 0 }))
                }
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() =>
                  setPagination(prev => ({
                    ...prev,
                    pageIndex:
                      (pageCount > 0 ? pageCount : table.getPageCount()) - 1,
                  }))
                }
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
