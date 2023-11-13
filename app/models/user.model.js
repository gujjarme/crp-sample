
const { DBService } = require('../config/db-service');
class UserModel{
    async create ({firstName,lastName,email,password,roleId,userId}){
        const sql = `INSERT INTO users (userId,firstname, lastname, password, email, role_id) VALUES ($1, $2, $3, $4, $5,$6)`;
        try {
            const result = await DBService.query(sql, [userId, firstName, lastName, email, password, roleId]).catch((err)=>{
                console.log(err);
            });
            if(result.rowCount==1){
                return result.rowCount;
            }
            else{
                throw new Error("User could not be created.");
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async findOne(userId) {
        const sql = 'SELECT * FROM users WHERE userid = $1';
        try {
            const result = await DBService.query(sql, [userId]).catch((err) => {
                console.log(err);
            });
            if (result.rows.length === 1) {
                // Return the first row of the result, which should be the single matching record
                return result.rows[0];
            } else if (result.rows.length === 0) {
                // No matching records found
                return null;
            } else {
                // More than one record found, which is unexpected
                throw new Error('Multiple records found for the given criteria');
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    async deleteById(userId) {
        const sql = 'DELETE FROM users WHERE userid = $1';
        try {
            const result = await DBService.query(sql, [userId]).catch((err) => {
                console.log(err);
            });

            if (result.rowCount === 1) {
                return true; // Deletion was successful
            } else if (result.rowCount === 0) {
                return false;
            } else {
                // More than one record deleted (unexpected)
                throw new Error('Multiple records deleted for the given criteria');
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}
module.exports=new UserModel();