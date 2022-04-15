/*
        User Routes /Auth
        host + /api/auth
*/

const {Router} = require('express');
const {check} = require('express-validator');
const { userRegister, userLogin, userTokenRenewal } = require('../controllers/authController,');
const validateField = require('../middlewares/fieldValidators');
const { validateJWT } = require('../middlewares/validate-jwt');
const router = Router();




router.post('/register',
        [
                //Middlewares
                check('name', 'This field is obligatory').not().isEmpty(),
                check('email', 'This email is not valid').isEmail(),
                check('password', 'Password must be at least 8 characteres').isLength({min: 8}),
                validateField
        ], 
        userRegister);


router.post('/',
        [
                check('email', 'This email is not valid').isEmail(),
                check('password', 'Password must be at least 8 characteres').isLength({min: 8}),
                validateField

        ], userLogin )


router.get('/renew', validateJWT, userTokenRenewal)



module.exports = router;