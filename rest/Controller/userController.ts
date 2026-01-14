import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import { db } from "../../assets/db_connection";
import { AdminCreateData, ManagerCreateData, TeacherCreateData, User, UserCreateData } from "../../assets/types";
import hashPassword, {  resolvePassword } from "../../assets/hashPassword";
import { validateAdminData, validateManagerData, validateStudentData, validateTeacherData } from "../../assets/validation";
import { deleteImage } from "../../assets/upload";
import { getChatToken, getToken } from "../../assets/middleware";



// Extend Express Request to handle files
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

interface RequestWithFiles extends Express.Request {
  files?: {
    profile?: MulterFile[];
    prevClassDocument?: MulterFile[];
  };
}

export async function createStudent(
  req: RequestWithFiles & { body: Omit<UserCreateData, "id" | "created_at" | "updated_at"> },
  res: Response
) {
  try {
    const {
      name,
      role,
      email,
      age,
      phone,
      guardianPhone,
      guardianName,
      father_name,
      class: className,
      grade,
      gender,
      city,
      password,
      remaining_fee
  
    } = req.body;
    console.log("in creatting student")
    const validation = await validateStudentData(req.body);
    console.log(validation, 'is vlaidation dude');
    if (!validation.success) {
      return res.status(400).json(validation); 
    }
    console.log(req.body);

    const profile = req.files?.profile?.[0]?.filename || "";
    console.log("in profile")

    const prevClassDocument = JSON.stringify(
      req.files?.prevClassDocument?.map((f) => f.filename) || []
    );
    console.log(prevClassDocument)
    const hashedPassword = await hashPassword(password);
    console.log(age, 'is age bro')
    const query = `
      INSERT INTO users 
      (name, role, email, age, phone, guardianPhone, guardianName, father_name, profile, class, grade, gender, city, prevClassDocument, remaining_fee ,password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,  ?, ?)
    `;

    const values = [
      name,
      role,
      email,
      age,
      phone,
      guardianPhone,
      guardianName,
      father_name,
      profile,
      className,
      grade,
      gender,
      city,
      prevClassDocument,
      remaining_fee,
      hashedPassword
    ];

    const [result]: any = await db.query(query, values);

    const insertId = result.insertId;
    const [rows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ?",
      [insertId]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createTeacher(
  req: RequestWithFiles & { body: Omit<TeacherCreateData, "id" | "created_at" | "updated_at"> },
  res: Response
) {
  try {
    const validation = await validateTeacherData(req.body);

    if (!validation.success) {
      return res.status(400).json(validation); 
    }
    const {
      name,
      email,
      phone,
      role,
       password,
      age,
      grade,
      gender,
      city,
      academic_year,
      // subject,
      classAssigned,
      monthly_salary
    } = validation.data;
    console.log(req.body)
    const profile = req.files?.profile?.[0]?.filename || "";
    const hashedPassword = await hashPassword(password);
    console.log(age, 'is age bro')
    const query = `
      INSERT INTO users 
      (name, email, phone, profile, role, password, age, grade, gender, city, academic_year, class, monthly_pay)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
       name,
      email,
      phone,
      profile,
      role,
       hashedPassword,
      age,
      grade,
      gender,
      city,
      academic_year,
      // subject,
      classAssigned,
      monthly_salary
    ];

    const [result]: any = await db.query(query, values);

    const insertId = result.insertId;
    const [rows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ?",
      [insertId]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error creating teacher:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createAdmin(
  req: RequestWithFiles & { body: Omit<AdminCreateData, "id" | "created_at" | "updated_at"> },
  res: Response
) {
  try {
    const validation = await validateAdminData(req.body);

    if (!validation.success) {
      return res.status(400).json(validation); 
    }
    const {
      name,
      email,
      phone,
      role,
       password,
      age,
      gender,
      city,
      academic_year,
      monthly_salary
    } = validation.data;
    console.log(req.body)
    const profile = req.files?.profile?.[0]?.filename || "";
    const hashedPassword = await hashPassword(password);
    console.log(age, 'is age bro')
    const query = `
      INSERT INTO users 
      (name, email, phone, profile, role, password, age, gender, city, academic_year, monthly_pay)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
       name,
      email,
      phone,
      profile,
      role,
       hashedPassword,
      age,
      gender,
      city,
      academic_year,
      monthly_salary
    ];

    const [result]: any = await db.query(query, values);

    const insertId = result.insertId;
    const [rows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ?",
      [insertId]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error creating Admin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function createManager(
  req: RequestWithFiles & { body: Omit<ManagerCreateData, "id" | "created_at" | "updated_at"> },
  res: Response
) {
  try {
    const validation = await validateManagerData(req.body);

    if (!validation.success) {
      return res.status(400).json(validation); 
    }
    const {
      name,
      email,
      phone,
      role,
       password,
      age,
      grade,
      gender,
      city,
      academic_year,
      monthly_salary
    } = validation.data;
    console.log(req.body)
    const profile = req.files?.profile?.[0]?.filename || "";
    const hashedPassword = await hashPassword(password);
    console.log(age, 'is age bro')
    const query = `
      INSERT INTO users 
      (name, email, phone, profile, role, password, age, grade, gender, city, academic_year, monthly_pay)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
       name,
      email,
      phone,
      profile,
      role,
       hashedPassword,
      age,
      grade,
      gender,
      city,
      academic_year,
      monthly_salary
    ];

    const [result]: any = await db.query(query, values);

    const insertId = result.insertId;
    const [rows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ?",
      [insertId]
    );

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error creating teacher:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function getUsers(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 1;
    console.log(limit)
    const offset = (page - 1) * limit;

    const [rows] = await db.query<(Omit<User, "password"> & RowDataPacket)[]>(
      `SELECT id, name, role, email, age, phone, guardianPhone, guardianName, father_name, profile, class, grade, gender, city, academic_year, prevClassDocument, created_at, updated_at, annual_fee, remaining_fee, monthly_pay AS monthly_salary
       FROM users
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.status(200).json({ page, limit, users: rows });
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}




export async function getStudentsTeacherDashboard(req: Request, res: Response){
   try{
    const {grade_id} = req.params;
    const studentsQuery = `SELECT id, name, role, email, age, phone, guardianPhone, guardianName, father_name, profile, class, grade, gender, city, academic_year, prevClassDocument, created_at, updated_at, annual_fee, remaining_fee, monthly_pay AS monthly_salary FROM users  WHERE grade = ? AND role = 'student'`;
    const [rows] = await db.execute<RowDataPacket[]>(studentsQuery , [grade_id]);
    res.status(200).json({
      message: "Success",
      data: rows
    })
   }catch(err){
     res.status(500).json({
      message: "Internal Server Error"
     })
   }
}

export async function getStudentsCountTeacherDashboard(req: Request, res: Response){
   try{
    const {grade_id} = req.params;
    const studentsCountQuery = `SELECT COUNT(*) AS studentsCount FROM users WHERE role = 'student' AND grade = ?`;
    const [studentsCountRows] = await db.execute<RowDataPacket[]>(studentsCountQuery, [grade_id]);
    const studentsCount = studentsCountRows[0].studentsCount;
    res.status(200).json({
      message: "Success",
      data: studentsCount
    })
   }catch(err){
     res.status(500).json({
      message: "Internal Server Error"
     })
   }
}

export async function getUserById(req: Request<{id: string}>, res: Response) {
  try {
    const { id } = req.params;
    const [rows] = await db.query<(Omit<User, "password"> & RowDataPacket)[]>(
      "SELECT id, name, role, email, age, phone, guardianPhone, guardianName, father_name, profile, class, grade, gender, city, academic_year, prevClassDocument, created_at, updated_at, monthly_pay as salary , annual_fee, remaining_fee FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) return res.status(404).json({ error: "User not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getUsersByGrade(req: Request<{grade_id: string}>,res: Response ) {
   try{
    const {grade_id} = req.params;
    const usersQuery = `SELECT * FROM users WHERE grade = ?`;
    const [userRows] =await db.execute<RowDataPacket[]>(usersQuery, [grade_id]);
    res.status(200).json({
      message: "Success", 
      data: userRows
    })
   } catch(err){
    console.log('error occured', err)
    res.status(500).json({
      message:"Internal Server Error Occured"
    })
   }
}

export async function getTeachersByGrade(req: Request, res: Response){
  try{
       const {grade_id} = req.params;
       const query = `SELECT id, name, role, email, age, phone, guardianPhone, guardianName, father_name, profile, class, grade, gender, city, academic_year, prevClassDocument, created_at, updated_at, annual_fee, remaining_fee FROM users WHERE grade = ? AND role = 'teacher'`;
       const [ teacherRows] = await db.execute<RowDataPacket[]>(query, [grade_id]);
       res.status(200).json({
        message: "Success", 
        data: teacherRows
       })

  }catch(error){
    res.status(500).json({
      message: "Success"
    })
  }
}

export async function updatePassword(req: Request, res: Response){
  try{
    const {currentPassword, newPassword, user_id} = req.body;
    console.log(currentPassword, newPassword, user_id, 'is body')
    const getQuery = `SELECT * FROM users WHERE id = ?`;
    const [users] = await db.execute<RowDataPacket[]>(getQuery, [user_id]);
    const hashedPassword = users[0].password;
    const status = await resolvePassword(currentPassword, hashedPassword);
    if(status){
         const hashedPassword = await hashPassword(newPassword);
         const updateQuery = `UPDATE users SET password = ?  WHERE id = ?`;
         const updating = await db.execute<RowDataPacket[]>(updateQuery, [hashedPassword, user_id]);
         console.log(updating, 'is updating');
         res.status(200).json({
          message: "Success", 
          
         })
    }else{
      res.status(401).json({
        message: "Wrong Previous Password"
      })
    }
  }catch(err){
    console.log(err, 'is error ')
    res.status(500).json({
      message: "Internal Server Error",
      data: err
    })
  }
}


export async function remainingFees(req: Request,res: Response){
  try{
     const query ="SELECT id, name, role, email, age, phone, guardianPhone, annual_fee, guardianName, father_name, profile, class, grade, gender, city, academic_year, prevClassDocument, created_at, updated_at , remaining_fee FROM users WHERE remaining_fee > 0"
     const [rows] = await db.query(query);
     res.status(200).json({
      message: "success",
      data: rows
     })
    }catch(err){
      console.log(err, 'is error bro ')
    res.status(500).json({error: "Internal Server Error occured"})
  }
}


export async function updateUser(
  req: RequestWithFiles & { params: { id: string }; body: Partial<Omit<User, "id" | "created_at" | "updated_at">> },
  res: Response
) {
  try {
    const { id } = req.params;
    const [existingRows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingUser = existingRows[0];

    // Prepare updated values
    const profile = req.files?.profile?.[0]?.filename || existingUser.profile;
    const prevClassDocument = req.files?.prevClassDocument?.length
      ? JSON.stringify(req.files.prevClassDocument.map((f) => f.filename))
      : existingUser.prevClassDocument;

    const {
      name = existingUser.name,
      role = existingUser.role,
      email = existingUser.email,
      age = existingUser.age,
      phone = existingUser.phone,
      guardianPhone = existingUser.guardianPhone,
      guardianName = existingUser.guardianName,
      father_name = existingUser.father_name,
      class: className = existingUser.class,
      grade = existingUser.grade,
      gender = existingUser.gender,
      city = existingUser.city,
    } = req.body;

    const query = `
      UPDATE users SET
        name = ?, role = ?, email = ?, age = ?, phone = ?, guardianPhone = ?, guardianName = ?,
        father_name = ?, profile = ?, class = ?, grade = ?, gender = ?, city = ?, prevClassDocument = ?, updated_at = NOW()
      WHERE id = ?
    `;

    const values = [
      name,
      role,
      email,
      age,
      phone,
      guardianPhone,
      guardianName,
      father_name,
      profile,
      className,
      grade,
      gender,
      city,
      prevClassDocument,
      id,
    ];

    await db.query(query, values);

    const [updatedRows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    res.status(200).json(updatedRows[0]);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}




export async function deleteUser(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;

    const [rows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}





export async function addUserFee(req: Request, res: Response){
    try{
      let {id, newRemainingFees} = req.body;
      const query = `UPDATE users SET remaining_fee = ? WHERE id = ?`;
     
      if (newRemainingFees < 0) {
           newRemainingFees = 0;
               }
       const value = [newRemainingFees, id];         
      await db.query(query, value);

      res.status(200).json({message: "Success updating User Remaining Fees"})
    }catch(err){
      console.log(err, 'is err bro');
      res.status(500).json({
        message: "Internal Server Error "
      })
    }
}

export async function getEmployees(req: Request, res: Response){
 try {
  const query = `SELECT * FROM users WHERE role != 'student'`;
  const [rows] = await db.query(query);
  res.status(200).json({
    message: "Success",
    data: rows
  })
 }catch(err){
  console.log(err, 'is error');
  res.status(500).json({
    message: "Internal Server Error occured" 
  })
 }
}

export async function updateStudent(
  req: RequestWithFiles & {
    body: { id: string } & Omit<UserCreateData, "created_at" | "updated_at">;
  },
  res: Response
) {
  try {
    const { id } = req.body;

    const [existingRows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ? AND role = 'student'",
      [id]
    );
    if (!existingRows.length)
      return res.status(404).json({ error: "Student not found" });

    const existing = existingRows[0];

    const profile =
      req.files?.profile?.[0]?.filename || existing.profile;

    const prevClassDocument = req.files?.prevClassDocument?.length
      ? JSON.stringify(req.files.prevClassDocument.map((f) => f.filename))
      : existing.prevClassDocument;

    const {
      name,
      role,
      email,
      age,
      phone,
      guardianPhone,
      guardianName,
      father_name,
      class: className,
      grade,
      gender,
      city,
      password,
      remaining_fee
    } = req.body;

    const hashedPassword = password
      ? await hashPassword(password)
      : existing.password;

    const query = `
      UPDATE users SET
        name=?, role=?, email=?, age=?, phone=?, guardianPhone=?, guardianName=?,
        father_name=?, profile=?, class=?, grade=?, gender=?, city=?, prevClassDocument=?,
        remaining_fee=?, password=?, updated_at=NOW()
      WHERE id=?
    `;

    const values = [
      name, role, email, age, phone, guardianPhone, guardianName,
      father_name, profile, className, grade, gender, city,
      prevClassDocument, remaining_fee, hashedPassword, id
    ];

    await db.query(query, values);

    const [updated] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id=?",
      [id]
    );

    res.status(200).json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function updateTeacher(
  req: RequestWithFiles & {
    body: { id: string } & Omit<TeacherCreateData, "created_at" | "updated_at">;
  },
  res: Response
) {
  try {
    const { id } = req.body;

    const [existingRows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ? AND role = 'teacher'",
      [id]
    );
    if (!existingRows.length)
      return res.status(404).json({ error: "Teacher not found" });

    const existing = existingRows[0];

    const profile =
      req.files?.profile?.[0]?.filename || existing.profile;

    const {
      name,
      email,
      phone,
      role,
      password,
      age,
      grade,
      gender,
      city,
      academic_year,
      classAssigned,
      monthly_salary
    } = req.body;

    const hashedPassword = password
      ? await hashPassword(password)
      : existing.password;

    const query = `
      UPDATE users SET
        name=?, email=?, phone=?, profile=?, role=?, password=?, age=?, grade=?,
        gender=?, city=?, academic_year=?, class=?, monthly_pay=?, updated_at=NOW()
      WHERE id=?
    `;

    const values = [
      name, email, phone, profile, role, hashedPassword, age, grade,
      gender, city, academic_year, classAssigned, monthly_salary, id
    ];

    await db.query(query, values);

    const [updated] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id=?",
      [id]
    );

    res.status(200).json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function updateAdmin(
  req: RequestWithFiles & {
    body: { id: string } & Omit<AdminCreateData, "created_at" | "updated_at">;
  },
  res: Response
) {
  try {
    const { id } = req.body;

    const [existingRows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ? AND role = 'admin'",
      [id]
    );
    if (!existingRows.length)
      return res.status(404).json({ error: "Admin not found" });

    const existing = existingRows[0];

    const profile =
      req.files?.profile?.[0]?.filename || existing.profile;

    const {
      name,
      email,
      phone,
      role,
      password,
      age,
      gender,
      city,
      academic_year,
      monthly_salary
    } = req.body;

    const hashedPassword = password
      ? await hashPassword(password)
      : existing.password;

    const query = `
      UPDATE users SET
        name=?, email=?, phone=?, profile=?, role=?, password=?, age=?,
        gender=?, city=?, academic_year=?, monthly_pay=?, updated_at=NOW()
      WHERE id=?
    `;

    const values = [
      name, email, phone, profile, role, hashedPassword, age,
      gender, city, academic_year, monthly_salary, id
    ];

    await db.query(query, values);

    const [updated] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id=?",
      [id]
    );

    res.status(200).json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateManager(
  req: RequestWithFiles & {
    body: { id: string } & Omit<ManagerCreateData, "created_at" | "updated_at">;
  },
  res: Response
) {
  try {
    const { id } = req.body;

    const [existingRows] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id = ? AND role = 'manager'",
      [id]
    );
    if (!existingRows.length)
      return res.status(404).json({ error: "Manager not found" });

    const existing = existingRows[0];

    const profile =
      req.files?.profile?.[0]?.filename || existing.profile;

    const {
      name,
      email,
      phone,
      role,
      password,
      age,
      grade,
      gender,
      city,
      academic_year,
      monthly_salary
    } = req.body;

    const hashedPassword = password
      ? await hashPassword(password)
      : existing.password;

    const query = `
      UPDATE users SET
        name=?, email=?, phone=?, profile=?, role=?, password=?, age=?, grade=?,
        gender=?, city=?, academic_year=?, monthly_pay=?, updated_at=NOW()
      WHERE id=?
    `;

    const values = [
      name, email, phone, profile, role, hashedPassword, age, grade,
      gender, city, academic_year, monthly_salary, id
    ];

    await db.query(query, values);

    const [updated] = await db.query<(User & RowDataPacket)[]>(
      "SELECT * FROM users WHERE id=?",
      [id]
    );

    res.status(200).json(updated[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}


export async function getUsersWithGrade(req: Request, res: Response){
  const {grade} = req.params;
  console.log('in grade');
  try{
     const sql = `SELECT * FROM users WHERE grade = ?`;
     const [rows] = await db.query(sql, [grade]);
     
     res.status(200).json({
      message: "Success",
      data: rows
     })


  }catch(err){
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error Occured",
      data: err
    })
  }

}


export async function getStudents(req: Request, res: Response) {
  try{
    const {gradeId} = req.params;
    const query = `SELECT id, name, role, email, age, phone, guardianPhone, guardianName, father_name, profile, class, grade, gender, city, academic_year, prevClassDocument, created_at, updated_at, annual_fee, remaining_fee FROM users WHERE role = 'student' AND grade = ?`;
    const [rows] = await db.query(query, [gradeId]);
    res.status(200).json({
      message: "Success",
      data: rows
    })
  }catch(err){
    res.status(500).json({
      message: "Internal Server Error Occured",
      data: err
    })
  }
}


export async function me(req: Request, res: Response): Promise<void>  {
    try {
      const {
        id: user_id,
        role: user_role,
        auth: user_auth,
      } = (req as any).user;

      console.log(user_id, user_role, user_auth, "is id");
      if (user_role == "user" && user_auth == "user") {
        res.status(200).json({
          route: "user",
          message: "success",
          id: user_id,
        });
      } else {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        data: error,
      });
    }
  }


export async function login(req: Request, res:Response){
  try{
    console.log(req.body, 'is body brodude')
   const {email, password} = req.body;
   if(!email || !password){
     res.status(400).json({
        message: "Credentials Required"
     })
   }else{
      const query = `SELECT * FROM users WHERE email = ?`;
      const [userRows] =await db.query(query, [email]);
      const user = userRows[0];
      if(!user){
       res.status(404).json({
          message: "No user Found"
        })
        return;
      }
      console.log(user, 'is user from pdb')
      const hashedPassword = user.password;
      const status = await resolvePassword(password, hashedPassword);
      if(status){
        const token =  getToken(user.id, user.role );
        res.cookie("aswedaul_ed_jwt", token, {
                  httpOnly: true,
                  maxAge: 10 * 24 * 60 * 60 * 1000,
                });
        res.status(200).json({
          message: "Login Success"
        })        
      }else{
        res.status(403).json({
          message: "Wrong Password"
        })
      }

   }
  }catch(err){
    console.log(err, 'is error bro')
    res.status(500).json({

      message: "Internal Server Error occured",
      data: err
    })
  }
}

export async function ChatLogin(req: Request, res:Response){
  try{
    console.log(req.body, 'is body chat brodude')
   const {email, password} = req.body;
   if(!email || !password){
     res.status(400).json({
        message: "Credentials Required"
     })
   }else{
      const query = `SELECT * FROM users WHERE email = ?`;
      const [userRows] =await db.query(query, [email]);
      const user = userRows[0];
      if(!user){
       res.status(404).json({
          message: "No user Found"
        })
        return;
      }
      console.log(user, 'is user from pdb')
      const hashedPassword = user.password;
      const status = await resolvePassword(password, hashedPassword)
      if(status){
        const token =  getChatToken(user.id, user.role );
        res.cookie("aswedaul_edchat_jwt", token, {
                  httpOnly: true,
                  maxAge: 10 * 24 * 60 * 60 * 1000,
                });
        res.status(200).json({
          message: "Login Success"
        })        
      }else{
        res.status(403).json({
          message: "Wrong Password"
        })
      }

   }
  }catch(err){
    console.log(err, 'is error bro')
    res.status(500).json({

      message: "Internal Server Error occured",
      data: err
    })
  }
}

export async function logout(req:Request, res:Response){
  res.clearCookie("aswedaul_ed_jwt", {
    httpOnly: true,
    path: '/',
              
  })
  res.status(200).json({
    message: "Success",
  })
}

export async function chatLogout(req:Request, res:Response){
  res.clearCookie("aswedaul_edchat_jwt", {
    httpOnly: true,
    path: '/',
              
  })
  res.status(200).json({
    message: "Success",
  })
}