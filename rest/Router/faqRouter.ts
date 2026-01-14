import express, {  Request, Response } from 'express';
import { createFaq, deleteFaq, getFaqById, getFaqs, updateFaq } from '../Controller/faqController';
import { upload } from '../../assets/upload';
import { authMiddleware } from '../../assets/middleware';
export const FaqRouter = express.Router();
FaqRouter.get('/getFaqs', (req: Request, res: Response)=> {
    getFaqs(req, res);
})
FaqRouter.post("/createFaq", authMiddleware, (req: Request, res: Response)=> {
    createFaq(req, res);
})
FaqRouter.get("/getFaqById/:id", authMiddleware,(req: Request<{id: string}>, res: Response)=> {
    getFaqById(req, res);
})
FaqRouter.post("/updateFaq", authMiddleware, (req: Request<{id: string}>, res: Response)=> {
    
    updateFaq(req, res);

})
FaqRouter.get("/deleteFaq/:id", authMiddleware, (req: Request<{id: string}>, res: Response)=> {
    
    deleteFaq(req, res);
})