
import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  ssn: z.string().regex(/^\d{3}-\d{2}-\d{4}$/, 'SSN must be in format XXX-XX-XXXX'),
  dateOfBirth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in MM/DD/YYYY format'),
  occupation: z.string().min(1, 'Occupation is required'),
  phoneNumber: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
  filingStatus: z.enum(['single', 'married-joint', 'married-separate', 'head']),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code format'),
  email: z.string().email('Invalid email address')
});

// Income Schema
export const incomeSchema = z.object({
  wages: z.number().min(0, 'Wages cannot be negative'),
  federalWithheld: z.number().min(0, 'Federal withheld cannot be negative'),
  ssWages: z.number().min(0, 'SS wages cannot be negative'),
  ssWithheld: z.number().min(0, 'SS withheld cannot be negative'),
  interestIncome: z.number().min(0, 'Interest income cannot be negative'),
  taxExemptInterest: z.number().min(0, 'Tax exempt interest cannot be negative')
});

// Deductions Schema
export const deductionsSchema = z.object({
  deductionMethod: z.enum(['standard', 'itemized']),
  medicalExpenses: z.number().min(0).optional(),
  stateLocalTax: z.number().min(0).optional(),
  realEstateTax: z.number().min(0).optional(),
  mortgageInterest: z.number().min(0).optional(),
  charitableCash: z.number().min(0).optional(),
  charitableNonCash: z.number().min(0).optional()
});

// User Profile Schema
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
  address: z.string().min(1, 'Address is required'),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean()
  })
});

// Document Upload Schema
export const documentUploadSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  category: z.enum(['income', 'deduction', 'personal', 'other']),
  taxYear: z.string().min(4, 'Tax year is required'),
  files: z.array(z.any()).min(1, 'At least one file is required')
});

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>;
export type IncomeForm = z.infer<typeof incomeSchema>;
export type DeductionsForm = z.infer<typeof deductionsSchema>;
export type UserProfileForm = z.infer<typeof userProfileSchema>;
export type DocumentUploadForm = z.infer<typeof documentUploadSchema>;
