import { db } from "../assets/db_connection";
import { deleteImage } from "../assets/upload";

export const ActivityResolver = {
  // Query: {
  activities: async () => {
    try {
      
      const [rows] = await db.query(
        "SELECT * FROM activities ORDER BY id DESC"
      );
    
      return {
        success: true,
        message: "Activities fetched Successfully",
        data: rows,
      };
    } catch (err) {
      throw err;
    }
  },

  activity: async (_: any, { id }: any) => {
    try {
    
      const [rows]: any = await db.query(
        "SELECT * FROM activities WHERE id = ?",
        [id]
      );
      return {
        success: true,
        message: "Activity fetched Successfully",
        data: rows[0],
      };
    } catch (err) {
      throw err;
    }
  },
  // },
  // Mutation: {
  createActivity: async (_: any, { input }: any, context: any) => {
    try {
      const req = context.req;
      const [activityName] = input;

      const image = req?.files?.image?.[0]?.filename || null;

      const sql = `
        INSERT INTO activities (activityName, image)
        VALUES (?, ?)
      `;

      const values = [activityName, image];
      const [result]: any = await db.query(sql, values);

      return {
        id: result.insertId,
        activityName,
        image,
        success: true,
        message: "Activity created successfully",
      };
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Failed to create activity");
    }
  },

  updateActivity: async (_: any, { id, input }: any, context: any) => {
    try {
      const req = context.req;
      const [activityName, image] = input;

      let imagePath = image || null;

      // If new file uploaded → delete previous + update path
      if (req?.files?.image) {
        deleteImage(id, "activities", "image");
        imagePath = req.files.image[0].filename;
      }

      const finalInput: any = {
        activityName,
        ...(imagePath ? { image: imagePath } : {}),
      };

      const fields = Object.keys(finalInput);
      const updateClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = Object.values(finalInput);

      const sql = `
        UPDATE activities
        SET ${updateClause}
        WHERE id = ?
      `;

      await db.query(sql, [...values, id]);

      // Return updated record
      const [rows]: any = await db.query(
        "SELECT * FROM activities WHERE id = ?",
        [id]
      );

      if (!rows.length) throw new Error("Activity not found");

      return {
        ...rows[0],
        success: true,
        message: "Activity updated successfully",
      };
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Failed to update activity");
    }
  },

  deleteActivity: async (_: any, { id }: any) => {
    try {
      deleteImage(id, "activities", "image");

      const sql = `DELETE FROM activities WHERE id = ?`;
      const values = [id];

      await db.query(sql, values);

      return {
        success: true,
        message: "Activity deleted successfully",
      };
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Failed to delete activity");
    }
  },
  // },
};
