import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {User } from '../models/User';

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const userAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) throw new Error("JWT_SECRET is not set");

      const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;

      if (!token) {
          return res.status(401).json({ message: "No token provided" });
      }


      const isBlacklisted = await User.findOne({token: token});

      if(isBlacklisted){
        return res.status(401).json({message: "Token is already used"});
      }

      const decoded = jwt.verify(token, jwtSecret) as { _id: string };
      const user = await User.findById(decoded._id);

      if(user?.user_type !== "user"){
        return res.status(401).json({message: "Unauthorized"});
      }

      if (!user) {
          return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
  } catch (error: any) {
      res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};


export const recruiterAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) throw new Error("JWT_SECRET is not set");

      const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
          return res.status(401).json({ message: "No token provided" });
      }


      const isBlacklisted = await User.findOne({token: token});

      if(isBlacklisted){
        return res.status(401).json({message: "Token is already used"});
      }

      const decoded = jwt.verify(token, jwtSecret) as { _id: string };
      const user = await User.findById(decoded._id);

      if(user?.user_type !== "recruiter"){
        return res.status(401).json({message: "Unauthorized"});
      }

      if (!user) {
          return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
  } catch (error: any) {
      res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};