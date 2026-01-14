import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { db } from "../assets/db_connection";
import hashPassword from "../assets/hashPassword";

dotenv.config();

interface UserSeed {
  name: string;
  role: string;
  email: string;
  password: string;
  age: string;
  phone: string;
  guardianPhone?: string;
  guardianName?: string;
  father_name?: string;
  profile?: string;
  class?: string;
  grade?: string;
  gender: string;
  city: string;
  academic_year: string;
  prevClassDocument?: string;
  annual_fee?: number | null;
  remaining_fee?: number | null;
}

const users: UserSeed[] = [

  {
    name: "Alice Johnson",
    role: "student",
    email: "alice.johnson@example.com",
    password: "password123",
    age: "15",
    phone: "123-456-7890",
    guardianPhone: "987-654-3210",
    guardianName: "Mary Johnson",
    father_name: "Robert Johnson",
    profile: "alice_profile.jpg",
    class: "10-A",
    grade: "10",
    gender: "Female",
    city: "New York",
    academic_year: "2025-2026",
    prevClassDocument: JSON.stringify(["prev_doc_1.pdf"]),
    annual_fee: 1500,
    remaining_fee: 1000,
  },
  {
    name: "Brian Smith",
    role: "student",
    email: "brian.smith@example.com",
    password: "mypassword",
    age: "16",
    phone: "234-567-8901",
    guardianPhone: "876-543-2109",
    guardianName: "Linda Smith",
    father_name: "John Smith",
    profile: "brian_profile.jpg",
    class: "11-B",
    grade: "11",
    gender: "Male",
    city: "Los Angeles",
    academic_year: "2025-2026",
    prevClassDocument: JSON.stringify(["prev_doc_2.pdf"]),
    annual_fee: 1600,
    remaining_fee: 0,
  },
  {
    name: "Catherine Lee",
    role: "student",
    email: "catherine.lee@example.com",
    password: "secret123",
    age: "14",
    phone: "345-678-9012",
    guardianPhone: "765-432-1098",
    guardianName: "Susan Lee",
    father_name: "Michael Lee",
    profile: "catherine_profile.jpg",
    class: "9-C",
    grade: "9",
    gender: "Female",
    city: "Chicago",
    academic_year: "2025-2026",
    prevClassDocument: JSON.stringify(["prev_doc_3.pdf"]),
    annual_fee: 1400,
    remaining_fee: 800,
  },
  {
    name: "David Brown",
    role: "student",
    email: "david.brown@example.com",
    password: "passw0rd",
    age: "17",
    phone: "456-789-0123",
    guardianPhone: "654-321-0987",
    guardianName: "Patricia Brown",
    father_name: "William Brown",
    profile: "david_profile.jpg",
    class: "12-A",
    grade: "12",
    gender: "Male",
    city: "Houston",
    academic_year: "2025-2026",
    prevClassDocument: JSON.stringify(["prev_doc_4.pdf"]),
    annual_fee: 1700,
    remaining_fee: 1700,
  },

  {
    name: "Emily Carter",
    role: "teacher",
    email: "emily.carter@example.com",
    password: "teach123",
    age: "32",
    phone: "555-122-8899",
    gender: "Female",
    city: "Seattle",
    grade: "N/A",
    academic_year: "2025-2026",
    annual_fee: null,
    remaining_fee: null,
  },
  {
    name: "Daniel Wilson",
    role: "teacher",
    email: "daniel.wilson@example.com",
    password: "teach456",
    age: "41",
    phone: "322-111-9988",
    gender: "Male",
    city: "Denver",
    grade: "N/A",
    academic_year: "2025-2026",
    annual_fee: null,
    remaining_fee: null,
  },


  {
    name: "Sophia Martinez",
    role: "gradeManager",
    email: "sophia.martinez@example.com",
    password: "grade123",
    age: "36",
    phone: "777-333-4444",
    gender: "Female",
    city: "Miami",
    grade: "N/A",
    academic_year: "2025-2026",
    annual_fee: null,
    remaining_fee: null,
  },


  {
    name: "Oliver Thomas",
    role: "guideTeacher",
    email: "oliver.thomas@example.com",
    password: "guide123",
    age: "38",
    phone: "888-111-2222",
    gender: "Male",
    city: "Austin",
    grade: "N/A",
    academic_year: "2025-2026",
    annual_fee: null,
    remaining_fee: null,
  },
  {
    name: "Grace Kelly",
    role: "guideTeacher",
    email: "grace.kelly@example.com",
    password: "guide456",
    age: "29",
    phone: "666-999-0000",
    gender: "Female",
    city: "San Francisco",
    grade: "N/A",
    academic_year: "2025-2026",
    annual_fee: null,
    remaining_fee: null,
  },
];

async function seedUsers() {
  try {
    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);

      const query = `
        INSERT INTO users 
        (name, role, email, password, age, phone, guardianPhone, guardianName, father_name, profile, class, grade, gender, city, academic_year, prevClassDocument, annual_fee, remaining_fee)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        user.name,
        user.role,
        user.email,
        hashedPassword,
        user.age,
        user.phone,
        user.guardianPhone || null,
        user.guardianName || null,
        user.father_name || null,
        user.profile || null,
        user.class || null,
        user.grade || null,
        user.gender,
        user.city,
        user.academic_year,
        user.prevClassDocument || null,
        user.annual_fee ?? null,
        user.remaining_fee ?? null,
      ];

      await db.query(query, values);
      console.log(`Inserted user: ${user.name}`);
    }

    console.log("All users seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding users:", err);
    process.exit(1);
  }
}

seedUsers();
