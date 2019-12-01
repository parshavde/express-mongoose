var ResponseManager = require('../utils/ResponseManager');
var _ = require('lodash');
var UserModel = require('../models/user');
var MailManager = require('../utils/MailManager');
var HashPassword = require('password-hash');
var jwt = require('jsonwebtoken');
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * @name : LoginUser
 * @description : to login the user 
 * @author : Parshav Shah
 */
exports.LoginUser = async (req, res) => {
    try {

        let Body = req.body;

        // find the user
        let User = await UserModel.findOne({
            $or: [{
                email: Body.username
            }, {
                mobile: Body.username
            }]
        }).exec().then((Data) => {
            return JSON.parse(JSON.stringify(Data))
        }).catch((error) => {
            throw error;
        })

        // check user is exist or not
        if (!User) {
            throw new Error("User not found");
        }

        // check password is right or not ?
        if (HashPassword.verify(Body.password, User['password'])) {

            // check user is verified or not 
            if (User['status'] == 0) {
                throw new Error("Your account is not verified yet");
            }

            User = _.omit(User, ['password', '__v', 'verification_code', 'status']);
            User['name'] = User['first_name'] + ' ' + User['last_name'];

            // generate JWT token for authorization
            User['token'] = jwt.sign({
                data: User
            }, 'parshav', {
                expiresIn: '10h'
            });

            res['data'] = User;
            res['message'] = "Login success";
            ResponseManager.SendResponse(res);

        } else {
            throw new Error("Password is incorrect");
        }

    } catch (error) {
        res.message = error.message;
        res.code = 500;
        res.data = error;
        ResponseManager.SendResponse(res);
    }
}

/**
 * @name : RegisterUser
 * @description : to register the user 
 * @author : Parshav Shah
 */
exports.RegisterUser = async (req, res) => {
    try {

        let Body = req.body;

        // check that user already exist ?
        let UserCount = await UserModel.count({
            email: Body['email']
        }).catch((error) => {
            throw error;
        });

        if (UserCount > 0) {
            throw new Error("User already exist");
        }

        // create user process
        let User = await UserModel.create(Body).then((Data) => {
            Data = JSON.parse(JSON.stringify(Data))
            Data = _.omit(Data, ['password', 'role', '__v', '_id', 'status']);
            return Data;
        }).catch((error) => {
            throw error;
        });

        if (User) {

            // user created - send the success mail
            await MailManager.SendMail({
                to: Body.email,
                subject: `Welcome ${User['first_name'] + User['last_name']} to our TestWebsite.com`,
                text: `Your OTP is ${User['verification_code']}, Please verify.`
            }).catch((error) => {
                throw error;
            });

            res['data'] = User;
            res['message'] = "User created";

        } else {
            res['message'] = "Something went wrong, Please try again";
        }

        // Send the response
        ResponseManager.SendResponse(res);

    } catch (error) {
        res['message'] = error.message;
        res['data'] = error;
        res['code'] = 500;
        ResponseManager.SendResponse(res);
    }
}

/**
 * @name : VerifyUser
 * @description : to verify the user from the app 
 * @author : Parshav Shah
 */
exports.VerifyUser = async (req, res) => {
    try {

        let Code = req.body.code;
        let Email = req.body.email;

        let User = await UserModel.findOne({
            email: Email
        }, {
            _id: 0,
            password: 0,
            __v: 0
        }).catch((error) => {
            throw error;
        })

        if (User) {

            // check account is already verified or not
            if (User['status'] == 1) {
                throw new Error("Your account is already verified");
            }

            if (User['verification_code'] == Code) {

                // Update the account status
                await UserModel.update({
                    email: Email
                }, {
                    status: 1,
                    verification_code: null
                }).catch((error) => {
                    throw error;
                })

                res['data'] = User;
                res['message'] = "Your account is verified";
                ResponseManager.SendResponse(res);

            } else {
                throw new Error("Code is incorrect, Please check")
            }
        } else {
            throw new Error("User not found")
        }

    } catch (error) {
        res['message'] = error.message;
        res['data'] = error;
        res['code'] = 500;
        ResponseManager.SendResponse(res);
    }
}

/**
 * @name : UpdateUser
 * @description : to update the task
 * @author : Parshav Shah
 */
exports.UpdateUser = async (req, res) => {
    try {

        let Body = req.body;
        let Id = req.params.id;

        let User = await UserModel.updateOne({
            _id: ObjectId(Id),
        }, Body).catch((error) => {
            throw error;
        });

        res['data'] = User;
        res['message'] = "User update : Success";

        ResponseManager.SendResponse(res);

    } catch (error) {
        res.message = error.message;
        res.code = 500;
        res.data = error;
        ResponseManager.SendResponse(res);
    }
}