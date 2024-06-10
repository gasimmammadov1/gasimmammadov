// bunu test ucun yaratdiq. websiteda post hissesin hele yaratmamisiq deye postun database hissesin burada yoxladiq.
// burdaki kodlari ise salmaq ucun node test.js yazmaq lazimdi. 
const mongoose = require('mongoose');

const Post = require('./models/Post')

mongoose.connect('mongodb+srv://gasimmammadov1:qasim2000@cluster0.j1v10ox.mongodb.net/nodeblog_test_db?retryWrites=true&w=majority',{ 
/*  useNewUrlParser: true, 
    useUnifiedTopology: true 
  buralari ele bele yoruma aldim, cunki terminalda bele yazilmisdi:

(node:1180) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
(Use `node --trace-warnings ...` to show where the warning was created)
(node:1180) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
  */
 });


 Post.findByIdAndDelete('661aa17bbc361e150a946189') // bele ise biz test ucun yaratdigimiz postu silirik id-si ile

/* Post.findById('661829b089902291bf191d35') // aha bele yazdigimiz zaman id'si ile tapir. */

/* Post.findByIdAndUpdate('661829b089902291bf191d35',{ 
    title: 'Benim 1-ci basligim'
})  helelik bura da yorum olaraq qalsin.*/
// bele yazarken ise id'si ile tapir ve deyisiklik edir. ilk parametrde id, ikincide ise deyisiklik qeyd olunur.
// amma useFindAndModify option-u olmasa databasede deyisiklik etse de deyisiklikden sonraki ilk consolelogda evvelki formada gorunur

/* Post.find({
    // title: 'Benim ikinci Post Basligim' // eger title kimi hansisa parametri yazmasaq, butun postlari gosterir.
}) 
helelik yorumda qalsin, id ile axtarmaga baxaq.
*/

/* Post.create({
    title: 'Benim ucuncu Post Basligim',
    content: 'Post icerigi, lorem ipsum text'

}) 
post find yoxlamaq ucun helelik burani yorum etdim */

/* , (error, post) => {
    console.log(error, post)
} // dersdeki kodlarda bele idi amma artiq mongose yeni surumunde .create metodunda callback function 
(arrow function ile) isledilmir. onun yerine promise istifade edilir asagidaki kimi: */
.then(post => {
    console.log('Post oluşturuldu:', post); // emr icra olanda bunu yazacaq, sonra icra edilen seyi.
})
.catch(error => {
    console.error('Post oluşturulurken bir hata oluştu:', error); // eger icra yerine xeta olsa bunu yazib erroru yazacaq.
}); 


