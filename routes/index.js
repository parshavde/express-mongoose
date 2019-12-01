var express = require('express');
var router = express.Router();

var UserController = require('../controllers/UserController');
var TaskController = require('../controllers/TaskController');

var UserMiddleware = require('../controllers/middleware/UserMiddleware');

// --- user routes
router.post('/user/login', UserController.LoginUser);
router.post('/user/verify', UserController.VerifyUser);
router.post('/user/register', UserMiddleware.UserValidation, UserMiddleware.SystemUserCheck, UserController.RegisterUser);
router.patch('/user/role/update/:id', UserMiddleware.RoleUpdateValidation, UserMiddleware.Authnticate, UserMiddleware.RoutePermission, UserController.UpdateUser);

// --- task routes
router.post('/task/create', UserMiddleware.Authnticate, UserMiddleware.RoutePermission, TaskController.CreateTask);
router.patch('/task/update/:id', UserMiddleware.Authnticate, UserMiddleware.RoutePermission, TaskController.UpdateTask);
router.delete('/task/delete/:id', UserMiddleware.Authnticate, UserMiddleware.RoutePermission, TaskController.DeleteTask);

module.exports = router;