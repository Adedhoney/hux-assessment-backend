import { AccountRepository, ContactRepository } from '@domain/Repository';
import { Database } from '@infrastructure/Database';
import { AccountController, ContactController } from 'API/Controller';
import { Authentication, Validation } from 'API/Middleware';
import {
    CreateContactSchema,
    LogInSchema,
    SignUpSchema,
    UpdateContactSchema,
} from 'API/Schema';
import { AccountService, ContactService } from 'Service';

import { Router } from 'express';

const router = Router();
const database = new Database();

const acctrepo = new AccountRepository(database);
const contactrepo = new ContactRepository(database);
const acctservice = new AccountService(acctrepo);
const acctctr = new AccountController(acctservice);
const contactctr = new ContactController(new ContactService(contactrepo));

const Auth = Authentication(acctrepo);

router.post('/account/signup', Validation(SignUpSchema), acctctr.signUp);
router.post('/account/login', Validation(LogInSchema), acctctr.login);

router.post('/account/logout', Auth, acctctr.logout);
router.get('/account', Auth, acctctr.getUser);

router.post(
    '/contact',
    Auth,
    Validation(CreateContactSchema),
    contactctr.saveContact,
);
router.post(
    '/contact/update/:contactId',
    Auth,
    Validation(UpdateContactSchema),
    contactctr.updateContact,
);
router.get('/contact', Auth, contactctr.getAllContacts);
router.get('/contact/:contactId', Auth, contactctr.getSingleContact);
router.delete('/contact/:contactId', Auth, contactctr.deleteContact);

// Admin Routes

export { router };
