const { Pool } = require('pg');


class DBService {
    init({ host, user, database, password, port }) {
        console.log(user,host,password);
        this.dbInstance = new Pool({
            user: user,
            host: host,
            password: password,
            port: port,
            database: database
        })
    }

    async checkConnection() {
        try {

            const client = await this.dbInstance.connect().then((res)=>{
                console.log(res);
            }).catch((err)=>{
                console.log(err)
            });
            console.log('Database connection is healthy');
            return true;
        } catch (error) {
            console.error('Database connection error:', error);
            return false;
        }

    }

    getConnection() {
        return new Promise(async (resolve, reject) => {
            try {
                const client = await this.dbInstance.connect();
                resolve(client);
            } catch (error) {
                console.error("Database Connection Failed", error);
                reject(error);
            }
        });
    }

    query = (sql, values) => {
        return new Promise((resolve, reject) => {
            this.getConnection()
                .then((client) => {
                    client.query(sql, values, (error, result) => {
                        if (error) {
                            reject(error); // Reject the promise on error
                        } else {
                            resolve(result); // Resolve with the query result
                        }
                        client.release(); // Release the database connection
                    });
                })
                .catch((error) => {
                    reject(error); // Reject the promise on connection error
                });
        });
    }
    

    // getConnection() {
    //     return this.dbInstance.connect().catch((error) => {
    //         console.error("Database Connection Failed", error);
    //         throw error; // Re-throw the error for handling elsewhere
    //     });
    // }

    // async query(sql, values) {
    //     try {
    //         const client = await this.getConnection();
    //         const result = await client.query(sql, values);
    //         return result;
    //     } catch (error) {
    //         console.error("Database Query Error", error);
    //         throw error; // Re-throw the error for handling elsewhere
    //     }
    // }



}
module.exports.DBService = new DBService();