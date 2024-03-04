const nodemailer = require('nodemailer')
const config = require('config.json')

module.exports = notifyUser

async function notifyUser(msg, email) {
    const { host, port, secure, user, pass } = config

    let transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: secure,
            auth: {
            user: user,
            pass: pass
            }
    })

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Kamil Patel Scholarship" <director@kamilpatelscholarship.org>', // sender address
        to: email , // list of receivers
        subject: 'Activity Notification', // Subject line
        text: msg, // plain text body
        html: '<h4> ' + msg + '</h4>' // html body
    })
}