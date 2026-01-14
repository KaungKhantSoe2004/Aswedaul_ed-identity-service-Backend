import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { db } from "../../assets/db_connection.js";
import { Admission, RequestWithFiles } from "../../assets/types.js";
import hashPassword from "../../assets/hashPassword.js";



export async function createStudentWithAdmission(admissionData){
try{
    const query = `INSERT INTO users (name, email, age, phone, gender, grade, guardianName, guardianPhone, father_name, profile, prevClassDocument, role, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const hashedPassword = await hashPassword('defaultPassword123')
  const values = [
    admissionData.name,
    admissionData.email,
    admissionData.age,
    admissionData.phone,
    admissionData.gender,
    admissionData.grade,
    admissionData.guardianName,
    admissionData.guardianPhone,
    admissionData.guardianName,
    admissionData.profile,
    admissionData.prevSchool_doc,
    "student",
    hashedPassword
  ];
  const data =await db.query(query, values);
  return {
    status: "true",
    data};
}catch(err){
  console.log(err, 'is error');
  return {
    status: "Error",
    data: err,
  };
}

}

export async function createAdmission(
  req: RequestWithFiles,
  res: Response
): Promise<void> {
  try {
    let {
      name,
      email,
      age,
      phone,
      gender,
      grade,
      guardianName,
      guardianEmail,
      guardianPhone,
    } = req.body;

    // 🧹 Normalize email
    email = email.toLowerCase().trim();

    // 🔎 1️⃣ Check duplicate email (users + admissions)
    const [existing]: any = await db.query(
      `
      SELECT email FROM admissions WHERE email = ?
      UNION
      SELECT email FROM users WHERE email = ?
      `,
      [email, email]
    );

    if (existing.length > 0) {
      res.status(409).json({
        status: false,
        message: "Email already exists. Please use a different email.",
      });
      return;
    }

    // 📁 Files
    const profile_path = req.files?.profile?.[0]?.filename || "";
    const prevSchool_files = req.files?.prevSchool_doc || [];
    const prevSchool_doc = JSON.stringify(
      prevSchool_files.map((f) => f.filename)
    );

    // 🧾 Insert admission
    const query = `
      INSERT INTO admissions
      (name, email, age, phone, gender, grade, guardianName, guardianPhone, guardianEmail, profile, prevSchool_doc)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name,
      email,
      age,
      phone,
      gender,
      grade,
      guardianName,
      guardianPhone,
      guardianEmail,
      profile_path,
      prevSchool_doc,
    ];

    const [result]: any = await db.query(query, values);

    res.status(201).json({
      status: true,
      message: "Admission created successfully",
      id: result.insertId,
    });
  } catch (err: any) {
    console.error("Error creating admission:", err);

    // 🛑 Extra safety for race conditions
    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({
        status: false,
        message: "Email already exists.",
      });
      return;
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
}




