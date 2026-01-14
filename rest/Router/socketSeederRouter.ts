import express, { Request, Response } from "express";
import { getSocketUsers } from "../Controller/socketSeederController";
export const SocketRouter = express.Router();
SocketRouter.get('/users', (req:Request, res:Response)=> {
getSocketUsers(req, res)
})