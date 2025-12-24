"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const setup_app_1 = require("../../../src/setup-app");
const express_1 = __importDefault(require("express"));
const http_statuses_1 = require("../../../src/core/typesAny/http-statuses");
const clear_db_1 = require("../../utils/clear-db");
const mongo_db_1 = require("../../../src/db/mongo.db");
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../../../src/core/settings/settings");
describe('Authorization jwt', () => {
    const app = (0, express_1.default)();
    (0, setup_app_1.setupApp)(app);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect(settings_1.SETTINGS.MONGO_URL);
        yield (0, clear_db_1.clearDb)(app);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongo_db_1.stopDb)();
    }));
    it(`Successfully authenticated and return 200. NOT 500!`, () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = {
            login: 'NewJeans',
            email: 'newjeans@mail.com',
            password: 'Hanni1',
        };
        // 1️⃣ Создаём пользователя
        yield (0, supertest_1.default)(app)
            .post('/users')
            .auth('admin', 'qwerty') // если используется basic auth
            .send(newUser)
            .expect(http_statuses_1.HttpStatus.Created);
        // 2️⃣ Логинимся под тем же пользователем
        const response = yield (0, supertest_1.default)(app)
            .post('/auth/login')
            .send({ loginOrEmail: newUser.login, password: newUser.password })
            .expect(http_statuses_1.HttpStatus.Ok);
        // 3️⃣ Проверяем ответ
        expect(response.body).toHaveProperty('accessToken');
        expect(typeof response.body.accessToken).toBe('string');
        expect(response.body.accessToken.length).toBeGreaterThan(10);
    }));
});
