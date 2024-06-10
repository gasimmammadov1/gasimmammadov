// main.js faylinda kodlar cox oldugu ucun post ile bagli routerleri kesib bura yapisdiririq.


const express = require('express') // yonlendirmelerin islemesi ucun expresi daxil etdik
const router = express.Router() // hemcinin expressdeki router class'ni da import etdik
const Post = require('../models/Post') // Post modelini import etdik. ferqli papkadadi deye .. ile cixdiq papkadan 
const path = require('path') // fayl yuklemek ucun path modulunu import etdik
const Category = require('../models/Category')
const User = require('../models/User')

// ve artiq app deyisenini yox router deyisenini istifade edecek asagidaki setrler. ona gore app.get yox router.get olacaq.


  

/* router.get('/new', (req, res) => { 
    // app.js'de app.use('/posts', posts) yazdigimiz ucun burda /posts/new yerine /new yazdiq daha. ve asagidakinda da.
    if(req.session.userId){ // eger sessionda userId varsa yeni login olunubsa, 
    res.render('site/addpost') // o zaman addpost sehifesine gedecek
    }else{ // dersde burda else yazmir amma men yazmasam error olur ona gore yazdim ve hell etdim.
    
    // eger sessionda userId yoxdursa,
    res.redirect('/users/login') }// o zaman login sehifesine yonlendirir.

    // lakin bu zaman css fayllari falan baglanmayacaqdi. ona gore de partialsda src fayl locationlarinin evvellerine / yazdiq
  }) */

/* evvel yuxaridaki kimi idi lakin bu defe deyisdik cunki kodu ele yazmaliyiq ki 
  eyni anda 2 isi edib sinxron xetasi almasin. indi birinci kateqoriyalari alib sonra render edecek. */
  router.get('/new', (req, res) => { 
    if(!req.session.userId){ // eger login edilmeyibse logine yonlenir
    res.redirect('/users/login')
    }else{ // eger edilibse
      Category.find({}).sort({$natural:-1}).lean().then(categories =>{ // kateqoriyalari cekir
        res.render('site/addpost', {categories: categories}) // site addpost acir ve kateqoriyalari categories kimi gonderir
      })
        
     }

  })



/* search prosesi ucun dersde asagidaki linkde olan kodu kopyaladiq stackoverflowdan:
https://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb

ve o kodu ozumuze uygunlasdirmadan once asagidaki kimi idi:

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", function(req, res) {
    if (req.query.search) {
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       Jobs.find({ "name": regex }, function(err, foundjobs) {
           if(err) {
               console.log(err);
           } else {
              res.render("jobs/index", { jobs: foundjobs });
           }
       }); 
    }
}
*/

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


router.get("/search", (req, res) => {
    if (req.query.look) { // look site sidebarda search hissesinde inputa daxil edilen deyer.
       const regex = new RegExp(escapeRegex(req.query.look), 'gi');/* burada look'u regex etdik.
       regex regular expression, teztez islenen ifadeler */
       /* gi paramatrindeki g global axtaris (yeni ki herterefli), i ise boyuk yaxud kicik herfle yazmagin ferqi olmamasi. */
       Post.find({ "title": regex })
       .populate([{path:'author', model: User}, {path:'category', model: Category}])
       .sort({$natural:-1}).lean().then(posts => {

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
    
    ])
      .then(categories =>{
        res.render('site/blog', {posts: posts, categories: categories} )
      })
       }); 
    }
})


/* asagidaki router bize kateqoriyalarin adina tiklayarken hemen kateqoriyada olan postlari gormek ucun lazimdir. */
  router.get('/category/:categoryId', (req, res)=>{
    Post.find({category: req.params.categoryId}).populate([{path:'author', model: User}, {path:'category', model: Category}])
    .sort({$natural:-1}).lean().then(posts => {
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
    
    ])
      .then(categories =>{
        res.render('site/blog', {posts: posts, categories: categories} )
      })

    })
  })


  router.get('/:id', (req, res) => { 
    // main.js'deki kimi burda da promise edirik:
    // evvel asagidaki setrde , {path:'category', model: Category}] hissesin yazmamisdim deye tek postda kateqoriya gorunmurdu...
    Post.findById(req.params.id).populate([{path:'author', model: User}, {path:'category', model: Category}]).lean().then(post => { // .findById ile req.params.id'ni tap dedik burda
      // main.js'deki kimi burda da datalari cekib gostermedi, .lean() elave etdik duzeldi.
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
    
    ])
      .then(categories => {

        Post.find({}).populate([{path:'author', model: User}, {path:'category', model: Category}]) 
        .sort({$natural:-1}).lean().then(posts => {
        // bu hisseni main.js'den kopyalayib daxil etdik ki sadece tek postu yox, butun postS'lari gondersin
        // ve belece sidebarda lastest postlar gorunmemesi xetasini hell etdik      

        res.render('site/post', { post: post, categories: categories, posts: posts }) // ve goturduklerini gonderdik
        })

    })
    }) 
    // yoxlamaq ucun databaseden bir id yazib test ede bilerik. meselen http://127.0.0.1:3000/posts/6620e63bdac12c83eb97786a
    // ve tek blog sehifesine gedecek belelikle.
    /* console.log(req.params); */ // id normalda database'den alinmalidi amma test ucun terminala cap edirik helelik
    // misalcun indi searchbar'da http://127.0.0.1:3000/posts/12345 yazsaq { id: '12345' } gorsenecek terminalda.
    // res.render('site/addpost') yuxarida yazdiq deye buna gerek qalmadi
  })



router.post('/test', (req, res) => { // bu sefer post ucun olacaq deye post yazdiq ve test ucun /posts/test yazdiq
  // res.send('TEST OK')  render yerine send etsin, helelik "test ok" deye bir yazi yazdirmasini isteyek
   /* console.log(req.body) */ // post edilen melumatlarin console-da gorsenmesi ucun yazdirdiq ele bele amma bunu edende nodemon islemir restart etmir, middleware xetasi yaranir deye yorum etdim
   
  let post_image = req.files.post_image // upload edilen fayli deyisene menimsetdik (fileUpload ozelliyi)

  post_image.mv(path.resolve(__dirname, '../public/img/postimages', post_image.name )) 
  // .mv ile move edirik fayli. path.resolve ile de faylin path'ini tapirig
  // parametr olaraq harda saxlayacagini qeyd etdik ve adini ne qoyacagini da.

  Post.create({
    ...req.body, // req.body'deki butun melumatlari alir
    post_image:`/img/postimages/${post_image.name}`, // /public/img/postimages/ idi, duzeltdim
    author : req.session.userId
  }, )
  
  req.session.sessionFlash = { // flash mesajlar ucun session yaradiriq
    type: 'alert alert-success', // bootstrap alert classlarini yaziriq. 
    // bunu burda yazmagimiz daha yaxsidir, cunki basqa sehifelerde de istifade ede bilerik ve degisik etsek 1 yerden ederik
    message: 'The post has been successfully shared !'
  }

  // Post.create(req.body) // tek req.body isletmeyeceyik deye bu setri yorum edib yuxaridaki setri istifade edeceyik
  // console.log(req.files.post_image); // upload edilen faylin infolarini console-da gorsenmesi ucun yazdiq ele bele
  // eger post_image.name yazsaydiq sadece faylin adini gostererdi
  res.redirect('/blog') // ve ya bele yazaraq post edildikden sonra blog sehifesine yonlenmesine yol aca bilerdik
  // bundan once /blog yox / idi sadece ve ana sehifeye yonlendirirdi
})

module.exports = router // export etmeliyik.  