var joi = require('@hapi/joi');
var ResponseManager = require('../../utils/ResponseManager');
var UserModel = require('../../models/user');
var StaticValues = require('../../utils/StaticValues');
var jwt = require('jsonwebtoken');

/**
 * @name : Authnticate
 * @description : Authnticate user
 * @author : Parshav Shah 
 **/
exports.Authnticate = async (req, res, next) => {
    try {
        let CurruntTime = +new Date();
        jwt.verify(req.headers.authorization, 'parshav', (error, Decoded) => {
            if (error) {
                throw error;
            }
            if (Decoded.exp <= CurruntTime) {
                req.user = Decoded['data'];
                next();
            } else {
                throw new Error("Something went wrong, Please login again.");
            }
        });
    } catch (error) {
        res['message'] = error.message;
        res['data'] = error;
        res['code'] = 401;
        ResponseManager.SendResponse(res);
    }
}

/**
 * @name : UserValidation
 * @description : to validation the req. body of user registration body 
 * @author : Parshav Shah
 */
exports.UserValidation = async (req, res, next) => {
    try {

        const UserBody = joi.object({
            first_name: joi.string().required(),
            last_name: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().required(),
            mobile: joi.string().required(),
        })

        let Result = await UserBody.validateAsync(req.body).catch((error) => {
            res['data'] = error;
            res['message'] = "Validation Error";
            res['code'] = 500;
            throw error;
        })

        if (Result) {
            next();
        }

    } catch (error) {
        ResponseManager.SendResponse(res);
    }
}

/**
 * @name : RoleUpdateValidation
 * @description : to validation the req. body of user registration body 
 * @author : Parshav Shah
 */
exports.RoleUpdateValidation = async (req, res, next) => {
    try {

        const UserBody = joi.object({
            role: joi.string().required(),
        })

        let Result = await UserBody.validateAsync(req.body).catch((error) => {
            res['data'] = error;
            res['message'] = "Validation Error";
            res['code'] = 500;
            throw error;
        })

        if (Result) {
            next();
        }

    } catch (error) {
        ResponseManager.SendResponse(res);
    }
}

/**
 * @name : SystemUserCheck
 * @description : function will check that is system have user or not 
 * @author : Parshav Shah
 */
exports.SystemUserCheck = async (req, res, next) => {
    try {
        let CountUser = await UserModel.count({}).catch((error) => {
            throw error;
        });
        if (CountUser === 0) {
            req.body['role'] = StaticValues.UserRoles.admin;
        } else {
            req.body['role'] = StaticValues.UserRoles.user;
        }
        next();
    } catch (error) {
        res['data'] = error;
        ResponseManager.SendResponse(res);
    };
}

/**
 * @name : RoutePermission 
 * @author : Parshav Shah
 */
exports.RoutePermission = async (req, res, next) => {
    try {

        let CanGo = false;
        let Permission = {};
        Permission[StaticValues.UserRoles.admin] = ["*"];
        Permission[StaticValues.UserRoles.manager] = ["/task/update", "/task/delete"];
        Permission[StaticValues.UserRoles.user] = ["/task/create"];

        switch (req.user.role) {
            case StaticValues.UserRoles.admin:
                CanGo = true;
                break;

            case StaticValues.UserRoles.manager:
                Permission[StaticValues.UserRoles.manager].forEach(permissions => {
                    if (req.path.includes(permissions)) {
                        CanGo = true;
                    }
                });
                break;

            case StaticValues.UserRoles.user:
                Permission[StaticValues.UserRoles.user].forEach(permissions => {
                    if (req.path.includes(permissions)) {
                        CanGo = true;
                    }
                });
                break;
        }

        if (CanGo) {
            next();
        } else {
            throw new Error("You are not authorized for accessing this URL");
        }

    } catch (error) {
        res.message = error.message;
        res.code = 401;
        res.data = error;
        ResponseManager.SendResponse(res);
    }
}