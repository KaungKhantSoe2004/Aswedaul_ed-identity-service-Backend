import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { db } from "../../assets/db_connection";
import { Activity, RequestWithFile } from "../../assets/types"; // 💡 Updated to use RequestWithFile
import { deleteImage } from "../../assets/upload.js"; // 💡 Added deleteImage

// CREATE ACTIVITY
export async function CreateActivity(
  req: RequestWithFile & { body: { activityName: string } },
  res: Response
) {
  try {
    const { activityName } = req.body;
    // NOTE: For 'RequestWithFile', req.file holds the single file object from Multer
    const image = req.file?.filename || ""; 

    const query = "INSERT INTO activities (activityName, image) VALUES (?, ?)";
    const values = [activityName, image];

    const [result]: any = await db.query(query, values);

    res.status(201).json({
      status: true,
      message: "Activity created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating activity:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET ALL
export async function getActivities(req: Request, res: Response) {
  try {
    const [rows] = await db.query<(Activity & RowDataPacket)[]>(
      "SELECT * FROM activities"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error getting activities:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getActivityById(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;

  try {
    const [rows] = await db.query<(Activity & RowDataPacket)[]>( // 💡 Switched to db.query
      "SELECT * FROM activities WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Activity not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error getting activity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function UpdateActivity(
  req: RequestWithFile & { body: { activityName?: string, id: string } }, // 💡 Simplified body structure to match Gallery's update
  res: Response
) {
  try {
    const { activityName, id } = req.body;

    const [existingRows] = await db.query<(Activity & RowDataPacket)[]>(
      "SELECT * FROM activities WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Activity not found" });
    }
    const existingActivity = existingRows[0];

    if (!req.file) {

      const query = "UPDATE activities SET activityName = ? WHERE id = ?";
      const values = [activityName, id];
      await db.query(query, values);
    } else {
      // 2. Name and Image update
      const image = req.file.filename;

      // Delete old image before updating DB
      deleteImage(id, 'activities', 'image'); 

      const query = "UPDATE activities SET activityName = ?, image = ? WHERE id = ?";
      const values = [activityName, image, id];
      await db.query(query, values);
    }

    // Fetch and return the updated row
    const [updatedRows] = await db.query<(Activity & RowDataPacket)[]>(
      "SELECT * FROM activities WHERE id = ?",
      [id]
    );

    res.status(200).json({ message: "Activity updated successfully", activity: updatedRows[0] });
  } catch (err) {
    console.error("Error updating activity:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function DeleteActivity(
  req: Request<{ id: string }>,
  res: Response
) {
  const { id } = req.params;

  try {
    const [existingRows] = await db.query<(Activity & RowDataPacket)[]>(
      "SELECT * FROM activities WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Activity not found" });
    }
    deleteImage(id, 'activities', 'image');

    await db.query("DELETE FROM activities WHERE id = ?", [id]);

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}