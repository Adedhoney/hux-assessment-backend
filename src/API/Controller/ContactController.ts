import { IBaseRequest, RequestWithUserId } from '../Utilities/Request';
import { successResponse } from '../Utilities/Response';
import { CreateContactDTO, UpdateContactDTO } from 'API/DTO';
import { IContactService } from 'Service';
import { NextFunction, RequestHandler, Response } from 'express';

export class ContactController {
    constructor(private readonly service: IContactService) {
        this.service = service;
    }

    saveContact: RequestHandler = async (
        req: IBaseRequest<CreateContactDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const contact = await this.service.SaveContact(
                req.userId!,
                req.body.data,
            );

            return successResponse(res, 'Contact saved', { contact });
        } catch (err) {
            next(err);
        }
    };

    updateContact: RequestHandler = async (
        req: IBaseRequest<UpdateContactDTO>,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const contact = await this.service.UpdateContact(
                req.userId!,
                req.params.contactId,
                req.body.data,
            );

            return successResponse(res, 'Contact updated', { contact });
        } catch (err) {
            next(err);
        }
    };

    getAllContacts: RequestHandler = async (
        req: RequestWithUserId,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const contacts = await this.service.GetAllContacts(req.userId!);

            return successResponse(res, 'Contacts', contacts);
        } catch (err) {
            next(err);
        }
    };

    getSingleContact: RequestHandler = async (
        req: RequestWithUserId,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            const contact = await this.service.GetSingleContact(
                req.userId!,
                req.params.coverId,
            );

            return successResponse(res, 'Contact', contact);
        } catch (err) {
            next(err);
        }
    };

    deleteContact: RequestHandler = async (
        req: RequestWithUserId,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            await this.service.DeleteContact(req.userId!, req.params.coverId);

            return successResponse(res, 'Contact deleted');
        } catch (err) {
            next(err);
        }
    };
}
