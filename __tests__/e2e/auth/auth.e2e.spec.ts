import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import express from 'express';
import { HttpStatus } from '../../../src/core/typesAny/http-statuses';
import { clearDb } from '../../utils/clear-db';
import { runDB, stopDb } from '../../../src/db/mongo.db';

describe('Authorization jwt', () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDB('mongodb+srv://nik:nik@lesson.mezyenu.mongodb.net/blogspostsapp?retryWrites=true&w=majority');
        await clearDb(app);
    });

    afterAll(async () => {
        await stopDb();
    });

    it(`Successfully authenticated and return 200. NOT 500!`, async () => {
        const newUser = {
            login: 'NewJeans',
            email: 'newjeans@mail.com',
            password: 'Hanni1',
        };

        // 1️⃣ Создаём пользователя
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty') // если используется basic auth
            .send(newUser)
            .expect(HttpStatus.Created);

        // 2️⃣ Логинимся под тем же пользователем
        const response = await request(app)
            .post('/auth/login')
            .send({ loginOrEmail: newUser.login, password: newUser.password })
            .expect(HttpStatus.Ok);

        // 3️⃣ Проверяем ответ
        expect(response.body).toHaveProperty('accessToken');
        expect(typeof response.body.accessToken).toBe('string');
        expect(response.body.accessToken.length).toBeGreaterThan(10);
    });


});
