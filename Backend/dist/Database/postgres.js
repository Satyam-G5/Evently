"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const pool = new Pool({
//     host: 'localhost',
//     port: 5433,
//     database: 'Evently',
//     user: 'postgres',
//     password: 'Satyam12'
// });
const dblocal = `postgresql://${process.env.PGLOCAL_USER}:${process.env.PGLOCAL_PASSWORD}@${process.env.PGLOCAL_HOST}:${process.env.PGLOCAL_PORT}/${process.env.PGLOCAL_DATABASE}`;
const dbproduction = "postgres://ysnlbmfo:yFO9W4q_PXu1IdWXrKFyxu7OgwwC37T0@floppy.db.elephantsql.com/ysnlbmfo";
const pool = new pg_1.Pool({
    connectionString: process.env.NODE_ENV === "production" ? dbproduction : dblocal,
    ssl: {
        rejectUnauthorized: false
    }
});
exports.default = pool;
