import { IDatabase } from '@infrastructure/Database';
import { Contact } from '../models';

export interface IContactRepository {
    readonly db: IDatabase;
    saveContact(contact: Contact): Promise<void>;
    getUserContacts(userId: string): Promise<Contact[]>;
    getContactbyId(userId: string, contactId: string): Promise<Contact>;
    updateContact(userId: string, contact: Contact): Promise<void>;
    deleteContact(userId: string, contactId: string): Promise<void>;
}

export class ContactRepository implements IContactRepository {
    private database;
    constructor(readonly db: IDatabase) {
        this.db = db;
        this.database = db.getDb();
    }

    async saveContact(contact: Contact): Promise<void> {
        await this.database.collection<Contact>('contacts').insertOne(contact);
    }

    async getUserContacts(userId: string): Promise<Contact[]> {
        const contacts = await this.database
            .collection<Contact>('contacts')
            .find({ userId })
            .toArray();
        return contacts as Contact[];
    }

    async getContactbyId(userId: string, contactId: string): Promise<Contact> {
        const contact = await this.database
            .collection<Contact>('contacts')
            .findOne({ userId, contactId });
        return contact as Contact;
    }

    async updateContact(userId: string, contact: Contact): Promise<void> {
        await this.database.collection<Contact>('contacts').updateOne(
            { userId, contactId: contact.contactId },
            {
                $set: {
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    phone: contact.phone,
                    email: contact.email,
                    lastModifiedOn: contact.lastModifiedOn,
                },
            },
        );
    }

    async deleteContact(userId: string, contactId: string): Promise<void> {
        await this.database
            .collection<Contact>('contacts')
            .deleteOne({ userId, contactId });
    }
}
