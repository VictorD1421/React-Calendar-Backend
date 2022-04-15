const {response} = require('express');
const jwt = require('jsonwebtoken');



const validateJWT = (req, res = response, next) =>{

    //key header x-token

    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'Failed to get Token'
        })
    }

    try {

        const {uid, name} =jwt.verify( token, process.env.SECRET_JWT_SEED )

        req.uid = uid;
        req.name = name;
        
    } catch (error) {
        console.log(error);

        return res.status(401).json({
            ok: false,
            msg:'Token is unavailable'
        })
    }

    next();
}

module.exports = {
    validateJWT
}