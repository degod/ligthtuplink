const express = require ("express"); 

//controllers
const user = require ("../controllers/user.js");

const router = express.Router();

router
    .get('/login', user.getLogin)
   	.post('/login', user.onGetUserByUsername)
    //.get('/login:id', user.onGetUserById)
    //.delete('/:id', user.onDeleteUserById)

	.get('/register', user.getRegister)
	.post('/register', user.onCreateUser)
	
/**	.post('confirmation', user.confirmationPost)
	.post('/resend', user.resendTokenPost )
*/
module.exports = router;