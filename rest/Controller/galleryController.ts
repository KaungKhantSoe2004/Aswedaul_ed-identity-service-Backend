import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { db } from "../../assets/db_connectionk.js";
import { Gallery, RequestWithFile } from "../../assets/types.js";
import { deleteImage } from "../../assets/upload.js";


// CREATE GALLERY
export async function createGallery(
  req: RequestWithFile & { body: { galleryName: string } },
  res: Response
) {
  try {
    console.log(req.body, 'is req body')
    const { galleryName } = req.body;
    console.log(req.file, 'is  file jdsf;la')
    const image = req.file?.filename || "";
    console.log(image, 'is image brto heheeh')

    const query = "INSERT INTO galleries (galleryName, image) VALUES (?, ?)";
    const values = [galleryName, image];

    const [result]: any = await db.query(query, values);

    res.status(201).json({
      status: true,
      message: "Gallery created successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating gallery:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getGalleries(req: any, res: Response) {
  try {
    const [rows] = await db.query<(Gallery & RowDataPacket)[]>("SELECT * FROM galleries");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error getting galleries:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getGalleryById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const [rows] = await db.query<(Gallery & RowDataPacket)[]>(
      "SELECT * FROM galleries WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error getting gallery:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateGallery(
  req: RequestWithFile & { params: { id: string }; body: { galleryName?: string } },
  res: Response
) {
  try {
    const { galleryName, id } =req.body;
    console.log(req.body)
    const [existingRows] = await db.query<(Gallery & RowDataPacket)[]>(
      "SELECT * FROM galleries WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    const existingGallery = existingRows[0];
 
    console.log(galleryName)
    if(!req.file){
      console.log('file does not exist')
       const query = "UPDATE galleries SET galleryName = ? WHERE id = ?";
       const values = [galleryName, id];
       await db.query(query, values)
    }else{

       const image = req.file?.filename || existingGallery.image;

       const query = "UPDATE galleries SET galleryName = ?, image = ? WHERE id = ?";
       const values = [galleryName, image, id];
       deleteImage(id, 'galleries', 'image');
       await db.query(query, values);
    }


   
    const [updatedRows] = await db.query<(Gallery & RowDataPacket)[]>(
      "SELECT * FROM galleries WHERE id = ?",
      [id]
    );

    res.status(200).json({ message: "Gallery updated successfully", gallery: updatedRows[0] });
  } catch (err) {
    console.error("Error updating gallery:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteGallery(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
   

    const [existingRows] = await db.query<(Gallery & RowDataPacket)[]>(
      "SELECT * FROM galleries WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    deleteImage(id, 'galleries', 'image');


    await db.query("DELETE FROM galleries WHERE id = ?", [id]);


    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (err) {
    console.error("Error deleting gallery:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
