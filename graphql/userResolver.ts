import { validate } from "graphql";
import { db } from "../assets/db_connection";
import { AddUserSchema, UpdateUserSchema } from "../assets/validation";
import fs from "fs";
import path from "path";
import { deleteImage } from "../assets/upload";
export const UserResolver = {
  Query: {
    getUsers: async () => {
      const [rows] = await db.query("SELECT * FROM users ORDER BY id DESC");
      return rows;
    },

    getUserById: async (_: any, { id }: any) => {
      const [rows]: any = await db.query("SELECT * FROM users WHERE id = ?", [
        id,
      ]);
      return rows[0] || null;
    },
  },
  Mutation: {
    createUser: async (_: any, { input }: any, context: any) => {
      try {
        // 1. Validate input
        const validated = AddUserSchema.parse(input);
        const files = context.req.files;

        const profile =
          files?.profile?.[0]?.filename || validated.profile || null;

        const prevClassDocument =
          files?.prevClassDocument?.[0]?.filename ||
          validated.prevClassDocument ||
          null;
        const sql = `
          INSERT INTO users 
          (name, role, email, age, phone, guardianPhone, guardianName, father_name, profile, class, grade, gender, city, prevClassDocument) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
          validated.name,
          validated.role,
          validated.email,
          validated.age,
          validated.phone,
          validated.guardianPhone || null,
          validated.guardianName || null,
          validated.father_name || null,
          profile,
          validated.class || null,
          validated.grade,
          validated.gender,
          validated.city || null,
          prevClassDocument,
        ];
        const [result]: any = await db.query(sql, values);
        return {
          id: result.insertId,
          ...validated,
          profile,
          prevClassDocument,
        };
      } catch (err: any) {
        console.error(err);
        throw new Error(err.message || "Failed to create user");
      }
    },

    updateUser: async (_: any, { id, input }: any, context: any) => {
      try {
        const req = context.req;
        const validated = UpdateUserSchema.parse(input);
        let profilePath = validated.profile || null;
        let prevDocPath = validated.prevClassDocument || null;

        if (req?.file) {
          profilePath = req.file.filename;
        }
        if (req?.files) {
          if (req.files.profile) {
            deleteImage(id, "users", "profile");

            profilePath = req.files.profile[0].filename;
          }

          if (req.files.prevClassDocument) {
            deleteImage(id, "users", "prevClassDocument");
            prevDocPath = req.files.prevClassDocument[0].filename;
          }
        }

        const finalInput = {
          ...validated,
          ...(profilePath ? { profile: profilePath } : {}),
          ...(prevDocPath ? { prevClassDocument: prevDocPath } : {}),
        };
        const fields = Object.keys(finalInput);
        if (fields.length === 0) {
          throw new Error("No fields provided to update.");
        }
        const updateClause = fields.map((field) => `${field} = ?`).join(", ");
        const values = Object.values(finalInput);
        const sql = `
      UPDATE users
      SET ${updateClause}
      WHERE id = ?
    `;

        await db.query(sql, [...values, id]);

        // (5) --- FETCH THE UPDATED DATA
        const [rows]: any = await db.query("SELECT * FROM users WHERE id = ?", [
          id,
        ]);

        if (!rows.length) {
          throw new Error("User not found");
        }

        return rows[0];
      } catch (err: any) {
        throw new Error(err.message || "Failed to update user");
      }
    },
    deleteUser: async (_: any, { id }: any) => {
      try {
        const sql = `DELETE FROM users WHERE id = ?`;
        const values = { id };
        deleteImage(id, "users", "profile");
        deleteImage(id, "users", "prevClassDocument");
        const [rseult]: any = await db.query(sql, values);
        return {
          success: true,
          message: "Activity deleted successfully",
        };
      } catch (err) {
        throw err;
      }
    },
  },
};
