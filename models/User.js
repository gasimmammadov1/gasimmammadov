// Post.js faylindaki kodlari kopyaladiq bura yapisdirdiq ve duzelisler etdik

// bu model dosyasidi. asagida schema qururug, yeni ki datanin hansi formada olmasini isteyirikse o cur qururuq. 
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required:true, unique:true }, // require true o demekdir ki yeni movcudlugu vacib amildir
    // unique:true o demekdir ki yeni bu adin birdene olmasi lazimdir. eyni adli user yarada bilmeyeceyik.
    email: { type: String, required:true, unique:true  },
    password: { type: String, required:true },
   
})

module.exports = mongoose.model('User', UserSchema)
