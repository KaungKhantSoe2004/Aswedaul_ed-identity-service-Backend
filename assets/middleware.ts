import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { decode } from "punycode";
export const getToken = (id: number, role: string): string => {
  console.log(process.env.JWT_SECRET)
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: 10 * 24 * 60 * 60,
  });
  return token;
};

export const getChatToken =  (id: number, role: string): string => {
  console.log(process.env.CHAT_JWT_SECRET, 'is in chat');
  const token = jwt.sign({ id, role }, process.env.CHAT_JWT_SECRET, {
    expiresIn: 10 * 24 * 60 * 60,
  });
  return token;
};

interface JwtPayload {
  id: number;
  role: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.aswedaul_ed_jwt;
  console.log(token , 'token here')
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    console.log(decoded, 'is decoded bro dude')
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized: invalid token" });
    }

    (req as any).user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};