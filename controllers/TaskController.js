var ResponseManager = require('../utils/ResponseManager');
var _ = require('lodash');
var TaskModel = require('../models/task');
var ObjectId = require('mongoose').Types.ObjectId;

/**
 * @name : CreateTask
 * @description : to create the task 
 * @author : Parshav Shah
 */
exports.CreateTask = async (req, res) => {
    try {

        let Body = req.body;

        Body['created_by'] = ObjectId(req.user._id);
        Body['status'] = 1;

        let Task = await TaskModel.create(Body).catch((error) => {
            throw error;
        });

        res['data'] = Task;
        res['message'] = "Task create : Success";

        ResponseManager.SendResponse(res);

    } catch (error) {
        res.message = error.message;
        res.code = 500;
        res.data = error;
        ResponseManager.SendResponse(res);
    }
}

/**
 * @name : UpdateTask
 * @description : to update the task
 * @author : Parshav Shah
 */ 
exports.UpdateTask = async (req, res) => {
    try {

        let Body = req.body;
        let Id = req.params.id;

        Body['updated_by'] = ObjectId(req.user._id);

        let Task = await TaskModel.updateOne({
            _id: ObjectId(Id),
        }, Body).catch((error) => {
            throw error;
        });

        res['data'] = Task;
        res['message'] = "Task update : Success";

        ResponseManager.SendResponse(res);


    } catch (error) {
        res.message = error.message;
        res.code = 500;
        res.data = error;
        ResponseManager.SendResponse(res);
    }
}

/**
 * @name : DeleteTask
 * @description : to delete the task 
 * @author : Parshav Shah
 */ 
exports.DeleteTask = async (req, res) => {
    try {

        let Id = req.params.id;

        let Body = {};
        Body['deleted_by'] = ObjectId(req.user._id);
        Body['status'] = 3;

        let Task = await TaskModel.updateOne({
            _id: ObjectId(Id),
        }, Body).catch((error) => {
            throw error;
        });

        res['data'] = Task;
        res['message'] = "Task soft deleted : Success";

        ResponseManager.SendResponse(res);


    } catch (error) {
        res.message = error.message;
        res.code = 500;
        res.data = error;
        ResponseManager.SendResponse(res);
    }
}