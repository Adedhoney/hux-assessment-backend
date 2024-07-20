import { IDatabase } from '@infrastructure/Database';
import { User } from '../models';

export interface IAccountRepository {
    readonly db: IDatabase;
    saveUser(user: User): Promise<void>;
    getUserById(userId: string): Promise<User>;
    getUserByUserName(email: string): Promise<User>;
    userNameAvalable(userName: string): Promise<boolean>;

    getUsers(): Promise<User[]>;

    updatePassword(
        userId: string,
        password: string,
        date: string,
    ): Promise<void>;
}

export class AccountRepository implements IAccountRepository {
    private database;
    constructor(readonly db: IDatabase) {
        this.db = db;
        this.database = db.getDb();
    }

    async saveUser(user: User): Promise<void> {
        await this.database.collection<User>('users').insertOne(user);
    }

    async getUserById(userId: string): Promise<User> {
        const user = await this.database
            .collection<User>('users')
            .findOne({ userId });
        return user as User;
    }
    async getUserByEmail(email: string): Promise<User> {
        const user = await this.database
            .collection<User>('users')
            .findOne({ email });
        return user as User;
    }
    async getUserByUserName(userName: string): Promise<User> {
        const user = await this.database
            .collection<User>('users')
            .findOne({ userName });
        return user as User;
    }
    async userNameAvalable(userName: string): Promise<boolean> {
        const user = await this.database
            .collection<User>('users')
            .findOne({ userName });
        if (user) {
            return false;
        }
        return true;
    }

    async getUsers(): Promise<User[]> {
        const users = await this.database
            .collection<User>('users')
            .find({})
            .toArray();
        return users as User[];
    }

    async updatePassword(
        userId: string,
        password: string,
        date: string,
    ): Promise<void> {
        await this.database
            .collection<User>('users')
            .updateOne(
                { userId },
                { $set: { password, lastModifiedOn: date } },
            );
    }
}
