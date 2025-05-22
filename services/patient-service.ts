// services/patient/createPatient.ts
import { getDB } from '@/db/pglite';
import { escapeString } from '@/lib/utils';
import { RegisterFormSchema } from '@/schemas/register-form.schema';
import { v4 as uuidv4 } from 'uuid';

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

  console.log('query ', query);

  await db.exec(query);

  return { success: true, patientId };
}
