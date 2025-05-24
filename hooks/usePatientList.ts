import { useEffect, useState, useCallback } from 'react';
import { getPatients } from '@/services/patient-service';
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

export function usePatientList(page: number, pageSize: number) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useBroadcastChannel<PatientEvent>(patientChannel, async msg => {
    if (msg.type === PATIENT_BROADCAST_TYPES.PATIENT_CREATED) {
      resetDBInstance();
      await new Promise(resolve => setTimeout(resolve, 500));

      fetchPatients();
    }
  });

  return { patients, totalCount, loading, refetch: fetchPatients };
}
