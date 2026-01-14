import { db } from "../assets/db_connection";
import { deleteImage } from "../assets/upload";

export const GalleryResolver = {
  galleries: async () => {
    try {
      const query = `SELECT * FROM galleries ORDER BY id DESC`;
      const [rows] = await db.query(query);
      return {
        success: true,
        message: "Galleries fetched successfully",
        data: rows,
      };
    } catch (err) {
      throw err;
    }
  },
  gallery: async (_: any, { id }: any) => {
    try {
      const query = `SELECT * FROM galleries WHERE id = ?`;
      const values = [id];
      const rows = await db.query(query, values);
      return {
        success: true,
        message: "Galleries fetched successfully",
        data: rows[0],
      };
    } catch (err) {
      throw err;
    }
  },

  createGallery: async (_: any, { input }: any, context: any) => {
    try {
      const req = context.req;

      const [galleryName] = input;

      // file from multer
      const files = req.files;
      const image = files?.image?.[0]?.filename || null;

      const sql = `
        INSERT INTO galleries (galleryName, image)
        VALUES (?, ?)
      `;

      const values = [galleryName, image];
      const [result]: any = await db.query(sql, values);

      return {
        id: result.insertId,
        galleryName,
        image,
      };
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Failed to create gallery");
    }
  },
  updateGallery: async (_: any, { id, input }: any, context: any) => {
    try {
      const req = context.req;

      const [galleryName] = input;

      let imagePath = null;

      // check for uploaded image
      if (req?.files?.image) {
        deleteImage(id, "galleries", "image"); // delete old file
        imagePath = req.files.image[0].filename;
      }

      const finalInput: any = {
        galleryName,
        ...(imagePath ? { image: imagePath } : {}),
      };

      const fields = Object.keys(finalInput);
      if (fields.length === 0) {
        throw new Error("No fields provided to update.");
      }

      const updateClause = fields.map((f) => `${f} = ?`).join(", ");
      const values = Object.values(finalInput);

      const sql = `
        UPDATE galleries 
        SET ${updateClause}
        WHERE id = ?
      `;

      await db.query(sql, [...values, id]);

      // return updated data
      const [rows]: any = await db.query(
        "SELECT * FROM galleries WHERE id = ?",
        [id]
      );

      if (!rows.length) throw new Error("Gallery not found");

      return rows[0];
    } catch (err: any) {
      console.error(err);
      throw new Error(err.message || "Failed to update gallery");
    }
  },
  deleteGallery: async (_: any, { id }: any) => {
    try {
      // delete image file
      deleteImage(id, "galleries", "image");

      const sql = `DELETE FROM galleries WHERE id = ?`;
      const values = [id];

      await db.query(sql, values);

      return {
        success: true,
        message: "Gallery deleted successfully",
      };
    } catch (err) {
      console.error(err);
      throw new Error("Failed to delete gallery");
    }
  },
};
