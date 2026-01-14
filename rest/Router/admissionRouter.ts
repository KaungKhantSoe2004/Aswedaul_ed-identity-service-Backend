import { Admission } from './../../assets/types';
import express, { Request, Response, Router } from "express";
import { acceptAdmission, createAdmission, getAdmissions, getAdmissionDashboard, rejectAdmission, approveRequest, rejectRequest } from "../Controller/admissionController";
import { upload } from "../../assets/upload";
import { authMiddleware } from "../../assets/middleware";

export const AdmissionRouter: Router = express.Router();

AdmissionRouter.post(
  "/createAdmission",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "prevSchool_doc", maxCount: 4 },
  ]),
  async (req: Request, res: Response) => {
    await createAdmission(req, res);
  }
);

AdmissionRouter.post("/deleteAdmission", authMiddleware, async(req: Request, res: Response)=> {
console.log("hello bro")
});

AdmissionRouter.get("/getAdmissionDashboard/:gradeId", authMiddleware, async(req: Request, res: Response)=> {
 try{
    console.log("hello from admission dashboard")
  getAdmissionDashboard(req, res);
 }catch(err){
  console.log('error', err)
 }
})
AdmissionRouter.get("/acceptRequest/:id", authMiddleware, (req: Request<{id: string}>, res: Response)=> {
  approveRequest(req, res)
});
AdmissionRouter.get("/rejectRequest/:id", authMiddleware, (req: Request<{id: string}>, res: Response)=> {
  rejectRequest(req, res)
})


AdmissionRouter.get("/getAdmissions/:gradeId", authMiddleware, async(req: Request, res: Response)=> {
  getAdmissions(req, res);
})

AdmissionRouter.get('/acceptAdmission/:id', authMiddleware, async(req: Request <{id: string}>, res: Response)=> {
  acceptAdmission(req, res);
})
AdmissionRouter.get('/rejectAdmission/:id', authMiddleware, async(req: Request <{id: string}>, res: Response)=> {
  rejectAdmission(req, res);
})