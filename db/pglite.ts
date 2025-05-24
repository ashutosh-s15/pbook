import { PGlite } from '@electric-sql/pglite';

let db: PGlite | null = null;

export const resetDBInstance = () => {
  db = null;
};

export const getDB = async (): Promise<PGlite> => {
  if (!db) {
    db = new PGlite('idb://patient');
    await db.waitReady;

    await db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        patientId TEXT PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        gender TEXT,
        dob TEXT,
        age INTEGER,
        email TEXT,
        contactNumber TEXT,
        bloodGroup TEXT,
        allergies TEXT,
        notes TEXT,
        addressLine1 TEXT,
        city TEXT,
        state TEXT,
        country TEXT,
        emergencyContactName TEXT,
        emergencyContactNumber TEXT,
        relationToPatient TEXT,
        registrationDate TEXT
      );
    `);
  }
  return db;
};
