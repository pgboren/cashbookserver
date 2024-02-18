import express, { Express, Request, Response } from "express";
import cors from 'cors';
import util from 'util';
import dotenv from "dotenv";
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import http from 'http';
import "reflect-metadata"

import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { AppDataSource } from "./data-source";
import SystemData from "./data/systemData";

(async () => {

    const WebSocket = require('ws');
    dotenv.config();
    const app: Express = express();
    const { API_PORT } = process.env;
    const port = process.env.API_PORT || 3000;
    const db_host = process.env.DATABASE_HOST;
    const db_port = process.env.DATABASE_PORT;
    const db_username = process.env.DATABASE_USER;
    const db_password = process.env.DATABASE_PASSWORD;
    const db_name = process.env.DATABASE_NAME;
    const connnection_string = util.format('mongodb://%s:%s@%s:%d/%s', db_username, db_password, db_host, db_port, db_name);

    const initPostgres = async () => {
        await AppDataSource.initialize();
        const systemData: SystemData = new SystemData();
        systemData.initializeData();
        console.log('Datasoruce is connected');
    };

    try {
        await initPostgres();
        mongoose.connect(connnection_string, { useNewUrlParser: true, useUnifiedTopology: true });
        const database: mongoose.Connection = mongoose.connection;
        if (!database) {
            console.log('Error connecting db');
        } else {
            console.log('Db connected successfully');
        }

        app.use(cors());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());
        app.use(express.static('public'));

        const server: http.Server = http.createServer(app);
        const wss = new WebSocket.Server({ server });
        wss.on('connection', (socket: WebSocket) => {
            console.log('WebSocket Client connected');
            socket.send('Welcome to the WebSocket server!');
        });

        module.exports = { app, server, wss };
        userRoutes(app);
        authRoutes(app);
        server.listen(port, function () {
            console.log("Running RestHub on port " + port);
        });
    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', `=> ❌  Server error: ${error}`);
    }
})();



