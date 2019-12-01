const nodemailer = require("nodemailer");

const Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testest@gmail.com',
        pass: 'testestestes'
    }
});

exports.SendMail = async (data) => {
    try {
        let Options = {
            from: "testest@gmail.com",
            to: data['to'],
            subject: data['subject'],
            text: data['text']
        }
        let Result = await Transporter.sendMail(Options).catch((error) => {
            throw error;
        })
        console.log(Result);
    } catch (error) {
        throw error;
    }
}