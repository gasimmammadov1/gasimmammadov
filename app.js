const path = require("path");

const express = require("express");
const exphbs = require("express-handlebars");
/* express resmi saytda ise yuxaridaki 2 setr hal-hazirda bele yazilir:
 
import express from 'express';
import { engine } from 'express-handlebars';

cunki 4 il evvel cekilib ders videosu, indi ise 26.02.2024 tarixindeyik.
ders videosunda "express-handlebars": "^3.1.0" isledilir, ama indi saytda "express-handlebars": "^7.1.2" bu surumudu.
bize lazim olan surumu yuklemek ucun terminalda bu kodu yazmaliyiq:

npm install express-handlebars@3.1.0

*/

// Using Node.js `require()`
const mongoose = require("mongoose");

/* // Using ES6 imports
import mongoose from 'mongoose'; */

const bodyParser = require("body-parser"); // saytdan gonderilen postlari serverde qebul etmek ucun lazim olan modul

const fileUpload = require("express-fileupload"); // bu modul sayta yuklenen fayl ucun lazimdir

const generateDate = require("./helpers/generateDate").generateDate; // generateDate.js faylini import etdik

const limit = require("./helpers/limit").limit;
// helpers qovlugundaki limit faylinda yerlesen limit funksiyasini buraya limit adli sabit deyisenle menimsetdik, yeni ki import etdik

const truncate = require("./helpers/truncate").truncate;

const expressSession = require("express-session"); // session yaradmaq ucun lazim olan modul

const connectMongo = require("connect-mongo"); // server stop olunanda sessionlar itmesin, databasede qalsin deye lazim olan modul
// avtomatik database'de sessions collection yaradir ve session'lari onlari orda saxlayir

const methodOverride = require("method-override"); /* delete proseduru ucun method-override kitabxanasi isledirik */

// const moment = require('moment'); // tarixleri istediyimiz formada gostermek ucun. generateDate.js'e kecirdik deye burdakin yorum etdim

mongoose.connect(
  "mongodb+srv://gasimmammadov1:qasim2000@cluster0.j1v10ox.mongodb.net/nodeblog_db?retryWrites=true&w=majority",
  {
    /*dersde 'mongodb://localhost/my_database' idi. sora deyisib oz localina uygunlasdirdi ama men onun kimi localda
mongodb compass ile yox atlas istifade edirem deye bele yazdim. */
    // eger yuxarida linkde /nodeblog_db yazdigim adda database movcud olmasaydi, mongoose ozu yaradacaqdi.
    /*   useNewUrlParser: true, // etrafli melumat mongoose resmi saytinda var, istesen bax.
  useUnifiedTopology: true burani niye yorum etdiyimi test.js faylinda yazdim. */
  }
); /* npm resmi saytinda bele deyil hal-hazirda. 4 il evvel bele idi. indi ise asagidaki kimidir:

import { createRequire } from 'https://deno.land/std@0.177.0/node/module.ts';
const require = createRequire(import.meta.url);

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Connected!')); 
*/

const app = express();
const port = 3000;
// const hostname = "127.0.0.1"; istesek ele bele yaza bilerik

const mongoStore = connectMongo(expressSession);
// burda yuxaridaki connectMongo'nu yazib ona asagidaki expressSession'u vererdik ve onun da altindaki mongoStore'a menimsetdik

app.use(
  expressSession({
    // session yaradmaq ucun lazim olan middleware.
    // browserde f12 basib application sekmesine girib cookies bolmesinde sessionu gormek olar (sagda connect.sid)
    secret: "testotesto", // bu soz her hansisa bir soz olabiler, sessionu qorumaq ucun lazimdir
    resave: false, // sessionu yeniden yaratmaq ucun lazim olan parametr
    saveUninitialized: true, // sessionu yaratmaq ucun lazim olan parametr

    store: new mongoStore({ mongooseConnection: mongoose.connection }), // store etsin yeni ki depolasin database'e
    /*  dersde bele yazir. amma resmi saytda beledi: 
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost/test-app' }) 
  ona gore error verir. bunu onlemek ucun connect-mongo kitabxanasin silib dersde istifade edilen 3-cu versiyasin yuklemeliyik*/

    /* cookie: { maxAge: 60000 } // bunu github copilot yazdi, aydinlasdiracam */
  })
);

