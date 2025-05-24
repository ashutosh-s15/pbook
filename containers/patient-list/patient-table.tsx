'use client';

import { DataTable } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { usePatientList } from '@/hooks/usePatientList';
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

  const router = useRouter();

  const { patients, totalCount, loading, refetch } = usePatientList(
    pagination.pageIndex,
    pagination.pageSize
  );

  const registerPatientButtonClickHandler = () => {
    router.push('/register');
  };

  return (
    <DataTable
      data={patients}
      columns={patientColumns}
      loading={loading}
      pagination={pagination}
      onPaginationChange={setPagination}
      pageCount={Math.ceil(totalCount / pagination.pageSize)}
      manualPagination
      showAddItemButton={true}
      addItemButtonTitle="Register Patient"
      addItemButtonClickHandler={registerPatientButtonClickHandler}
    />
  );
}

export default PatientTable;
