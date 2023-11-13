const UserModel = require('../models/user.model');

class AuthRepository {
   async registerUser(body) {
        try {
            const pass = body.password;
            //hash the password before storing
            var result = await UserModel.create(body);
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }

    }
    async getUserById(userId) {
        try {
            // Use the UserModel to query the database for the user by their ID
            const user = await UserModel.findOne(userId);

            // Check if the user exists
            if (user) {
                return user;
            } else {
                // Return null or an appropriate error message if the user is not found
                return null;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async deleteUserById(userId){
        try{
            const result= await UserModel.deleteById(userId);
            return result;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}

module.exports = new AuthRepository();