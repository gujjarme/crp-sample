const { DBService } = require('../config/db-service');
const AuthRepository = require('../repositories/auth.repository');
const PostgresConnectionPoolManager = require('../config/connection.pool'); // Import the class

const { Pool } = require('pg');
var globalIndex=0;
class AuthController {

    async registerUser(req, res, next) {
        try {
            // Get user data from the request body
            const userData = req.body;

            // Call the registerUser method from the repository to perform user registration
            const registrationResult = await AuthRepository.registerUser(userData);

            if (registrationResult == 1) {
                // Registration was successful
                res.status(201).json({
                    message: 'User registered successfully'
                });
            } else {
                // Registration failed
                res.status(400).json({ error: "User Could not be created." });
            }
        } catch (error) {
            // Handle unexpected errors
            console.error('Error in registerUser:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getUser(req, res, next) {
        try {
            // Retrieve user ID from the request parameters or wherever it's stored in your request
            const userId = req.params.userId; // Assuming it's a parameter in the URL
    
            // Call a repository or service method to retrieve user data
            const userData = await AuthRepository.getUserById(userId);
    
            if (userData) {
                // User data found
                res.status(200).json(userData);
            } else {
                // User not found
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            // Handle unexpected errors
            console.error('Error in getUser:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async removeUser(req,res,next){
        try{
            const userId = req.params.userId;
            const deletionResult= await AuthRepository.deleteUserById(userId);
            if (deletionResult == 1) {
                res.status(201).json({
                    message: 'User deleted successfully'
                });
            } else {
                res.status(400).json({ error: "User Could not be deleted." });
            }
        }
        catch(err){
            console.log(err);
            res.status(400).json({message:err});
        }
    }
    async insertData(req,res,next){
        try{
            const dbName= req.body.dbName;
            const userId= req.body.userId;
            const name= req.body.name;
            const age = req.body.age;
           
            const client = PostgresConnectionPoolManager.getConnectionPool(dbName);
            const insertSql=`INSERT INTO user_table (username, name, age) VALUES ($1, $2, $3)`;
            try
            {
                const queryClient = await client.connect();
                await queryClient.query(insertSql,[userId,name,age]);
                queryClient.release();
                res.status(200).json({message:"Data inserted"});

            }catch(err){
                console.log(err)
                res.status(203).json({message:err})
            }
    
        }catch(err){
            console.log(err);
            res.status(203).json({message:err});
           // throw new Error("Duplicate Data")
           
        }
    }
    async createDatabase(req,res,next){
        try{

            let clientName = req.body.clientName;
            let dbName = req.body.dbName;
            const newPassword = req.body.password;
            dbName = dbName +globalIndex;
            clientName = clientName +1; 
            globalIndex=globalIndex+1;

            const createDatabaseQuery = `CREATE DATABASE ${dbName};`;
            const createTable=`CREATE TABLE user_table (
                username varchar(25),
                name varchar(255) NOT NULL,
                age integer
            );`;
            const createRoleQuery = `CREATE ROLE ${clientName} LOGIN PASSWORD '${newPassword.toString()}';`;
            const rolePriviligeQuery = `GRANT ALL PRIVILEGES ON SCHEMA public TO ${clientName};`;
            const superUserQuery=`ALTER USER ${clientName} WITH SUPERUSER;`;


            await DBService.query(createDatabaseQuery).catch(err=>{
                console.log(err)
            });
            await DBService.query(createRoleQuery).catch(err=>{
                console.log(err);
            })
            await DBService.query(rolePriviligeQuery).catch(err=>{
                console.log(err);
            })
            await DBService.query(superUserQuery).catch(err=>{
                console.log(err)
            });
            const client = new Pool({
                user: clientName,
                password: newPassword.toString(),
                host: process.env.DB_HOST,
                database: dbName
            });
            PostgresConnectionPoolManager.setConnectionPool(dbName,client);
            try
            {
                const queryClient=await  client.connect();
                await queryClient.query(createTable);
                console.log("Database created with table.");
                queryClient.release();
                res.status(200).json({message:"Database created with table"});
            } catch (error) {
                console.error(`Error creating user: ${error}`);
                res.status(201).json({message:err});
            } 
        }catch(err){
            console.log(err);
            res.status(201).json({message:err});
        }
    
    }
    
}

module.exports = new AuthController();
