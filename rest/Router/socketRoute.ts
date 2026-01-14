import express, { Request, Response } from "express"
import { getUsersForRooms } from "../Controller/SocketUserController";
export const SocketUserRouter = express.Router();
SocketUserRouter.get("/getUsersForRooms/:id", ( req:Request, res:Response)=> {
    getUsersForRooms(req, res);
});