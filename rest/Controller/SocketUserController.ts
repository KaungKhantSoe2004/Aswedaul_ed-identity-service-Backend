import { Request, Response } from "express"
import { db } from "../../assets/db_connection";

export const getUsersForRooms = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
   
    const userSql = `
      SELECT id, role, grade
      FROM users
      WHERE id = ?
    `;
    const [userRows]: any = await db.query(userSql, [id]);

    if (!userRows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const { role, grade } = userRows[0];

    // 2️⃣ Build users query based on user role & grade
    let query = '';
    let params: any[] = [];

    if (role === 'student') {
      // Students see users of same grade
      query = `
        SELECT id AS userid, name, role, profile, grade
        FROM users
        WHERE grade = ?
      `;
      params = [grade];

    }else if(role === "teacher" || role === "manager"){
       query = `
  SELECT id AS userid, name, role, profile, grade
  FROM users
  WHERE (role = ? AND grade = ?)
     OR role <> ?
`;
       params = ['students', grade, 'students'];

    } 
    else {
      // Non-students see users who are NOT students and NOT grade 8
      query = `
        SELECT id AS userid, name, role, profile, grade
        FROM users
      `;
      params = [];
    }

    // 3️⃣ Fetch users list
    const users = await db.query(query, params);

    // 4️⃣ Return ONLY users
    res.status(200).json({
      message: "Success",
      data: users,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

