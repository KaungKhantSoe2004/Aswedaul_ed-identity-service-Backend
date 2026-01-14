import express, { Router , Request, Response } from 'express';
import { CreateActivity, DeleteActivity, getActivities, getActivityById, UpdateActivity } from '../Controller/activityController';
import { upload } from '../../assets/upload';
import { authMiddleware } from '../../assets/middleware';

export const ActivityRouter = express.Router();
ActivityRouter.get('/getActivities', (req: Request, res: Response)=> {
  getActivities(req, res);
})
ActivityRouter.post("/createActivity", authMiddleware, upload.single("image"), (req: Request, res: Response)=> {
    CreateActivity(req, res);
})
ActivityRouter.get("/getActivity", authMiddleware, (req: Request<{id: string}>, res: Response)=> {
    getActivityById(req, res);
})
ActivityRouter.post("/updateActivity", authMiddleware, upload.single("image"), (req: Request<{id: string}>, res: Response)=> {
    UpdateActivity(req, res);
})
ActivityRouter.get("/deleteActivity/:id", authMiddleware, (req: Request<{id: string}>, res: Response)=> {
    DeleteActivity(req, res);
})