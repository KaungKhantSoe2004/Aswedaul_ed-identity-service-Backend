import { db } from "../assets/db_connection";

export const FaqResolver = {
  faqs: async () => {
    const [rows] = await db.query("SELECT * FROM faqs ORDER BY id DESC");
    return {
      success: true,
      message: "Faq returns successfully",
      data: rows,
    };
  },

  faq: async (_: any, { id }: any) => {
    const [rows]: any = await db.query("SELECT * FROM faqs WHERE id = ?", [id]);
    return {
      success: true,
      message: "Got FAQ successfully",
      data: rows[0],
    };
  },

  createFaq: async (_: any, { input }: any) => {
    try {
      const [question, answer] = input;
      const sql = `INSERT INTO faqs (question, answer) VALUES (?, ?)`;
      const values = { question, answer };
      const [result]: any = await db.query(sql, values);
      const data = { ...result };
      return {
        success: true,
        message: "Faq created successfully",
        data,
      };
    } catch (err) {
      throw err;
    }
  },
  updateFaq: async (_: any, { id, input }: any) => {
    try {
      const [question, answer] = input;
      const sql = `UPDATE faqs SET question = ?, answer = ? WHERE id = ?`;
      const values = { question, answer, id };
      const [result]: any = await db.query(sql, values);
      const data = { ...result };
      return {
        success: true,
        message: "Faq updated successfully",
        data,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteFaq: async (_: any, { id }: any) => {
    try {
      const sql = `DELETE FROM faqs WHERE id = ?`;
      const values = { id };
      const [rseult]: any = await db.query(sql, values);
      return {
        success: true,
        message: "Faq deleted successfully",
      };
    } catch (err) {
      throw err;
    }
  },
};
