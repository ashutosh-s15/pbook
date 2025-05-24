import { useEffect, useState, useCallback } from 'react';
import { getPatients } from '@/services/patient-service';
import { executeSelectQuery } from '@/services/sql-query-service';
import { useBroadcastChannel } from './useBroadcastChannel';
import { patientChannel } from '@/lib/broadcast';
import { PATIENT_BROADCAST_TYPES } from '@/constant/constants';
import { resetDBInstance } from '@/db/pglite';

interface Patient {
  [key: string]: any;
}

interface PatientEvent {
  type: 'PATIENT_CREATED';
  patientId: string;
}

interface UsePatientListReturn {
  patients: Patient[];
  totalCount: number;
  loading: boolean;
  refetch: () => Promise<void>;
  runCustomQuery: (query: string) => Promise<{
    rows: Patient[];
    columns: string[];
  }>;
  resetQuery: () => Promise<void>;
  isCustomQuery: boolean;
}

export function usePatientList(
  page: number,
  pageSize: number
): UsePatientListReturn {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCustomQuery, setIsCustomQuery] = useState(false);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { patients, totalCount } = await getPatients({ page, pageSize });
      setPatients(patients);
      setTotalCount(totalCount);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const runCustomQuery = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const { rows, columns } = await executeSelectQuery(query);
      setPatients(rows);
      setTotalCount(rows.length);
      setIsCustomQuery(true);
      return { rows, columns };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetQuery = useCallback(async () => {
    await fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (!isCustomQuery) {
      fetchPatients();
    }
  }, [fetchPatients, isCustomQuery]);

  useBroadcastChannel<PatientEvent>(patientChannel, async msg => {
    if (msg.type === PATIENT_BROADCAST_TYPES.PATIENT_CREATED) {
      resetDBInstance();
      await new Promise(resolve => setTimeout(resolve, 500));

      fetchPatients();
    }
  });

  return {
    patients,
    totalCount,
    loading,
    refetch: fetchPatients,
    runCustomQuery,
    resetQuery,
    isCustomQuery,
  };
}
