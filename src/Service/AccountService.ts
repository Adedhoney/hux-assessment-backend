import { CustomError } from '@application/error';
import {
    decryptPassword,
    encryptPassword,
    generateAuthToken,
    generateRandomId,
    getCurrentTimeStamp,
    StatusCode,
} from '@application/utilities';
import { User } from '@domain/models';
import { IAccountRepository } from '@domain/Repository';
import { LoginDTO, SignUpDTO, UpdatePassWordDTO } from 'API/DTO';

export interface IAccountService {
    SignUp(data: SignUpDTO): Promise<void>;
    Login(data: LoginDTO): Promise<{ token: string; user: User }>;
    Logout(userId: string): Promise<void>;
    GetUser(userId: string): Promise<User>;
    UpdatePassword(data: UpdatePassWordDTO, userId: string): Promise<void>;
}

export class AccountService implements IAccountService {
    constructor(private acctrepo: IAccountRepository) {
        this.acctrepo = acctrepo;
    }

    async SignUp(data: SignUpDTO): Promise<void> {
        // Checks if email already exists
        const emailExists = await this.acctrepo.getUserByEmail(data.email);
        if (emailExists) {
            throw new CustomError('Email already exists, Log in instead.');
        }
        const password = await encryptPassword(data.password);

        const userId = generateRandomId();
        const sessionId = generateRandomId();
        const date = getCurrentTimeStamp();
        const user = {
            userId,
            sessionId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password,
            createdOn: date,
            lastModifiedOn: date,
        };
        await this.acctrepo.saveUser(user);
    }

    async Login(data: LoginDTO): Promise<{ token: string; user: User }> {
        const user = await this.acctrepo.getUserByEmail(data.email);

        if (!user) {
            throw new CustomError('Invalid username or password');
        }
        const validPassword = await decryptPassword(
            data.password,
            user.password as string,
        );
        if (!validPassword) {
            throw new CustomError('Invalid username or password');
        }
        const token = generateAuthToken(
            user.userId,
            user.email,
            user.sessionId,
        );

        delete user.password;

        return { token, user };
    }

    async Logout(userId: string): Promise<void> {
        const user = await this.acctrepo.getUserById(userId);
        if (!user) {
            return;
        }
        // change sessionId
        const sessionId = generateRandomId();

        await this.acctrepo.logoutUser(userId, sessionId);
    }

    async GetUser(userId: string): Promise<User> {
        const user = await this.acctrepo.getUserById(userId);
        if (!user) {
            throw new CustomError('User not found', StatusCode.UNAUTHORIZED);
        }

        delete user.password;

        return user;
    }

    async UpdatePassword(
        data: UpdatePassWordDTO,
        userId: string,
    ): Promise<void> {
        const userInfo = await this.acctrepo.getUserById(userId);

        const password = await encryptPassword(data.password);
        if (!userInfo) {
            throw new CustomError('User not found', StatusCode.UNAUTHORIZED);
        }

        const date = getCurrentTimeStamp();
        await this.acctrepo.updatePassword(userId, password, date);
    }
}
