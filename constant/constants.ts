export const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

export const BLOOD_GROUP_OPTIONS = [
  { label: 'A+', value: 'A+' },
  { label: 'A-', value: 'A-' },
  { label: 'B+', value: 'B+' },
  { label: 'B-', value: 'B-' },
  { label: 'AB+', value: 'AB+' },
  { label: 'AB-', value: 'AB-' },
  { label: 'O+', value: 'O+' },
  { label: 'O-', value: 'O-' },
];

export const PHONE_REGEX = /^\+?[0-9\s\-]{10,15}$/;

export const ACTION_STATUS = {
  IDLE: 'idle',
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
};

export const PATIENT_BROADCAST_TYPES = {
  PATIENT_CREATED: 'PATIENT_CREATED',
};

export const FORBIDDEN_QUERY_KEYWORDS = [
  'insert',
  'update',
  'delete',
  'drop',
  'alter',
  'create',
  'truncate',
  'grant',
  'revoke',
  'merge',
  'commit',
  'rollback',
  'savepoint',
  'lock',
  'unlock',
  'transaction',
  'procedure',
  'function',
  'explain',
  'execute',
  'prepare',
  'vacuum',
  'copy',
  'comment',
];
