import "reflect-metadata"
import { DataSource } from "typeorm"

// export const AppDataSource = new DataSource({
//     type: "mongodb",
//     host: "localhost",
//     port: 27017,
//     username: "boren",
//     password: "boren",
//     database: "cashbook",
//     entities: [`${__dirname}/../src/entity/*.ts`]
// })


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3000, 
    username: "root",
    password: "admin",
    database: "cashbook",
    entities: [`${__dirname}/../src/entity/*.ts`],
    synchronize: true,
})
