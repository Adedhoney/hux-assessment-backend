import axios, { AxiosError } from 'axios';
const baseUrl = 'http://localhost:8080/api';

describe('update contact test', () => {
    // You must have created an account with testing@gmail.com and password as password and generated an auth token by signing in
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyN2JlZDI3OS0wMzBiLTQ5NzMtYTc5Zi03MWFiYTM0YmZlYjAiLCJ1c2VybmFtZSI6ImFkZWRveWluY29kZXNAZ21haWwuY29tIiwic2Vzc2lvbklkIjoiOTU3YjFiODYtMTY5OS00NmQ5LWEzZDQtOWE2NDUxNjllNDQ4IiwiaWF0IjoxNzIxNjk3NTQwLCJleHAiOjE3MjE3ODM5NDB9.gjdrPL9EtfvZgNdSK4_sU2cFeGKDcbBfYX_aqAgUcV4';

    const contactId = '3ab0398c-0295-49d0-b8c0-36f49edb14e9';
    let contact = {
        firstName: 'Test',
        lastName: 'Contact',
        phone: '07054685448',
        email: 'testContact@gmail.com',
    };

    // tests

    test('contact not found', async () => {
        try {
            await axios.post(
                `${baseUrl}/contact/update/contactId123`,
                { data: contact },
                {
                    headers: {
                        authorization: `Basic ${token}`,
                    },
                },
            );
        } catch (error) {
            expect((error as AxiosError).response?.status).toBe(400);
            expect(
                ((error as AxiosError).response?.data as any).message,
            ).toEqual(`Contact with contactId contactId123 not found`);
        }
    });

    test('data validation error', async () => {
        try {
            await axios.post(
                `${baseUrl}/contact/update/${contactId}`,
                {
                    data: {},
                },
                {
                    headers: {
                        authorization: `Basic ${token}`,
                    },
                },
            );
        } catch (error) {
            expect((error as AxiosError).response?.status).toBe(400);
            expect(
                ((error as AxiosError).response?.data as any).message,
            ).toEqual(
                'You must update one of either firstname, lastname, phone or email',
            );
        }
    });

    test('success', async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/contact/update/${contactId}`,
                { data: contact },
                {
                    headers: {
                        authorization: `Basic ${token}`,
                    },
                },
            );

            expect(response.status).toBe(200);
            expect(response.data.message).toEqual('Contact updated');
            expect(response.data.data.contact.phone).toEqual(contact.phone);
        } catch (error) {
            // expect((error as AxiosError).response?.data.message);
        }
    });
});
