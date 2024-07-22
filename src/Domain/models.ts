export interface User {
    _id?: number;
    userId: string;
    sessionId?: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    createdOn?: number;
    lastModifiedOn?: number;
}

export interface Contact {
    _id?: number;
    contactId?: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    createdOn?: number;
    lastModifiedOn?: number;
}
