import express, { Express, Request, Response } from "express";
import cors from 'cors';
import util from 'util';
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import "reflect-metadata"
import authRoutes from './routes/auth.routes';
import SystemData from "./data/systemData";
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from "./app.module";

const fs = require('fs');
const https = require('https');

(async () => {

    const expressApp: Express = express();

    dotenv.config();
    const port = process.env.API_PORT || 3000;
    const { API_PORT } = process.env;
    const db_host = process.env.DATABASE_HOST;
    const db_port = process.env.DATABASE_PORT;
    const db_username = process.env.DATABASE_USER;
    const db_password = process.env.DATABASE_PASSWORD;
    const db_name = process.env.DATABASE_NAME;
    const connnection_string = util.format('mongodb://%s:%s@%s:%d/%s', db_username, db_password, db_host, db_port, db_name);

    const options = {
        key: fs.readFileSync('./key/key.pem'),
        cert: fs.readFileSync('./key/cert.pem')
      };

    const init = async () => {
    };

    const setup_db_connection = async () => {
        mongoose.connect(connnection_string, { useNewUrlParser: true, useUnifiedTopology: true });
        const database: mongoose.Connection = mongoose.connection;
        if (!database) {
            console.log('Error connecting db');
        } else {
            console.log('Db connected successfully');
        }
    };

    const checking_and_add_default_data = async () => {
        const systemData: SystemData = new SystemData();
        systemData.initializeData();
        console.log('Datasoruce is connected');
    };

    try {
        await init();
        await setup_db_connection();
        await checking_and_add_default_data();
        
        expressApp.use(cors());
        expressApp.use(bodyParser.urlencoded({
            extended: true
        }));
        expressApp.use(bodyParser.json());
        expressApp.use(express.static('public'));

        module.exports = { expressApp};
        authRoutes(expressApp);


    
        const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
        await app.init();

        // Create HTTPS server with Express app
        https.createServer(options, expressApp).listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', `=> ❌  Server error: ${error}`);
    }
})();