export async function deleteAdmission(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const [rows] = await db.query<(Admission & RowDataPacket)[]>(
      "SELECT * FROM admissions WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Admission not found" });
    }

    await db.query("DELETE FROM admissions WHERE id = ?", [id]);

    res.status(200).json({ message: "Admission deleted successfully" });
  } catch (err) {
    console.error("Error deleting admission:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function acceptAdmission(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const [rows] = await db.query<(Admission & RowDataPacket)[]>(
      "SELECT * FROM admissions WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Admission not found" });
    }
    const admissionData = rows[0]; 
    const {status, data} = await  createStudentWithAdmission(admissionData);
    if(status == "Error"){
      res.status(500).json({
        message: "Cannot create student!!"
      });
      return;
    }
    await db.query("UPDATE admissions SET status = ? WHERE id = ?", ["accepted", id]);
    res.status(200).json({ message: "Admission accepted successfully" });
  } catch (err) {
    console.error("Error accepting admission:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function rejectAdmission(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const [rows] = await db.query<(Admission & RowDataPacket)[]>(
      "SELECT * FROM admissions WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Admission not found" });
    }

    await db.query("UPDATE admissions SET status = ? WHERE id = ?", ["rejected", id]);

    res.status(200).json({ message: "Admission rejected successfully" });
  } catch (err) {
    console.error("Error rejecting admission:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function rejectRequest(req: Request<{id: string}>, res: Response){
  try{
    const {id}  = req.params;
    const query = `UPDATE leave_requests SET status = 'rejected' WHERE id = ?`;
    const values = [id];
    const [rows] = await db.query(query, values);
    res.status(200).json({
      message: "Success",
      data: rows[0]
    })
  }
  catch(err){
    res.status(500).json({
      message: "internal server error."
    })
  }
}

export async function approveRequest(req: Request<{id: string}>, res: Response){
  try{
    const {id}  = req.params;
    const query = `UPDATE leave_requests SET status = 'approved' WHERE id = ?`;
    const values = [id];
    const [rows] = await db.query(query, values);
    res.status(200).json({
      message: "Success",
      data: rows[0]
    })
  }
  catch(err){
    res.status(500).json({
      message: "internal server error."
    })
  }
}


export async function updateAdmission(
  req: RequestWithFiles & { params: { id: string } },
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;

    // First, check if the admission exists
    const [existingRows] = await db.query<(Admission & RowDataPacket)[]>(
      "SELECT * FROM admissions WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
       res.status(404).json({ error: "Admission not found" });
    }

    const existingAdmission = existingRows[0];

    // Extract body fields
    const {
      name,
      email,
      age,
      phone,
      gender,
      grade,
      guardianName,
      guardianEmail,
      guardianPhone,
    } = req.body;

    // Handle profile file
    const profile_path =
      req.files?.profile?.[0]?.filename || existingAdmission.profile;

    // Handle prevSchool_doc files
    let prevSchool_doc = existingAdmission.prevSchool_doc;
    if (req.files?.prevSchool_doc?.length) {
      const newFiles = req.files.prevSchool_doc.map((f) => f.filename);
      prevSchool_doc = JSON.stringify(newFiles);
    }

    // Update query
    const query = `
      UPDATE admissions
      SET name = ?, email = ?, age = ?, phone = ?, gender = ?, grade = ?, 
          guardianName = ?, guardianPhone = ?, guardianEmail = ?, 
          profile = ?, prevSchool_doc = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const values = [
      name || existingAdmission.name,
      email || existingAdmission.email,
      age || existingAdmission.age,
      phone || existingAdmission.phone,
      gender || existingAdmission.gender,
      grade || existingAdmission.grade,
      guardianName || existingAdmission.guardianName,
      guardianPhone || existingAdmission.guardianPhone,
      guardianEmail || existingAdmission.guardianEmail,
      profile_path,
      prevSchool_doc,
      id,
    ];

    await db.query(query, values);

    // Return the updated admission
    const [updatedRows] = await db.query<(Admission & RowDataPacket)[]>(
      "SELECT * FROM admissions WHERE id = ?",
      [id]
    );

    res.status(200).json({ message: "Admission updated successfully", admission: updatedRows[0] });
  } catch (err) {
    console.error("Error updating admission:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAdmissionDashboard(req: Request, res: Response) {
  try {
    const gradeId = req.params.gradeId;

    // Queries
    const pendingAdmissionCountQuery = `SELECT COUNT(*) AS count FROM admissions WHERE grade = ? AND status = 'pending'`;
    const studentsCountQuery = `SELECT COUNT(*) AS count FROM users WHERE role = 'student' AND grade = ?`;
    const leaveRequestsQuery = `SELECT lr.* , u.name as name FROM leave_requests lr JOIN users u ON lr.student_id = u.id WHERE lr.grade_id = ? ORDER BY lr.created_at DESC LIMIT 20`;
    const issuesStudentsQuery = `SELECT name, class, gender, issue, issue_level FROM users WHERE issue IS NOT NULL AND grade = ?`;

    // Execute queries in parallel
    const [
      [pendingRows],
      [studentRows],
      [leaveRequestsRows],
      [issuesRows]
    ] = await Promise.all([
      db.query(pendingAdmissionCountQuery, [gradeId]),
      db.query(studentsCountQuery, [gradeId]),
      db.query(leaveRequestsQuery, [gradeId]),
      db.query(issuesStudentsQuery, [gradeId])
    ]);

    // Prepare response
    const admissionCount = pendingRows[0].count;
    const studentCount = studentRows[0].count;
    const leaveRequests = leaveRequestsRows;
    const issuesStudents = issuesRows;

    res.status(200).json({
      admissionCount,
      studentCount,
      leaveRequests,
      issuesStudents
    });

  } catch (err) {
    console.error("Error in getAdmissionDashboard:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAdmissions(req: Request, res: Response) {
  try {
    const gradeId = req.params.gradeId;
    console.log(gradeId, 'is grade Id')
    const [rows] = await db.query<(Admission & RowDataPacket)[]>("SELECT * FROM admissions WHERE grade = ? ", [gradeId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error getting admissions:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


export async function getAdmissionById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const [rows] = await db.query<(Admission & RowDataPacket)[]>(
      "SELECT * FROM admissions WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Admission not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error getting admission:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
