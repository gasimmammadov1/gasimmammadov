// Users.js faylindaki kodlari kopyaladiq bura yapisdirdiq ve duzelisler etdik

// bu model dosyasidi. asagida schema qururug, yeni ki datanin hansi formada olmasini isteyirikse o cur qururuq. 
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { type: String, required:true, unique:true }, /* category.handlebars faylinda formda input hissesinde
    biz name'e name adini verdiyimiz ucun bunda da name yazdiq. */
   
   
})

module.exports = mongoose.model('Category', CategorySchema)
