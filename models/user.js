const mongoose = require('mongoose');
const HashPassword = require('password-hash');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        set: (val) => {
            return HashPassword.generate(val)
        }
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: false,
        default: 0
    },
    verification_code: {
        type: String,
        required: false,
        default: () => {
            return Math.floor(1000 + Math.random() * 9000);
        }
    }
});

module.exports = mongoose.model('User', UserSchema);