app.use(fileUpload()); // sayta fayl yuklemek ucun lazim olan middleware ve bunu yazdigimiz sira onemlidir, requestlerden once olmalidir.
// posts.js'de fileUpload ozelliyi islesin deye app.use ile yazdigim bu middlewareleri asagidaki routes setrlerinden evvel yazmaliyiq
app.use(express.static("public"));
app.use(methodOverride("_method"));

/* const hbs = exphbs.create({ // express handlebars helpers istifadesi ucun kodlar. dersde kohne versiyadi, resmi saytda ise yeni
  // bunu etmek ucun 2 usul var, biri bucur app.js'deki kodlara yazmaq, digeri ise ayri faylda yazib onu import etmek. 
  helpers: {
    generateDate : (date, format) => {
      return moment(date).format(format)
    }
  } 
generateDate.js'e kecirdik deye burdakin yorum etdim
}) */

// Handlebars helpers

/* evvelki derslerden ferqli olaraq asagidaki kodlari isledirik: */
const hbs = exphbs.create({
  // helpers'i bu cur toplu isletmek ucun handlebars documentation'unda etrafli melumat var
  helpers: {
    generateDate: generateDate,
    limit: limit, // limit.js'deki limit funksiyasini daxil etdim
    truncate: truncate, // truncate.js'deki truncate funksiyasini da daxil etdim
  },
});

// app.engine('handlebars', engine());
app.engine("handlebars", hbs.engine); // evvel hbs.engine yerine asagidaki kimi yazirdiq:
/* app.engine("handlebars", exphbs({ helpers: { generateDate: generateDate } })); evvelki derslerde bele yazirdiq */
// helpers ucun elave fayl yaratmasaydim exphbs() yerine hbs.engine yazardim burda.
// resmi saytda teze kodlarda artiq exphbs yerine yuxardaki kimi engine yazilirdi
//  app.engine('handlebars', exphbs.engine()) videonun komentinde gordum,
//  kohne versiya yuklemek yerine bele yazsam duzelecekmis ama eybi yox.
app.set("view engine", "handlebars");
// app.set('views', './views'); // hemcinin resmi saytda gosterilir artiq ki bu setr de yazilir.

// asagidaki bodyparser ile bagli middleware'leri ele birbasa npm saytindan examples'den kopyaladiq
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/* const myMiddleware = (req, res, next) => { // middleware anlayisini tam qavramaq ucun kicik numune
  console.log( 'BENIM ADIM ARIN') // emr verdik
  next() // eger bu setri yazmasaq onda emr icra edildikden sonraki prosesler islemeyecek
 }
 app.use('/', myMiddleware) // ana sehifede bu kod isleyecek amma diger sehifelerde de / isaresi var deye onlarda da isleyecek */

// DISPLAY Link Middleware
/* login etdiyimiz zaman navigationsdaki butonlar arasinda daha login ve ya register hisselerin gormeyimize ehtiyyac yoxdur
buna gore de bu middleware'i yaradib isledeceyik. 
ve dersdeki kimi bu middleware'i routing setirlerinden evvele yerlesdirdikde kodlar chokmusdu, cunki
next() yazmagi unutmusduq */

app.use((req, res, next) => {
  const { userId } = req.session; // userId deyiskenini req.session'dan goturduk

  if (userId) {
    // eger sessionda userId varsa (yeni ki login edilibse)
    res.locals = {
      // displayLink true deyerin alacaq
      displayLink: true,
    };
  } else {
    // eger yoxdusa
    res.locals = {
      // false deyerin alacaq
      displayLink: false,
    };
  }

  // (bu alacagi deyerler site-nav.handlebars faylinda rol oynayacaq)

  next(); // diger proseslere davam etsin
});

