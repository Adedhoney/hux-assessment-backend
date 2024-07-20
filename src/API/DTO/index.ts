export interface SignUpDTO {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface UpdatePassWordDTO {
    password: string;
}

export interface CreateContactDTO {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
}
export interface UpdateContactDTO {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
}
