const express = require('express') // yonlendirmelerin islemesi ucun expresi daxil etdik
const router = express.Router() // hemcinin expressdeki router class'ni da import etdik

router.post('/email', (req, res) => {
    const outputHTML = /* bu bizim maile gelecek olan mesajin strukturudur. */
    `<h1>Mail Details :</h1>

    <ul>
        <li>Name - ${req.body.name}</li>
        <li>Email - ${req.body.email}</li>
        <li>Phone - ${req.body.phone}</li>
    </ul>

    <h2>Message :</h2>
    <p>${req.body.message}</p>`

    /* asagidaki kodlari ise https://nodemailer.com/about/ adresinden nodemailer kitabxanasinin documentationundan 
    kopyalayib ozumuze uygun editledik */
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "ytbviewtst@gmail.com", /* test mailim */
    pass: "xmkuuggirnotnenb", /* https://myaccount.google.com/u/1/apppasswords daxil olub yaratdigim kod */
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Node.js Project Contact Form" <ytbviewtst@gmail.com>', // gelen mailin basligi
    to: "ytbviewtst@gmail.com, gasimmammadov1@gmail.com", // hem test mailime hem de oz mailime gelecek
    subject: "Node Project Contact", // Subject line
    text: "Hello", // plain text body
    html: outputHTML, // yuxarida yazdigimiz html body'ni gonderecek
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>


req.session.sessionFlash = { // flash mesajlar ucun session yaradiriq
    type: 'alert alert-success', // bootstrap alert classlarini yaziriq. 
    // bunu burda yazmagimiz daha yaxsidir, cunki basqa sehifelerde de istifade ede bilerik ve degisik etsek 1 yerden ederik
    message: 'Your message has been successfully sent !'
  }
  

  res.redirect('/contact')
}

main().catch(console.error); // xeta mesajini res.send ile burda ekrana vermek istedim amma 2 defe res oldu deye http headers sent erroru olurdu


    

})


module.exports = router