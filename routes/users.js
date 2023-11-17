const router = require('express').Router();
require('dotenv').config();
const User = require('../models/users');
const nodemailer = require('nodemailer');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

router.post('/', async(req, res) => {
    const OTP = Math.floor(Math.random() * 999);

    if(req.body.password === req.body.confirmpassword){
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET_KEY).toString()
        });
    
        try {
            const result = await newUser.save();

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'naresh99.radiare@gmail.com',
                    pass: 'djlg fysk vota oham',
                },
            });
            
            const mailOptions = {
                from: 'naresh99.radiare@gmail.com',
                to: req.body.email,
                subject: 'Sciflar - Mail Verification',
                text: `Your account has been registered. Your need to verify your email, your OTP ${OTP}`,
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error)
                  console.log(error);
                else
                  console.log('Email sent: ' + info.response);
            });

            res.status(200).json({
                status: true,
                message: 'Registration Completed!',
                otp: OTP,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error,
                data: null
            })
        }

    }else{
        res.status(500).json({
            status: false,
            message: 'Password Mismatched!',
            data: null
        });
    }

});

router.post('/login', async (req, res) => {
    try {
        const myData = await User.findOne({ email: req.body.email });

        if (!myData) {
            return res.status(401).json({
                status: false,
                message: 'User does not exist!',
                data: null
            });
        }

        if (!myData.isVerified) {

            const OTP = Math.floor(Math.random() * 999);

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'naresh99.radiare@gmail.com',
                    pass: 'djlg fysk vota oham',
                },
            });
            
            const mailOptions = {
                from: 'naresh99.radiare@gmail.com',
                to: req.body.email,
                subject: 'Sciflar - Mail Verification',
                text: `Your account has been registered. Your need to verify your email, your OTP ${OTP}`,
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error)
                  console.log(error);
                else
                  console.log('Email sent: ' + info.response);
            });

            return res.status(400).json({
                status: false,
                message: 'Your account was not verified!',
                OTP
            });
        }

        if (!myData.status) {
            return res.status(402).json({
                status: false,
                message: 'Your account was not activated!'
            });
        }

        const hashedPassword = CryptoJS.AES.decrypt(myData.password, process.env.PASSWORD_SECRET_KEY);
        const myPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        
        if (myPassword !== req.body.password) {
            return res.status(401).json({
                status: false,
                message: 'Invalid Password',
                data: null
            });
        }

        const accessToken = jwt.sign({
            id: myData._id,
            isAdmin: myData.isAdmin
        }, 
            process.env.JWT_SECRET_KEY,
            {expiresIn: "3d"}
        );

        const {password, ...data} = myData._doc;

        return res.status(200).json({
            status: true,
            message: 'Login Successfully!',
            accessToken,
            data
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error',
            data: null
        });
    }
});


module.exports = router