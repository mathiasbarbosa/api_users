'use strict'
let mongoose = require('mongoose');

let Schema = mongoose.Schema; 

let ArticleSchema = Schema({
  title: String,
  content: String,
  date: {type: Date, default: Date.now},
  image:String
})  /// aca definimos la estuctura y propiedades que va a tener el objeto


module.exports = mongoose.model('Article', ArticleSchema);
// articles => guarda documenteos de este tipo y con estructura dentro de la coleccion

