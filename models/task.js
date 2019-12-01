const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    deleted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        // 0 = unapproved task, 1 = approved task, 2 = deleted task
        type: Number,
        required: false,
        default: 0
    },
});

module.exports = mongoose.model('Task', TaskSchema);