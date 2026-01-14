import express, { Router , Request, Response } from 'express';
import { createGallery, deleteGallery, getGalleries, getGalleryById, updateGallery } from '../Controller/galleryController';
import { upload } from '../../assets/upload';
import { authMiddleware } from '../../assets/middleware';
export const GalleryRouter = express.Router();
GalleryRouter.get('/getGalleries', (req: Request, res: Response)=> {
   getGalleries(req, res);
})
GalleryRouter.post("/createGallery", authMiddleware, upload.single("image"),(req: Request, res: Response)=> {
    createGallery(req, res);
})
GalleryRouter.get("/getGalleryById/:id", authMiddleware, (req: Request<{id: string}>, res: Response)=> {
    getGalleryById(req, res);
})
GalleryRouter.post("/updateGallery", authMiddleware, upload.single("image"), (req: Request<{id: string}>, res: Response)=> {
    updateGallery(req, res);
})
GalleryRouter.get("/deleteGallery/:id", authMiddleware, (req: Request<{id: string}>, res: Response)=> {

    deleteGallery(req, res);
})