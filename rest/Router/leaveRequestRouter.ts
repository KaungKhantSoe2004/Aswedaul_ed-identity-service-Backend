import express, { Request, Response } from "express";
import { createLeaveRequest, getLeaveRequest } from "../Controller/leaveRequestController";
import { authMiddleware } from "../../assets/middleware";
export const LeaveRequestRouter = express.Router();
LeaveRequestRouter.get(`/get/:student_id`, authMiddleware , (req: Request, res: Response)=> {
    getLeaveRequest(req, res)
});
LeaveRequestRouter.post('/request', authMiddleware,(req: Request, res: Response)=> {
    createLeaveRequest(req, res)
} );