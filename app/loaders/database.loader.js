const { DBService } = require("../config/db-service");
require('dotenv').config();


class DatabaseLoader {
    static init (){
        console.log(process.env.DB_HOST);

        // create mySQl pool
        DBService.init({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port:process.env.PORT
        });

        // verify connection
       
    }
    static checkConnection(){
        DBService.checkConnection();
    }
}

module.exports = { DatabaseLoader };