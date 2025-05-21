import { PHONE_REGEX } from '@/constant/constants';
import * as z from 'zod';

export const registerFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(50, 'First name cannot exceed 50 characters'),

  lastName: z
    .string()
    .trim()
    .max(50, 'Last name cannot exceed 50 characters')
    .optional(),

  gender: z.string().min(1, 'Gender is required'),

  dob: z.string().refine(
    date => {
      const inputDate = new Date(date);
      return inputDate < new Date();
    },
    { message: 'Date of birth must be in the past' }
  ),

  email: z.string().trim().email('Invalid email address'),

  contactNumber: z
    .string()
    .trim()
    .min(10, 'Contact number must be at least 10 digits')
    .max(15, 'Contact number must be at most 15 digits')
    .regex(PHONE_REGEX, 'Invalid phone number'),

  bloodGroup: z.string().min(1, 'Blood group is required'),

  allergies: z
    .string()
    .trim()
    .max(200, 'Allergies should not exceed 200 characters')
    .optional(),

  notes: z
    .string()
    .trim()
    .max(500, 'Notes should not exceed 500 characters')
    .optional(),

  addressLine1: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters'),

  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),

  emergencyContactName: z
    .string()
    .trim()
    .min(1, 'Emergency contact name is required')
    .max(100, 'Name too long'),

  emergencyContactNumber: z
    .string()
    .trim()
    .min(10, 'Emergency contact number must be at least 10 digits')
    .max(15, 'Emergency contact number must be at most 15 digits')
    .regex(PHONE_REGEX, 'Invalid phone number'),

  relationToPatient: z
    .string()
    .trim()
    .min(1, 'Relation to patient is required')
    .max(100, 'Relation description too long'),
});

export type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export const registerFormInitialValues: RegisterFormSchema = {
  firstName: '',
  lastName: '',
  gender: '',
  dob: '',
  email: '',
  contactNumber: '',
  bloodGroup: '',
  allergies: '',
  notes: '',
  addressLine1: '',
  city: '',
  state: '',
  country: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  relationToPatient: '',
};
