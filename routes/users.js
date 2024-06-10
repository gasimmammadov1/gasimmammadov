// bezi hisselerin posts.js faylindan kopyaladiq ve duzelis etdik

const express = require('express') // yonlendirmelerin islemesi ucun expresi daxil etdik
const router = express.Router() // hemcinin expressdeki router class'ni da import etdik
const User = require('../models/User') // User modelini import etdik. ferqli papkadadi deye .. ile cixdiq papkadan

router.get('/register', (req, res) => { 
    // app.js'de app.use('/posts', posts) yazdigimiz ucun burda /posts/new yerine /new yazdiq daha. ve asagidakinda da.
    res.render('site/register')
    // lakin bu zaman css fayllari falan baglanmayacaq. ona gore de partialsda src fayl locationlarinin evvellerine / yazaq
  })


/* router.post('/register', (req, res) => { 
    User.create(req.body, (error, user) => { 
        res.redirect('/') 

    }) 
 
}) dersde bele gosterir amma mongoose yeni surumlerinde daha user.create'de callback isletmir deye asagidakini yazmaliyiq:*/

router.post('/register', (req,res) => {
    User.create(req.body) // user yaradir.
    .then(user => { // user yaradilandan sonra bunlari edir:

        req.session.sessionFlash = { // flash mesajlar ucun session yaradiriq
            type: 'alert alert-danger', // bootstrap alert classlarini yaziriq. posts.js'dekinden ferqli olaraq danger etdik ele bele
            // bunu burda yazmagimiz daha yaxsidir, cunki basqa sehifelerde de istifade ede bilerik ve degisik etsek 1 yerden ederik
            message: `You have successfully registered ${user.username} ! You can now log in to your account.` // dersde ad yazmir amma ozum ele bele yazdm
          } // burani post.js'den kopyaladim ve duzeltdim

        res.redirect('/users/login')
    })
    .catch(error => {
        console.error(error);
    }) 

})


router.get('/login', (req, res) => {
    res.render('site/login')
  })


/* router.post('/login', (req, res) => {
    const {email, password} = req.body //loginde daxil edilen email ve password'u databasede yoxlamaq
    User.findOne({email}, (error, user) => {
        if(user){ // eger bele bir user varsa
            if(user.password == password){
                // USER SESSION 
                req.session.userId = user._id // dersde demir ama ozum ele bele yazdim bu setri
                res.redirect('/') // ve ana sehifeye yonlendiririk
            } else {
                res.redirect('/login') // eger password yanlisdirsa login sehifesine qayidir
            }
        } else { // eger bele bir user yoxdursa
            res.redirect('/register')
        }
    }) mongoose yeni version artiq model.findone ile de callback funksiyasi isletmir deye asagidaki kimi yazacayiq: */


    router.post('/login', (req, res)=>{
        const {email, password} = req.body //loginde daxil edilen email ve password'u databasede yoxlamaq
    
        User.findOne({email}).then((user) => {
    
            //console.log("User: " + user)
            //console.log(user.password)
            //console.log(password)
    
            if(user){ // eger bele bir user varsa
                /* console.log("True...user✅") */
                if(user.password == password){
                    // USER SESSION . login etmis userin tekrar login etmesine ehtiyyac qalmasin deye.
                 req.session.userId = user._id // database'deki userin id'sini sessiona yaziriq.
                 /* req.session.userMail = user.email; */ // emailini de yaziriq sessiona, admin ucun etmisdim alinmadi
                // bunun evvel xeta vermesi normaldi, cunki app.js'de session barede kodlar yaradilmamisdi.
                    /* console.log("  True...pass✅✅" + "\n    Login success✅✅✅") */
                    res.redirect('/') // ve ana sehifeye yonlendiririk
                }else{
                    /* console.log("False...pass❌❌" + "\n    Login false❌❌❌") */
                    res.redirect('/users/login') // eger password yanlisdirsa login sehifesine qayidir
                }
            }else{ // eger bele bir user yoxdursa
                /* console.log("False...user❌" + "\n    Login false❌❌❌") */
                res.redirect('/users/register')
            }
        }).catch((error) => {
            console.error(error); // Hata durumunda konsola yaz
            /* res.redirect('/users/login'); */ // Hata durumunda login sayfasına yönlendir
        });
    })


router.get('/logout', (req, res) => { // logout olarken
    req.session.destroy (() => { // sessionu silir
        res.redirect('/')
    })
    //res.render('site/login')
  })


module.exports = router // export etmeliyik.  // User.create ile req.body'ni database'e yazdiraq