// Admin Display Middleware
app.use((req, res, next) => {
  const { userMail } = req.session;

  if (userMail === "admin@gmail.com") {
    res.locals.displayAdmin = true;
  } else {
    res.locals.displayAdmin = false;
  }
  next();
});

const isAdmin = (req, res, next) => {
  if (req.session.userMail === "admin@gmail.com") {
    next();
  } else {
    res.status(403).redirect("errors/403");
    /* res.status(403).render('site/errors/403', { message: 'YOU DO NOT HAVE PERMISSIONS TO ACCESS THIS PAGE.' }); */
  }
};

// Flash - Message Middleware /* BUNUN ISLEMEME SEBEBI ASAGIDA DISPLAYLINK KODLARINDA DA RES.LOCALS ISTIFADESSIDIR. */
/* ona gore de yerin deyisib ondan asagiya qoydum */
app.use((req, res, next) => {
  // express flash kimi modul da ishlede bilerdik amma helelik ozumuz kodu yaziriq
  res.locals.sessionFlash = req.session.sessionFlash; // requestde mesaj varsa responda gondersin
  delete req.session.sessionFlash; // hemen mesaj ekranda cox qalmasin deye daha sonra silsin sehifeni refresh edende.
  /* res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message') */
  next(); // diger proseslere davam etsin
});

app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

const main = require("./routes/main"); // burdan kesdiyimiz routerleri yigdigimiz main faylin import edirik.
const posts = require("./routes/posts");
const users = require("./routes/users");
const admin = require("./routes/admin/index");
const contact = require("./routes/contact");
const errors = require("./routes/errors");

app.use("/", main); // middleware teyin etdik, sayta girende maine gedecek
app.use("/posts", isAdmin, posts);
app.use("/users", users);
app.use("/admin", isAdmin, admin);
/* app.use('/admin/admin idi bundan onceki dersde', admin) */
app.use("/contact", contact);
app.use("/errors", errors);

/* app.listen(port,hostname, () => {
  console.log(`Server calisiyor, http://${hostname}:${port}/` istesek ele bele yazariq bele)
}) */

app.listen(port, () => {
  const now = new Date();
  const options = {
    timeZone: "Asia/Baku", // Azerbaycan saati ucun
    hour12: false, // 24 saat formatında gostersin
  };
  const formattedTime = now.toLocaleTimeString("en-US", options);
  console.log(
    `Server ishleyir✅, PORT:${port}, ➡️  http://127.0.0.1:3000/ ⬅️ , 🕘 ${formattedTime}`
  ); // saati ele bele elave etdim
});

/* app.listen(port, () => {
  const now = new Date();
  const options = {
    timeZone: "Asia/Baku", // Azerbaycan saati için
    hour12: false, // 24 saat formatında
  };
  const formattedTime = now.toLocaleTimeString("en-US", options);

  const networkInterfaces = require('os').networkInterfaces();
  let ipAddress = '127.0.0.1'; // Default IP Address for local machine
  
  for (let interfaceName in networkInterfaces) {
    for (let interfaceInfo of networkInterfaces[interfaceName]) {
      if (!interfaceInfo.internal && interfaceInfo.family === 'IPv4') {
        ipAddress = interfaceInfo.address; // Set the non-internal IPv4 address
        break;
      }
    }
  }

  console.log(
    `Server is running✅, IP: ${ipAddress}, PORT: ${port}, ➡️  http://${ipAddress}:${port}/ ⬅️ , 🕘 ${formattedTime}`
  );
}); */ // 192.168 tipli ip adres ucun

const axios = require("axios");

const getExternalIp = async () => {
  try {
    const response = await axios.get("https://api.ipify.org?format=json");
    console.log("External IP:", response.data.ip);
  } catch (error) {
    console.error("Failed to fetch external IP:", error.message);
  }
};

getExternalIp();
