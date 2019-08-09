const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer')

const app = express()

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/index', (req, res) => res.render('index'))
app.get('/contact', (req, res) => res.render('contact'))

app.use(express.static(path.join(__dirname, 'public')))

app.post('/send', (req, res) => {
    const output = `
    <p>You have received a new Message from my contact form.</p>
    <h3>Contact form is working T_T</h3>
    <ul>
        <li>Message: ${req.body.message}</li>
    </ul>
    `

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false,
        service: 'gmail',
        auth: {
            user: '', // generated ethereal user
            pass: '' // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info =  {
        from: 'Alvi account <email@host.com>', // sender address
        to: "", // list of receivers
        subject: "Its alive!!!!", // Subject line
        // text: "Hello world?", // plain text body
        html: output // html body
    }

    transporter.sendMail(info, (error, info) => {
        if(error){
            return console.log(error)
        }
        console.log('Message sent %s', info.messageId)
        res.render('contact', {msg: "message sent"})

    })
    // console.log("Message sent: %s", info.messageId);
    // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    //
    // // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));


})



const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))