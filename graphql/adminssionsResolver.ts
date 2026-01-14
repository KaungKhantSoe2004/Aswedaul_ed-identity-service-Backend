import { db } from "../assets/db_connection"; // <-- direct import

export const admissionResolver = {
  admissions: async () => {
    const [rows] = await db.query("SELECT * FROM admissions ORDER BY id DESC");
    return rows;
  },

  admission: async (_: any, { id }: any) => {
    const [rows]: any = await db.query(
      "SELECT * FROM admissions WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  },
  createAdmission: async (_: any, { input }: any) => {
    const {
      name,
      email,
      age,
      phone,
      prevSchool_doc,
      grade,
      gender,
      guardianName,
      guardianPhone,
      guardianEmail,
      profile,
    } = input;

    const sql = `
        INSERT INTO admissions 
        (name, email, age, phone, prevSchool_doc, grade, gender, guardianName, guardianPhone, guardianEmail, profile)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    const values = [
      name,
      email,
      age,
      phone,
      prevSchool_doc,
      grade,
      gender,
      guardianName,
      guardianPhone,
      guardianEmail,
      profile,
    ];

    const [result]: any = await db.query(sql, values);

    return { id: result.insertId, ...input };
  },

  updateAdmission: async (_: any, { id, input }: any) => {
    const fields = Object.keys(input);
    const values = Object.values(input);

    const updateQuery = `
        UPDATE admissions 
        SET ${fields.map((f) => `${f} = ?`).join(", ")}
        WHERE id = ?
      `;

    await db.query(updateQuery, [...values, id]);

    const [rows]: any = await db.query(
      "SELECT * FROM admissions WHERE id = ?",
      [id]
    );

    return rows[0];
  },

  deleteAdmission: async (_: any, { id }: any) => {
    await db.query("DELETE FROM admissions WHERE id = ?", [id]);
    return { message: "Admission deleted successfully", id };
  },
};
