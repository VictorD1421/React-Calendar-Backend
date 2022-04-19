const bcrypt = require('bcryptjs/dist/bcrypt');
const {response} = require('express');
const { generateJWT } = require('../helpers/jwt');
const UsersModel = require('../models/Users-model');



const userRegister = async(req, res = response) =>{
    
   const {email, password} = req.body;

    
   try {
       
        let user = await UsersModel.findOne({email});

        if(user){
            return res.status(400).json({
                ok: false,
                msg:'Email is already on use'
            });
        }
        user = new UsersModel(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
    
        await user.save();

        const token = await generateJWT(user.id, user.name);
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

   } catch (error) {
       console.log(error);
       
       res.status(500).json({
           ok: false,
           msg:'Password already exists'
       })
   }
   
   
}

const userLogin = async(req, res = response) =>{

    const {email, password} = req.body;


    try {

        const user = await UsersModel.findOne({email});

        if(!user){
            return res.status(400).json({
                ok: false,
                msg:'Email does not match'
            });
        }

        const validPassword = bcrypt.compareSync( password, user.password);

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg:'Password does not exits'
            });
        }
        const token = await generateJWT(user.id, user.name);
    

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
            msg: 'Login succesfull',
        })

        
    } catch (error) {
        console.log(error);
       
        res.status(500).json({
            ok: false,
            msg:'Please contact the admins'
        })
    }

}

const userTokenRenewal = async(req, res = response) =>{

    const {uid, name} = req

    const token = await generateJWT( uid, name);

    res.json({
        ok: true,
        name,
        uid,
        token,
    })
}

module.exports ={
    userRegister,
    userLogin,
    userTokenRenewal
}