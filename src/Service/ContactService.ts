import { CreateContactDTO, UpdateContactDTO } from '@api/DTO';
import { CustomError } from '@application/error';
import {
    generateRandomId,
    getCurrentTimeStamp,
    StatusCode,
} from '@application/utilities';
import { Contact } from '@domain/models';
import { IContactRepository } from '@domain/Repository';

export interface IContactService {
    SaveContact(userId: string, data: CreateContactDTO): Promise<Contact>;
    UpdateContact(
        userId: string,
        contactId: string,
        data: UpdateContactDTO,
    ): Promise<Contact>;
    GetAllContacts(userId: string): Promise<Contact[]>;
    GetSingleContact(userId: string, contactId: string): Promise<Contact>;
    DeleteContact(userId: string, contactId: string): Promise<void>;
}

export class ContactService implements IContactService {
    constructor(
        private contactrepo: IContactRepository, // private acctrepo: IAccountRepository,
    ) {
        this.contactrepo = contactrepo;
    }

    async SaveContact(
        userId: string,
        data: CreateContactDTO,
    ): Promise<Contact> {
        const contactId = generateRandomId();
        const date = getCurrentTimeStamp();

        const contactInfo: Contact = {
            contactId,
            userId,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            createdOn: date,
            lastModifiedOn: date,
        };
        if (data.email) contactInfo.email = data.email;

        await this.contactrepo.saveContact(contactInfo);

        return contactInfo;
    }

    async UpdateContact(
        userId: string,
        contactId: string,
        data: UpdateContactDTO,
    ): Promise<Contact> {
        const date = getCurrentTimeStamp();

        const oldContact = await this.contactrepo.getContactbyId(
            userId,
            contactId,
        );
        if (!oldContact) {
            throw new CustomError(
                `Contact with contactId ${contactId} not found`,
                StatusCode.BAD_REQUEST,
            );
        }

        const contactInfo = { ...oldContact, ...data, lastModifiedOn: date };

        await this.contactrepo.updateContact(userId, contactInfo);

        return contactInfo;
    }

    async GetAllContacts(userId: string): Promise<Contact[]> {
        const contacts = await this.contactrepo.getUserContacts(userId);
        return contacts;
    }

    async GetSingleContact(
        userId: string,
        contactId: string,
    ): Promise<Contact> {
        const contact = await this.contactrepo.getContactbyId(
            userId,
            contactId,
        );
        return contact;
    }

    async DeleteContact(userId: string, contactId: string): Promise<void> {
        await this.contactrepo.deleteContact(userId, contactId);
    }
}
