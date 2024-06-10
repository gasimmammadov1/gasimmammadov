const express = require("express"); // yonlendirmelerin islemesi ucun expresi daxil etdik
const router = express.Router(); // hemcinin expressdeki router class'ni da import etdik
const Category = require("../../models/Category"); // 2 defe papkadan cixdiq, sonra modelse girdik ve
const Post = require('../../models/Post')
const path = require('path')

router.get("/", (req, res) => {
  /* '/' yeni ozune yonelecek, admine yeni. searchbarda /admin yazlacaq */

  res.render(
    "admin/index"
  ); /* request idi evvel ve index yazilmamisdi. burada viewsdeki admini alir*/
});

router.get("/categories", (req, res) => {
  /* '/' yeni ozune yonelecek, admine yeni. searchbarda /admin yazlacaq */

  Category.find({
    /* burani bos qoyduq cunki hansisa filterleme etmeden butun kateqorileri tapmaq isteyirik */
  })

    .sort({ $natural: -1 })
    /* sort sayesinde artiq yeni elave edilen kateqoriyalar en ustde gorsenecek */

    .lean()
    /* dersde lean isledilmemisdi ona gore kateqoriyalar gorunmurdu saytda ve asagidaki xeta cixirdi consolda :
  Handlebars: Access has been denied to resolve the property "_id" because it is not an "own property" of its parent.
  
  .lean() haqda bilgi:
  Handlebars, prototip zincirinin güvenliğini sağlamak için belirli özelliklere erişimi engelliyor. 
  Handlebars'ın güvenlik denetimlerini tamamen devre dışı bırakmak istemiyorsanız, 
  veritabanından dönen nesneleri düz bir JavaScript nesnesine dönüştürebilirsiniz. 
  Bunu yapmak için .lean() metodunu kullanabilirsiniz */

    .then((categories) => {
      /* tapandan sonra categories bilgisini gonderirik */
      res.render(
        "admin/categories" /* ilk parametr, bura gonderirik */,
        { categories: categories } /* ikinci parametr, 
      categoriesi categories adiyla gonderirik */
      ); /*sadece render idi evvel, amma indi yuxaridaki find prosesin de elave etdik ki 
    categoriesde gorsensin elave etdiyimiz bilgiler*/
    });
});



router.post("/categories", (req, res) => {
  /* '/' yeni ozune yonelecek, admine yeni. searchbarda /admin yazlacaq */

  /* mongoose'da daha model.create ozelliyi callback funksiya desteklemir deye dersdekinden ferqlenecek bu kodlar: */
  Category.create(req.body)
    .then((Category) => {
      res.redirect(
        "categories"
      ); /* eger xeta olmasa categories sehifesine qayidir */
    })
    .catch((error) => {
      console.error(error); /* eger nese xeta olsa ekranda gosterir */
    });
});

router.delete("/categories/:id", (req, res) => {
  /* admin/categories'den gonderilen delete requestini qebul etmek ucun router */

  Category.deleteOne({
    _id: req.params.id,
  }) /* id'si gonderilen id'e beraber olan kateqoriyani silmek ucun */
    /* dersde Category.remove idi deleteOne yerine amma mongoose deyisilib deye artiq bele yaziriq. */
    .then(() => {
      res.redirect(
        "/admin/categories"
      ); /* sildikden sonra categories sehifesine qayitmaq ucun */
    });
});

router.get("/posts", (req, res) => {
  Post.find({})
    .populate([
      
      { path: "category", model: Category },
     
    ])
    .sort({ $natural: -1 })
    .lean()
    .then((posts) => {
      res.render("admin/posts", { posts: posts });
    });
});

/* asagidaki delete hissesin ozum etdim categoriesde etdiyimize istinaden */
router.delete("/posts/:id", (req, res) => {
  /* admin/posts'dan gonderilen delete requestini qebul etmek ucun router */

  Post.deleteOne({
    _id: req.params.id,
  }) /* id'si gonderilen id'e beraber olan postu silmek ucun */
    /* dersde Post.remove idi deleteOne yerine amma mongoose deyisilib deye artiq bele yaziriq. */
    .then(() => {
      res.redirect(
        "/admin/posts"
      ); /* sildikden sonra categories sehifesine qayitmaq ucun */
    });
});

router.get("/posts/edit/:id", (req, res) => { /* admin/posts'daki edit butonuna basanda istiqametlenmek ucun */
  Post.findOne({_id: req.params.id})
/*     .populate([
      
      { path: "category", model: Category },
     
    ]) */
    /* .sort({ $natural: -1 }) */
    .lean()
    .then((post) => {
      Category.find({}).lean().then(categories => {
        res.render("admin/editpost", { post: post, categories: categories });
      })
      
    });
});

router.put("/posts/:id", (req, res) => {
  let post_image = req.files.post_image // upload edilen fayli deyisene menimsetdik (fileUpload ozelliyi)

  post_image.mv(path.resolve(__dirname, '../../public/img/postimages', post_image.name )) 

/*   
Post.findOne({_id: req.params.id})
  .lean()
  .then((post) => {
    post.title = req.body.title // edit sehifesinde (body'sinde) yazdigimiz title'i databasedeki title'e menimsetdik
    post.content = req.body.content
    // post.date = req.body.date  // post tarixi olaraq guncellendiyi zamanin tarixi gorunsun deye.
    post.category = req.body.category
    post.post_image = `/img/postimages/${post_image.name}`

    post.save().then(post => {
      res.redirect('/admin/posts')
    })
  }) 
  
  dersde yuxaridaki kimi idi edit hissesi amma mongoose'da deyisiklikler olub deye asagidaki kimi yazmaliyiq:
  */

  const updatedData = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    post_image: `/img/postimages/${post_image.name}`
  };

  Post.findOneAndUpdate({ _id: req.params.id }, updatedData)
  .then(() => {
    res.redirect('/admin/posts');
  })
  .catch(error => {
    console.error(error);
    res.redirect('/admin/posts');
  });
  
})

module.exports = router; // export etmeliyik.
