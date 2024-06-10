// app.js faylinda kodlar cox oldugu ucun routerleri kesib bura yapisdiririq.


const express = require('express') // yonlendirmelerin islemesi ucun expresi daxil etdik
const router = express.Router() // hemcinin expressdeki router class'ni da import etdik
const Post = require('../models/Post') // Post modelini import etdik. ferqli papkadadi deye .. ile cixdiq papkadan 
const Category = require('../models/Category') // kateqoriyalarin blogda da gorunmesi ucun database modellerin daxil edirik bura
const User = require('../models/User')

// ve artiq app deyisenini yox router deyisenini istifade edecek asagidaki setrler. ona gore app.get yox router.get olacaq.

router.get('/', (req, res) => {
  /* console.log(req.session); */ // bu setrle bize sessionun icinde ne oldugunu gosterir biz sayti refresh etdikde
/*  meselen asagidaki kimi:
 Session {
    cookie: { path: '/', _expires: null, originalMaxAge: null, httpOnly: true }

    // ve login etdikde ise userId'ni de gosterir:
    userId: '66258f3483d65e546293a149'
  } 
*/

    // res.sendFile(path.resolve(__dirname, 'site/index.html')) // artiq bunu yox, asagidakin isledeceyik:
    res.render('site/index'); // saytda home yazilmisdi ama biz faylimizi gostereceyik.
    // gorduk ki bura site2/index yazsaq da, default olaraq exphbs() saytda gosterildiyi kimi bu yoldaki fayli goturur:
    // views -> layouts -> main.handlebars
    // hemcinin '/' yerine sonra '/about' falan yazib res.render ile about faylin falan yazsaq da yene de o main faylin alir.
    // eger main.handlebars faylinin adin deyissek ise, onda fayli tapmayib error verecek.
  
    // bir de ki res.render('site/index'); yerine res.render('views/site/index'); yazsaydiq da error vererdi.
  })
  
router.get('/about', (req, res) => {
  res.render('site/about')
})

/*router.get('/admin', (req, res) => {
  res.render('admin/index')
})  
yoruma aldiq cunki admine aid herseyi oz faylinda etmek isteyirik. */

router.get('/blog', (req, res) => {
  // promise quraq indi:
  Post.find({}).populate([{path:'author', model: User}, {path:'category', model: Category}]) // User modeline gedib ordan data cekecek author adiyla
  // ve blog.handlebarsda John Doe yerine author'un username'ini vereceyik.
  .sort({$natural:-1}).lean().then(posts => { // .find({}) yazaraq database'e gedib herseyi ordan goturmesini istedik
    // Post.find({}).then(posts => { dersde bele idi ama datalari cekib gostermedi, .lean() elave etdim duzeldi.
    
   /*   blogda her kateqoriyanin post sayini gostermek ucun evvelki derslerden ferqli olaraq .find({}) yerine 
   .aggregate([{}]) yaziriq ve icine bu proses ucun lazim olan kodlari yaziriq */
    
   Category.aggregate([{
    $lookup: { // mongodb deyisenidir bu.
      from: 'posts', /* posts isimli database collectionundan */
      localField: '_id', /* lokalda (yeni ki categories adli database'de) olan id'e beraber olan */
      foreignField: 'category', /* posts database'deki category isimli field'i tapsin */
      as: 'posts' // ve bunlari posts olaraq elinde saxlasin
    }
  },

    {
      $project : { // bu da mongodb deyisenidir.
        _id: 1, // id almaq isteyirikse 1, istemirikse 0 yaziriq.
        name: 1,
        num_of_posts: { $size: '$posts' } // num_of_posts da postlarin sayina beraber olacaq
      }

    }

]) // ve bunu posts.js router'ine de category find yerine yaziriq ki tek post sehifesinde de bele olsun.
    
    /* .sort({$natural:-1}).lean() evvelki dersde isleyirdi amma indi lean da islemedi, sortda da xeta oldu.
    amma bunlari silende isledi. sadece olaraq siralama duz olmadi.
    ⚠️siralama ucun metod tap! */
    
    .then(categories => { // evvelki dersde bu setir yox idi, kateqoriya ucun yazdiq ki onu da ceksin ve gondersin
      res.render('site/blog', { posts: posts, categories: categories })
    })
     // ve goturdukleri arasindan postlari posts olaraq 'site/blog'a gonderdik
 
  })
// res.render('site/blog') day yuxarda yazdiq deye buna gerek qalmadi 

})

  


router.get('/blog-single', (req, res) => { // ders videosunda bunu etmedi ama maraga ozum edirem
  res.render('site/blog-single') 
})

/* router.get('/blog-single', (req, res) => { // ders videosunda bunu etmedi ama maraga ozum edirem
  Category.find({}).then(categories => {
  res.render('site/blog-single', { categories: categories }) 
})
}) */

router.get('/contact', (req, res) => {
  res.render('site/contact')
})


// login ile bagli routerleri burdan silib users.js faylina kecirdik. 


// register ile bagli routerleri de burdan silib users.js faylina kecirdik. 



// post ile bagli routerleri burdan silib posts.js faylina kecirdik.

module.exports = router // export etmeliyik.  