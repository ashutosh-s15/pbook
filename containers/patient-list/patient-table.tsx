'use client';

import { DataTable } from '@/components/data-table';
import { SqlSearchInput } from '@/components/sql-search-input';
import { Badge } from '@/components/ui/badge';
import { usePatientList } from '@/hooks/usePatientList';
import { showToast } from '@/lib/toast';
import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export const patientColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'firstname',
    header: 'First Name',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('firstname')}</span>
    ),
    size: 200,
  },
  {
    accessorKey: 'lastname',
    header: 'Last Name',
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue('lastname')}</span>
    ),
    size: 200,
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    size: 100,
  },
  {
    accessorKey: 'dob',
    header: 'Date of Birth',
    size: 130,
    cell: ({ row }) => {
      const dob = new Date(row.original.dob);
      return dob.toLocaleDateString();
    },
  },
  {
    accessorKey: 'age',
    header: 'Age',
    size: 80,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 250,
  },
  {
    accessorKey: 'contactnumber',
    header: 'Contact Number',
    size: 160,
  },
  {
    accessorKey: 'bloodgroup',
    header: 'Blood Group',
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.bloodgroup}
        </Badge>
      </div>
    ),
    size: 110,
  },
  {
    accessorKey: 'city',
    header: 'City',
    size: 120,
  },
  {
    accessorKey: 'state',
    header: 'State',
    size: 100,
  },
  {
    accessorKey: 'country',
    header: 'Country',
    size: 100,
  },
  {
    accessorKey: 'registrationdate',
    header: 'Registered At',
    size: 180,
    cell: ({ row }) => {
      const date = new Date(row.original.registrationdate);
      return date.toLocaleString();
    },
  },
];

function PatientTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [dynamicColumns, setDynamicColumns] =
    useState<ColumnDef<any>[]>(patientColumns);

  const router = useRouter();

  const {
    patients,
    totalCount,
    loading,
    runCustomQuery,
    resetQuery,
    isCustomQuery,
  } = usePatientList(pagination.pageIndex, pagination.pageSize);

  const handleSqlSearch = async (query: string) => {
    try {
      const { columns } = await runCustomQuery(query);

      if (columns.length > 0) {
        const newColumns = columns.map(key => ({
          accessorKey: key.toLowerCase(),
          header: key.charAt(0).toUpperCase() + key.slice(1),
          cell: ({ row }: { row: any }) => {
            const value = row.getValue(key.toLowerCase());
            // Special handling for dates
            if (
              key.toLowerCase().includes('date') ||
              key.toLowerCase().includes('dob')
            ) {
              try {
                const date = new Date(value);
                return date.toLocaleDateString();
              } catch {
                return value;
              }
            }
            return value;
          },
        }));
        setDynamicColumns(newColumns);
      }
    } catch (error) {
      showToast({
        title: 'SQL Error',
        description:
          error instanceof Error ? error.message : 'Invalid SQL query',
        type: 'error',
      });
    }
  };

  const handleReset = async () => {
    await resetQuery();
    setDynamicColumns(patientColumns);
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  const registerPatientButtonClickHandler = () => {
    router.push('/register');
  };

  const paginatedPatients = isCustomQuery
    ? patients.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
      )
    : patients;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <SqlSearchInput
          onSearch={handleSqlSearch}
          onReset={handleReset}
          loading={loading}
        />
      </div>

      <DataTable
        data={paginatedPatients}
        columns={isCustomQuery ? dynamicColumns : patientColumns}
        loading={loading}
        pagination={pagination}
        onPaginationChange={setPagination}
        pageCount={Math.ceil(totalCount / pagination.pageSize)}
        manualPagination
        showAddItemButton={true}
        addItemButtonTitle="Register Patient"
        addItemButtonClickHandler={registerPatientButtonClickHandler}
      />
    </div>
  );
}

export default PatientTable;
