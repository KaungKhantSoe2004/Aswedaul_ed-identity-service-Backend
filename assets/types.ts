import { Request } from "express";
export type Admission = {
  id: number;
  name: string;
  email: string;
  age: string;
  phone: string;
  prevSchool_doc: string;
  grade: string;
  gender: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  profile: string;
  created_at: string;
  updated_at: string;
};



interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

// Extend Request for your file uploads
export interface RequestWithFiles extends Request {
  files?: {
    profile?: MulterFile[];
    image?: MulterFile[];
    prevSchool_doc?: MulterFile[];
  };
}
export interface RequestWithFile extends Request {
  file?: MulterFile 
} 

export type admissionResponse = {
  success: boolean;
  message: string;
  data: Admission;
};

export type UserCreateData = {
   id: number;
  name: string;
  role: string;
  email: string;
  age: string;
  phone: string;
  remaining_fee: string;
  guardianPhone: string;
  guardianName: string;
  father_name: string;
  profile: string;
  class: string;
  grade: string;
  gender: string;
  city: string;
  prevClassDocument: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export type AdminCreateData = {
  id: number;
  name: string;
  email: string,
  phone: string,
  role: string,
  password: string,
  city: string,
  academic_year: string,
  age: string,
  gender: string,
  monthly_salary: string,
}


export type ManagerCreateData = {
  id: number;
  name: string;
    email: string;
      phone: string;
      role: string;
  age: string;
  password: string;
  city: string;
    // profile: string;
    academic_year: string;
  grade: string;
  gender: string;
  monthly_salary: string;
  
}
export type TeacherCreateData = {
   id: number;
  name: string;
  role: string;
  email: string;
  age: string;
  phone: string;
  profile: string;
  classAssigned: string;
  grade: string;
  gender: string;
  city: string;
  password: string;
  monthly_salary: string;
  subject: string;
  created_at: string;
  updated_at: string;
  academic_year: string;
}


export type User = {
  id: number;
  name: string;
  role: string;
  email: string;
  age: string;
  phone: string;
  guardianPhone: string | null;
  guardianName: string | null;
  father_name: string | null;
  profile: string;
  class: string | null;
  grade: string;
  gender: string;
  city: string;
  prevClassDocument: string | null;
  created_at: string;
  updated_at: string;
};

export type UserResponse = {
  success: boolean;
  message: string;
  data: User | User[];
};

export type Activity = {
  
  id: number;
  activityName: string;
  image: string;
  created_at: string;
};

export type ActivityResponse = {
  success: boolean;
  message: string;
  data: Activity | Activity[];
};

export type Faq = {
  id: number;
  question: string;
  answer: string;
  created_at: string;
};
export type FaqResponse = {
  success: boolean;
  message: string;
  data: Faq | Faq[];
};

export type Gallery = {
  id: number;
  galleryName: string;
  image: string;
  created_at: string;
};

export type GalleryResponse = {
  success: boolean;
  message: string;
  data: Gallery | Gallery[];
};

export type ErrorResponse = {
  success: boolean;
  message: string;
};

export type DeleteResponse = {
  success: boolean;
  message: string;
};

// input
export type UserInputType = {
  name: string;
  role: string;
  email: string;
  age: string;
  phone: string;
  guardianPhone?: string;
  guardianName?: string;
  father_name?: string;
  profile?: string;
  class?: string;
  grade: string;
  gender: string;
  city?: string;
  prevClassDocument?: string;
};
