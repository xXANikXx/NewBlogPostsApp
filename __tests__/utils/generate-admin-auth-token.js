"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBasicAuthToken = generateBasicAuthToken;
const super_admin_guard_middleware_1 = require("../../src/auth/adapters/middlewares/super-admin.guard-middleware");
function generateBasicAuthToken() {
    const credentials = `${super_admin_guard_middleware_1.ADMIN_USERNAME}:${super_admin_guard_middleware_1.ADMIN_PASSWORD}`;
    const token = Buffer.from(credentials).toString('base64');
    return `Basic ${token}`;
}
