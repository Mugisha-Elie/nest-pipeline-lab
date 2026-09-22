import { z } from 'zod'

export const AddressSchema = z.object({
  street: z.string().min(1, 'Street cannot be emtpy'),
  city: z.string().min(1, 'City cannot be empty')
})

export const RegisterUserSchema = z.object({
  email: z.string().email('Must provide a valid email address'),
  username: z.string().min(4, 'Username must be at leat 4 characters long'),
  age: z
    .number({ message: 'Age must be a number' })
    .int('Age must be an integer')
    .min(18, 'You must be at least 18 years old')
    .max(100, 'Age cannot exceed 100'),

  skills: z.array(z.string({ message: 'Each skill must be a string' })),
  address: AddressSchema
});

export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
