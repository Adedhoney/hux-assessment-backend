import { IDatabase } from '@infrastructure/Database';
import { Contact } from '../models';

export interface IContactRepository {
    readonly db: IDatabase;
    saveContact(contact: Contact): Promise<void>;
    getUserContacts(userId: string): Promise<Contact[]>;
    getContactbyId(contactId: string): Promise<Contact>;
    updateContact(contact: Contact): Promise<void>;
    deleteContact(contactId: string): Promise<void>;
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

    async getContactbyId(contactId: string): Promise<Contact> {
        const contact = await this.database
            .collection<Contact>('contacts')
            .findOne({ contactId });
        return contact as Contact;
    }

    async updateContact(contact: Contact): Promise<void> {
        await this.database.collection<Contact>('contacts').updateOne(
            { contactId: contact.contactId },
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

    async deleteContact(contactId: string): Promise<void> {
        await this.database
            .collection<Contact>('contacts')
            .deleteOne({ contactId });
    }
}
