import axios, { AxiosError } from 'axios';
const baseUrl = 'http://localhost:8080/api';

describe('create contact test', () => {
    // You must have created an account with testing@gmail.com and password as password and generated an auth token by signing in
    let token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyN2JlZDI3OS0wMzBiLTQ5NzMtYTc5Zi03MWFiYTM0YmZlYjAiLCJ1c2VybmFtZSI6ImFkZWRveWluY29kZXNAZ21haWwuY29tIiwic2Vzc2lvbklkIjoiOTU3YjFiODYtMTY5OS00NmQ5LWEzZDQtOWE2NDUxNjllNDQ4IiwiaWF0IjoxNzIxNjk3NTQwLCJleHAiOjE3MjE3ODM5NDB9.gjdrPL9EtfvZgNdSK4_sU2cFeGKDcbBfYX_aqAgUcV4';

    beforeAll(async () => {
        try {
            await axios.post(`${baseUrl}/account/signup`, {
                data: {
                    firstName: 'testing',
                    lastName: 'testing',
                    email: 'testing@testing.com',
                    password: 'testing',
                },
            });
        } catch (error) {}
        try {
            token = (
                await axios.post(`${baseUrl}/account/login`, {
                    data: {
                        email: 'testing@testing.com',
                        password: 'testing',
                    },
                })
            ).data.data.token;
        } catch (error) {
            throw new Error("Can't login");
        }
    });

    let contact = {
        firstName: 'Test',
        lastName: 'Contact',
        phone: '07054685448',
        email: 'testContact@gmail.com',
    };

    // tests
    test('not found', async () => {
        console.log(token);
        try {
            await axios.post(
                `${baseUrl}/contacting`,
                { data: contact },
                {
                    headers: {
                        authorization: `Basic ${token}`,
                    },
                },
            );
        } catch (error) {
            expect((error as AxiosError).response?.status).toBe(404);
            expect(
                ((error as AxiosError).response?.data as any).message,
            ).toEqual('Not Found');
        }
    });

    test('invalid token', async () => {
        try {
            await axios.post(
                `${baseUrl}/contact`,
                { data: contact },
                {
                    headers: {
                        authorization: `Basic wrongtoken`,
                    },
                },
            );
        } catch (error) {
            expect((error as AxiosError).response?.status).toBe(401);
            expect(
                ((error as AxiosError).response?.data as any).message,
            ).toEqual('Token Expire');
        }
    });

    test('data validation error', async () => {
        try {
            await axios.post(
                `${baseUrl}/contact`,
                {
                    data: {
                        firstName: 'Test',
                        lastName: 'Contact',
                        email: 'testContact@gmail.com',
                    },
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
            ).toEqual('"phone" is required');
        }
    });

    test('success', async () => {
        try {
            const response = await axios.post(
                `${baseUrl}/contact`,
                { data: contact },
                {
                    headers: {
                        authorization: `Basic ${token}`,
                    },
                },
            );

            expect(response.status).toBe(200);
            expect(response.data.message).toEqual('Contact saved');
            expect(response.data.data.contact.phone).toEqual(contact.phone);
        } catch (error) {
            // expect((error as AxiosError).response?.data.message);
        }
    });
});
