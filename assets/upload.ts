import multer from "multer";
import { db } from "./db_connection";

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    console.log(req, 'is req')
    if(file.fieldname == "image"){
      console.log(file.fieldname, 'is field name')
      cb(null, "public/");
    }
    else  {
      cb(null, "public/uploads/");
    } 
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

export const upload = multer({ storage });

// deleting Images
const allowedTables = ["users", "teachers", "students", "admissions", 'galleries', 'activities'];
const allowedColumns = ["profile", "prevClassDocument", 'image'];

export async function deleteImage(id, table, column) {
  if (!allowedTables.includes(table)) {
    throw new Error("Invalid table");
  }
  if (!allowedColumns.includes(column)) {
    throw new Error("Invalid column");
  }

  const [rows]: any = await db.query(
    `SELECT ${column} FROM ${table} WHERE id = ?`,
    [id]
  );
  if (!rows.length) return;

  const filename = rows[0][column];
  if (!filename) return;
  const fs = require("fs");

  let filePath : string;
  if(table == "galleries" || table == "activities"){
    filePath = `public/${filename}`;
     }
  else{   
  filePath = `public/uploads/${filename}`;}

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // 3️⃣ Optional: clear the DB column
  await db.query(`UPDATE ${table} SET ${column} = NULL WHERE id = ?`, [id]);

  return true;
}
