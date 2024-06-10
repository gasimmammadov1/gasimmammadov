// bu model dosyasidi. asagida schema qururug, yeni ki datanin hansi formada olmasini isteyirikse o cur qururuq. 
const mongoose = require('mongoose');
const Schema = mongoose.Schema 

const PostSchema = new mongoose.Schema({
    title: { type: String, required:true }, // require true o demekdir ki yeni movcudlugu vacib amildir
    author: { type: Schema.Types.ObjectID , ref: 'users' }, // database'deki users
    content: { type: String, required:true },
    date: { type:Date, default: Date.now },
    post_image: { type: String, required:true }, // sekilin ozunu yox sadece adini database'e qoyuruq deye type string'dir.
    category:  {type: Schema.Types.ObjectID , ref: 'categories'}
    /* adpost.handlebars'da select hissesinde name olaraq category yazdiq deye burda da category yazdiq. */
})

module.exports = mongoose.model('Post', PostSchema)
