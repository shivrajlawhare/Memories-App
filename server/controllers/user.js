import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import dotenv from 'dotenv';


import User from '../models/user.js';

dotenv.config();

export const signin = async(req,res) => {
    if(req.body.googleAccessToken){
        // gogole-auth
        const {googleAccessToken} = req.body;

        axios
            .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }
        })
            .then(async response => {
                // const firstName = response.data.given_name;
                // const lastName = response.data.family_name;
                const email = response.data.email;
                // const picture = response.data.picture;

                const existingUser = await User.findOne({email})

                if (!existingUser) 
                return res.status(404).json({message: "User don't exist!"})

                const token = jwt.sign({
                    email: existingUser.email,
                    id: existingUser._id
                }, process.env.JWT_SECRET, {expiresIn: "1h"})
        
                res
                    .status(200)
                    .json({result: existingUser, token})
                    
            })
            .catch(err => {
                res
                    .status(400)
                    .json({message: "Invalid access token!"})
            })
    }
    else{
        const { email, password } = req.body;
        try {
            const existingUser = await User.findOne({email});
            if(!existingUser) return res.status(404).json({message: "User doesn't exist"});

            const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
            if(!isPasswordCorrect) return res.status(400).json({message: "Invalid credentials"})

            const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, {expiresIn: "1h"})
            res.status(200).json({result: existingUser,token})
        } catch (error) {
            res.status(500).json({ message: 'something went wrong' })
        }
    }
}

export const signup = async(req,res) => {
    if(req.body.googleAccessToken){
        //google auth
        const {googleAccessToken} = req.body;

        axios
            .get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                "Authorization": `Bearer ${googleAccessToken}`
            }
        })
            .then(async response => {
                console.log(response.data)
                const firstName = response.data.given_name;
                const lastName = response.data.family_name;
                const email = response.data.email;
                const picture = response.data.picture;

                const existingUser = await User.findOne({email})

                if (existingUser) 
                    return res.status(400).json({message: "User already exist!"})

                const result = await User.create({email, name: `${firstName} ${lastName}`})

                const token = jwt.sign({
                    email: result.email,
                    id: result._id
                }, process.env.JWT_SECRET, {expiresIn: "1h"})

                res
                    .status(200)
                    .json({result, token})
            })
            .catch(err => {
                res
                    .status(400)
                    .json({message: "Invalid access token!"})
            })
    }
    else{
        const { email, password, confirmPassword, firstName,  lastName} = req.body

        try {
            const existingUser = await User.findOne({email});
            if(existingUser) return res.status(400).json({message: "User already exist"});
        
            if(password!=confirmPassword) return res.status(400).json({message: "Passwods don't match"});
            
            const hashedPassword = await bcrypt.hash(password, 12)
        
            const result = await User.create({email, password: hashedPassword, name: `${firstName} ${lastName}`});
        
            const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, {expiresIn: "1h"})
        
            res.status(200).json({result: existingUser,token})

        } catch (error) {
            res.status(500).json({ message: 'something went wrong' })
        }
    }
    
}