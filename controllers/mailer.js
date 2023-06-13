const nodemailer = require('nodemailer')

const registerMail = async (req, res)=>{
    
    const {subject, text} = req.body

    let testAccount = await nodemailer.createTestAccount()

    let transporter = nodemailer.createTransport({
        host: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })

    let info = await transporter.sendMail({
        from: testAccount.user,
        to: 'acoading@gmail.com',
        subject,
        text
    })

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.send("Mail send")
}

module.exports = registerMail