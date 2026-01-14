import { Request, Response } from "express";
import { db } from "../../assets/db_connection";

export const getSocketUsers = async(req: Request,res: Response)=> {
    try{
     const sql = `SELECT id AS user_id, name, role, profile FROM users`;
    const [rows] = await db.query(sql);
    res.status(200).json({
        message: "success", 
        data: rows
    })
    }catch(err){
         console.log(err)
    }
}