// services/patient/createPatient.ts
import { PATIENT_BROADCAST_TYPES } from '@/constant/constants';
import { getDB } from '@/db/pglite';
import { patientChannel } from '@/lib/broadcast';
import { escapeString } from '@/lib/utils';
import { RegisterFormSchema } from '@/schemas/register-form.schema';
import { v4 as uuidv4 } from 'uuid';

export interface GetPatientsParams {
  page: number;
  pageSize: number;
}

export async function createPatient(data: RegisterFormSchema) {
  const db = await getDB();

  const patientId = uuidv4();
  const registrationDate = new Date().toISOString();

  const dobDate = new Date(data.dob);
  const age = new Date().getFullYear() - dobDate.getFullYear();

  const query = `
    INSERT INTO patients (
      patientId,
      firstName,
      lastName,
      gender,
      dob,
      age,
      email,
      contactNumber,
      bloodGroup,
      allergies,
      notes,
      addressLine1,
      city,
      state,
      country,
      emergencyContactName,
      emergencyContactNumber,
      relationToPatient,
      registrationDate
    ) VALUES (
      '${escapeString(patientId)}',
      '${escapeString(data.firstName)}',
      '${escapeString(data.lastName ?? '')}',
      '${escapeString(data.gender)}',
      '${escapeString(data.dob)}',
      ${age},
      '${escapeString(data.email)}',
      '${escapeString(data.contactNumber)}',
      '${escapeString(data.bloodGroup)}',
      '${escapeString(data.allergies ?? '')}',
      '${escapeString(data.notes ?? '')}',
      '${escapeString(data.addressLine1)}',
      '${escapeString(data.city)}',
      '${escapeString(data.state)}',
      '${escapeString(data.country)}',
      '${escapeString(data.emergencyContactName)}',
      '${escapeString(data.emergencyContactNumber)}',
      '${escapeString(data.relationToPatient)}',
      '${escapeString(registrationDate)}'
    );
  `;

  await db.exec(query);

  // Broadcast the update to other tabs
  patientChannel.postMessage({
    type: PATIENT_BROADCAST_TYPES.PATIENT_CREATED,
    patientId,
  });

  return { success: true, patientId };
}

export async function getPatients({ page, pageSize }: GetPatientsParams) {
  const db = await getDB();
  const offset = page * pageSize;

  const result = await db.exec(`
    SELECT * FROM patients LIMIT ${pageSize} OFFSET ${offset};
  `);

  const countResult = await db.exec(`SELECT COUNT(*) as total FROM patients;`);

  const patients = result[0]?.rows ?? [];
  const totalCount = countResult[0]?.rows?.[0]?.total ?? 0;

  return {
    patients,
    totalCount,
  };
}
