import { IBaseRequest, RequestWithUserId } from '../Utilities/Request';
import { successResponse } from '../Utilities/Response';
import { LoginDTO, SignUpDTO, UpdatePassWordDTO } from 'API/DTO';
import { IAccountService } from 'Service';
import { NextFunction, RequestHandler, Response } from 'express';

export class AccountController {
    constructor(private readonly service: IAccountService) {
        this.service = service;
    }

    signUp: RequestHandler = async (
        req: IBaseRequest<SignUpDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.SignUp(req.body.data);

            return successResponse(res, 'SignUp Successful');
        } catch (err) {
            next(err);
        }
    };

    login: RequestHandler = async (
        req: IBaseRequest<LoginDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const data = await this.service.Login(req.body.data);

            return successResponse(res, 'Login Successful', { ...data });
        } catch (err) {
            next(err);
        }
    };

    logout: RequestHandler = async (
        req: RequestWithUserId,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.Logout(req.userId!);

            return successResponse(res, 'Log out');
        } catch (err) {
            next(err);
        }
    };

    getUser: RequestHandler = async (
        req: RequestWithUserId,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const user = await this.service.GetUser(req.userId!);

            return successResponse(res, 'User', { user });
        } catch (err) {
            next(err);
        }
    };

    updatePassword: RequestHandler = async (
        req: IBaseRequest<UpdatePassWordDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.UpdatePassword(req.body.data, req.userId!);

            return successResponse(res, 'Password updated');
        } catch (err) {
            next(err);
        }
    };
}
