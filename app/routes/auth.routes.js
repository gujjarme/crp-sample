const router = require('express').Router(); 
const AuthController = require('../controllers/auth.controller');

router.post('/register',AuthController.registerUser);
router.get('/users/:userId', AuthController.getUser);
router.get('/remove/:userId',AuthController.removeUser);
router.post('/createDb',AuthController.createDatabase);
router.post('/insertData',AuthController.insertData);


module.exports=router;