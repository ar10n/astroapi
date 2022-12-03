import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

const userData = {
    email: 'email@email.com',
    name: 'Test Name',
    password: 'password',
    wrongPassword: 'wrongPassword',
};

beforeAll(async () => {
    const { app } = await boot;
    application = app;
});

describe('Users e2e', () => {
    it('Register - error', async () => {
        const result = await request(application.app).post('/users/register').send({
            email: userData.email,
            password: userData.password,
        });
        expect(result.statusCode).toBe(422);
    });

    it('Login - success', async () => {
        const result = await request(application.app).post('/users/login').send({
            email: userData.email,
            password: userData.password,
        });
        expect(result.body.jwt).not.toBeUndefined();
    });

    it('Login - error', async () => {
        const result = await request(application.app).post('/users/login').send({
            email: userData.email,
            password: userData.wrongPassword,
        });
        expect(result.statusCode).toBe(401);
    });

    it('Info - success', async () => {
        const login = await request(application.app).post('/users/login').send({
            email: userData.email,
            password: userData.password,
        });
        const result = await request(application.app)
            .get('/users/info')
            .set('Authorization', `Bearer ${login.body.jwt}`);
        expect(result.body.email).toBe(userData.email);
    });

    it('Info - error', async () => {
        const login = await request(application.app).post('/users/login').send({
            email: userData.email,
            password: userData.password,
        });
        const result = await request(application.app)
            .get('/users/info')
            .set('Authorization', `Bearer 123456789`);
        expect(result.statusCode).toBe(401);
    });
});

afterAll(() => {
    application.close();
});
