import { User } from '../models/User';
import {IUser} from '../types/index';
import { BlacklistToken } from '../models/BlacklistToken';
import { Request, Response } from 'express';
import { validationOnRegister } from '../utils/validation';

interface AuthenticatedRequest extends Request {
    user?: any;
}
  
export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { fullName, email, password,user_type } = req.body;

        // Validate request data
        const validationErrors = validationOnRegister(req);
        if (validationErrors.length > 0) {
            return res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        }

        // Check if email already exists
        const emailExist = await User.findOne({ email: email });
        if (emailExist) {
            return res.status(400).send("Email already exists!");
        }

        // Hash the password using the static method
        const hashedPassword = await User.hashPassword(password);

         // Create a new user document
         const user = new User({
            email: email,
            password: hashedPassword,
            fullName: { firstName: fullName.firstName, lastName: fullName.lastName },
            user_type: user_type
        });
        const Gentoken = await user.getJWT();

        const savedUser = await user.save();

        return res.status(201).json({ message: 'User created successfully', data: savedUser, token: Gentoken });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user', error });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Provide all mandatory fields!");
    }

    const fetchUser = await User.findOne({ email }).select('+password') as IUser;

    if (!fetchUser) {
      throw new Error("User not exist!");
    }

    const isPasswordValid = await fetchUser.validatePassword(password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = await fetchUser.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

    return res.status(200).send({
      status: "Login Successfully!",
      token: token,
      user: fetchUser.fullName
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error in login', error });
  }
};


export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json({ user });
    } catch (err:any) {
        return res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
    try {
        // Get the token from the request cookies or headers
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(400).send("No token provided!");
        }

        // Blacklist the token
        await BlacklistToken.create({ token });

        // Clear the token cookie
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(0),
        });

        return res.status(200).send("Logged out successfully!");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Something went wrong during logout.");
    }
};
