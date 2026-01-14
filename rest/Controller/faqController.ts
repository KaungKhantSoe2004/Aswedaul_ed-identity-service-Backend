import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { db } from "../../assets/db_connectionk.js";
import { Faq } from "../../assets/types.js";
 
export async function createFaq(req: Request<{}, {}, Omit<Faq, "id" | "created_at">>, res: Response) {
  try {
    console.log(req.body)
    const { question, answer } = req.body;

    const query = "INSERT INTO faqs (question, answer) VALUES (?, ?)";
    const values = [question, answer];

    const [result]: any = await db.query(query, values);

    res.status(201).json({
      status: true,
      message: "FAQ created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating FAQ:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getFaqs(req: Request, res: Response) {
  try {

    const [rows] = await db.query<(Faq & RowDataPacket)[]>("SELECT * FROM faqs ORDER BY created_at DESC");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error getting FAQs:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFaqById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const [rows] = await db.query<(Faq & RowDataPacket)[]>("SELECT * FROM faqs WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error getting FAQ:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function updateFaq(
  req: Request<{}, {}, Omit<Faq, "created_at">>,
  res: Response
) {
  try {
 
    const { id ,question, answer } = req.body;

    const [existingRows] = await db.query<(Faq & RowDataPacket)[]>("SELECT * FROM faqs WHERE id = ?", [id]);

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    const query = "UPDATE faqs SET question = ?, answer = ? WHERE id = ?";
    const values = [
      question || existingRows[0].question,
      answer || existingRows[0].answer,
      id,
    ];

    await db.query(query, values);

    const [updatedRows] = await db.query<(Faq & RowDataPacket)[]>("SELECT * FROM faqs WHERE id = ?", [id]);

    res.status(200).json({ message: "FAQ updated successfully", faq: updatedRows[0] });
  } catch (err) {
    console.error("Error updating FAQ:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function deleteFaq(req: Request<{ id: string }>, res: Response) {
  try {
    console.log('in faq deleting')
    const { id } = req.params;

    const [existingRows] = await db.query<(Faq & RowDataPacket)[]>("SELECT * FROM faqs WHERE id = ?", [id]);

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    await db.query("DELETE FROM faqs WHERE id = ?", [id]);

    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (err) {
    console.error("Error deleting FAQ:", err);
    res.status(500).json({ message: "Internal Server Errorrrrr" });
  }
}
