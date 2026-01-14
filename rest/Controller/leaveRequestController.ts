import { Request, Response } from "express";
import { db } from "../../assets/db_connection";
import { RowDataPacket } from "mysql2";

export const createLeaveRequest = async(req: Request, res: Response)=> {
    try{
        const {grade_id , student_id, duration, description} = req.body;
        const query = `INSERT INTO leave_requests (student_id, grade_id, duration, description) VALUES(?, ?, ?, ?)`;
        const [rows] = await db.execute<RowDataPacket[]>(query, [student_id, grade_id, duration, description]);
        res.status(200).json({
            message: "Success",
        })  
         
    }catch(err){
        console.log(err, 'is error bro')
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getLeaveRequest = async(req: Request, res: Response)=> {
    try{
        const {student_id} = req.params;
        const query = `SELECT * FROM leave_requests WHERE student_id = ?`;
        const [rows] = await db.execute<RowDataPacket[]>(query, [student_id]);
        res.status(200).json({
            message: "Success",
            data: rows
        })

    }catch(err){
        console.log(err, 'is err')
        res.status(500).json({
            data: err,
            message: "Internal Server Error"
        })
    }
}