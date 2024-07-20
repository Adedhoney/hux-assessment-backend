export interface User {
    _id?: number;
    userId: string;
    userName: string;
    sessionId: string;
    password?: string;
    createdOn?: string;
    lastModifiedOn?: string;
}

export interface Contact {
    _id?: number;
    contactId?: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: number;
    email?: string;
    createdOn?: string;
    lastModifiedOn?: string;
}
