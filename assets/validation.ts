import { z } from "zod";
import { db } from "./db_connection";

export const AddUserSchema = z.object({
  name: z.string().min(1),
  role: z.string(),
  email: z.string().email(),
  age: z.string(),
  phone: z.string().min(7),
  guardianPhone: z.string().optional(),
  guardianName: z.string().optional(),
  father_name: z.string().optional(),
  profile: z.string().optional(),
  class: z.string().optional(),
  grade: z.string(),
  gender: z.string(),
  city: z.string().optional(),
  prevClassDocument: z.string().optional(),
});
export type AddUserInput = z.infer<typeof AddUserSchema>;

export const UpdateUserSchema = AddUserSchema.partial(); // all optional
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;


export async function isEmailTaken(email: string): Promise<boolean> {
  const [rows]: any = await db.query(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows.length > 0;
}



export const studentSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(1),
  email: z.string().email(),
  remaining_fee: z.string(),
  age: z.coerce.number().min(1),
  phone: z.string().min(7),
  guardianPhone: z.string().min(7),
  guardianName: z.string().min(2),
  father_name: z.string().min(2),
  class: z.string().min(1),
  grade: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  city: z.string().min(2),
  password: z.string().min(6),
});


export const teacherSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  role: z.string(),
  password: z.string().min(6),
  age: z.coerce.number().min(18),
  grade: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  city: z.string().min(2),
  academic_year: z.string().min(4),
  subject: z.string().min(2),
  classAssigned: z.string().min(1),
  monthly_salary: z.coerce.number().min(0),
});

export const managerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  role: z.string(),
  password: z.string().min(6),
  age: z.coerce.number().min(18),
  city: z.string().min(2),
  academic_year: z.string().min(4),
  grade: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  monthly_salary: z.coerce.number().min(0),
});


export const adminSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  role: z.string(),
  password: z.string().min(6),
  age: z.coerce.number().min(18),
  city: z.string().min(2),
  academic_year: z.string().min(4),
  gender: z.enum(["male", "female", "other"]),
  monthly_salary: z.coerce.number().min(0),
});



function formatZodErrors(fieldErrors: Record<string, string[] | undefined>) {
  const formatted: Record<string, string> = {};
  for (const key in fieldErrors) {
    if (fieldErrors[key] && fieldErrors[key]?.length > 0) {
      formatted[key] = fieldErrors[key]![0]; // take first message
    }
  }
  return formatted;
}

export async function validateStudentData(data: any) {
  const parsed = studentSchema.safeParse(data);

if (!parsed.success) {
  return {
    success: false,
    type: "validation-error",
    errors: formatZodErrors(parsed.error.flatten().fieldErrors),
  };
}



  if (await isEmailTaken(parsed.data.email)) {
    return {
      success: false,
      type: "email-exists",
      errors: { email: ["Email already exists"] },
    };
  }

  return { success: true, data: parsed.data };
}


export async function validateTeacherData(data: any) {
  const parsed = teacherSchema.safeParse(data);


if (!parsed.success) {
  return {
    success: false,
    type: "validation-error",
    errors: formatZodErrors(parsed.error.flatten().fieldErrors),
  };
}
  if (await isEmailTaken(parsed.data.email)) {
    return {
      success: false,
      type: "email-exists",
      errors: { email: ["Email already exists"] },
    };
  }

  return { success: true, data: parsed.data };
}

export async function validateManagerData(data: any) {
  const parsed = managerSchema.safeParse(data);


if (!parsed.success) {
  return {
    success: false,
    type: "validation-error",
    errors: formatZodErrors(parsed.error.flatten().fieldErrors),
  };
}
  if (await isEmailTaken(parsed.data.email)) {
    return {
      success: false,
      type: "email-exists",
      errors: { email: ["Email already exists"] },
    };
  }

  return { success: true, data: parsed.data };
}


export async function validateAdminData(data: any) {
  const parsed = adminSchema.safeParse(data);


if (!parsed.success) {
  return {
    success: false,
    type: "validation-error",
    errors: formatZodErrors(parsed.error.flatten().fieldErrors),
  };
}
  if (await isEmailTaken(parsed.data.email)) {
    return {
      success: false,
      type: "email-exists",
      errors: { email: ["Email already exists"] },
    };
  }

  return { success: true, data: parsed.data };
}