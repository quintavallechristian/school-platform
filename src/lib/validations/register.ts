import { z } from 'zod'

/**
 * Schema di validazione per la registrazione di una nuova scuola
 */
export const registerSchoolSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email richiesta')
      .email('Formato email non valido')
      .toLowerCase()
      .trim(),

    firstName: z
      .string()
      .min(2, 'Nome responsabile richiesto')
      .max(50, 'Nome responsabile troppo lungo')
      .trim(),

    lastName: z
      .string()
      .min(2, 'Cognome responsabile richiesto')
      .max(50, 'Cognome responsabile troppo lungo')
      .trim(),

    schoolName: z
      .string()
      .min(3, 'Nome scuola richiesto')
      .max(100, 'Nome scuola troppo lungo')
      .trim()
      .refine(
        (val) => !/[<>"'`]/.test(val),
        'Nome scuola contiene caratteri non permessi (<, >, ", \', `)',
      ),

    password: z
      .string()
      .min(8, 'Password richiesta - deve essere di almeno 8 caratteri')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
        'La password deve contenere almeno una lettera maiuscola, una minuscola e un numero',
      ),

    confirmPassword: z.string().min(1, 'Conferma password richiesta'),

    acceptPrivacy: z.boolean().refine((val) => val === true, {
      message: 'Devi accettare la privacy policy per continuare',
    }),

    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Devi accettare i termini e condizioni per continuare',
    }),

    acceptDpa: z.boolean().refine((val) => val === true, {
      message: 'Devi accettare il Data processing agreement per continuare',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Le password non coincidono',
    path: ['confirmPassword'],
  })

/**
 * Type inference dal schema Zod
 */
export type RegisterSchoolInput = z.infer<typeof registerSchoolSchema>
