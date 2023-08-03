const nodemailer = require('nodemailer');


const registerMail = async (subject, text, email)=>{

    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASS
            }
        })
    
        let info = await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject,
            text
        })
    
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
        console.log("Mail sended")
    } catch (err) {
        console.log(err.message)
    }

}
// xqUeyMmHhJtNGajUbOXKNyfgr0B8CpwxVIAY9_0w
module.exports = registerMail


