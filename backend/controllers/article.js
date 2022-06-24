'use strict'
let validator = require('validator');
let Article = require('../models/article');
let fs = require('fs'); // nos va a permitir eliminar los ficheros
let path = require('path'); // para sacar la ruta del servidor
const { exists } = require('../models/article');
let controller = {

  save: (req, res) =>  {   // metodo para guardar los articulos
 
    // recoger parametros por post 
    let params = req.body;
    console.log(params);
    let validate_title, validate_content;
    // validar datos (validatos)

    try {
      validate_title = !validator.isEmpty(params.title);
      validate_content = !validator.isEmpty(params.content);

    } catch (error) {
      return res.status(200).send( {
        status: 'error',
        message: 'faltan datos por enviar'
      } );
    }

    if (validate_title && validate_content) {
    // Crear el objeto a guardar
      let article = new Article();
    // Asignar valores
      article.title = params.title;
      article.content = params.content;
      article.image = null;
    // Guardar el articulo 
      article.save( (err, articleStored) => {

        if (err || !articleStored) {
          return res.status(404).send( {
            status: 'error',
            message: 'El articulo no se ha guardado'
          } );
        }
    // Devolver una respuesta

        return res.status(200).send( {
          status: 'success',
          article: articleStored
        } );

      });
    }
    else{
      return res.status(200).send( {
        status: 'error',
        message: 'los datos no son validos'
      } );
    }
  },

  // Metodo para devolver los articulos de la db
  getArticles:  (req, res) => {
    
    //metodo find, al find se le podria pasar una condicion
    let query = Article.find({});
    
    let last = req.params.last
    
    if (last || last!=undefined) {
        query.limit(5)
      }
    query.sort('-_id').exec((err, articles) =>{

      if (err) {
        return res.status(500).send( {
          status: 'error',
          message: 'error al devolver los articulos'
        } );
      };

      if (!articles) {
        return res.status(404).send( {
          status: 'error',
          message: 'no hay articulos para mostrar'
        } );
      };

      return res.status(200).send( {
        status: 'success',
        articles
      } );

    }) // se le podiar pasar una condicion dependiendo id por ej

   
  },

  getArticle: (req, res) =>{
    // traer el id de la url
    let articleId = req.params.id;
    // comprobar que existe
    if (!articleId || articleId == null) {
      return res.status(404).send( {
        status: 'error',
        message: 'no hay articulos para mostrar'
      } );
    }

    // buscar el articulo
    Article.findById(articleId, (err, article) => {

      if (err || !article) {
        return res.status(404).send( {
          status: 'error',
          message: 'no existe el articulo'
        } );
      };

      
    // devolverlo en json

    return res.status(200).send( {
      status: 'success',
      article
      } );
    
    })

  },

  //metodo para actualizar o modificar los datos de un articulo
  update: (req, res) => {
    let validate_title, validate_content;
    // traer el id del articulo por la url
    let articleId = req.params.id;
    // traer los datos que llegan por put
    let params = req.body;
    // validar los datos
    try {
      validate_title = !validator.isEmpty(params.title);
      validate_content = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(404).send( {
        status: 'error',
        message: 'faltan datos por enviar'
      } );
    };

    if (validate_title && validate_content) {
    // hacer un find and update   
    Article.findOneAndUpdate({_id: articleId}, params, {new:true}, (err, articleUpdated) =>{
      if (err) {
        return res.status(500).send( {
          status: 'error',
          message: 'error al actualizar'
        } );
      };

      if (!articleUpdated) {
        return res.status(500).send( {
          status: 'error',
          message: 'no existe el articulo'
        } );
      };

      return res.status(200).send( {
        status: 'success',
        article: articleUpdated
      } );
    })

    }else{
    // devolver respuesta
    return res.status(200).send( {
      status: 'error',
      message: 'la validacion no es correcta'
    } );
    }

  },

  delete: (req, res) =>{
    // traer el id
    let articleId = req.params.id;
    // hacer find and delete
    Article.findOneAndDelete({_id: articleId}, (err, articleRemoved) =>{
      if (err) {
        return res.status(500).send( {
          status: 'error',
          message: 'error al borrar'
        } );
      };

      if (!articleRemoved) {
        return res.status(404).send( {
          status: 'error',
          message: 'No se ha borrado el articulo'
        } );
      };

      return res.status(200).send( {
        status: 'success',
        article: articleRemoved
      } );
    })

  },

  // metodo para subida de archivo
  upload: (req,res) =>{

    let file_path;
    // configurar el modulo conect multiparty router/article.js

    // traer el fichero de la peticion
    let file_name;

    console.log(req.files);
    if (!req.files) {
      return res.status(404).send( {
        status: 'error',
        message: 'iamgen no subida'
      } );
    };

    // conseguir el nombre y la extension del archivo
    file_path = req.files.file0.path;
    let file_split = file_path.split('\\'); // cortar la ruta
    
    file_name= file_split[2];
    let extensionFile_split = file_name.split('\.');
    let file_ext = extensionFile_split[1];
    
    // comporbar la estension, solo imagenes, si es valido borrar el fichero
    if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif' ) {
      // borrar el archivo subido
        fs.unlink(file_path, (err) => {
          return res.status(200).send( {
            status:'error',
            messsage: 'la estension de la ruta no es valida'
          } );
        })
    }else {
      
    // si todo es valido
      let articleId = req.params.id
    //buscar el articulo, asignarle el nombre de la imagen y actualizarlo
    Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new:true}, (err, articleUpdated) =>{
    
      if (err || !articleUpdated) {
        return res.status(200).send( {
          status: 'error',
          message: 'Error al guardar la imagen',
        } );
      }

      return res.status(200).send( {
        status: 'success',
        article: articleUpdated,
      } );

    })
    }


  },

  getImage: (req, res) => {
    let file = req.params.image;
    let path_file = './upload/articles/'+file; // la ruta de donde se esta guardando el archivo

    fs.exists(path_file, (exists) =>{
      if (exists) {
        return res.sendFile(path.resolve(path_file)); // libreria en path, devolver el fichero en crudo
      }else{
        return res.status(404).send( {
          status: 'error',
          message: 'La imagen no existe'
        } );
      }
    })
  },

  search: (req, res) =>{
    // sacar ek string a buscar
    let searchString = req.params.search;
    console.log(searchString);
    // find or para sacar el articulo de la base de datos
    Article.find({ "$or": [
      {"title": { "$regex": searchString, "$options": "i"}}, // si el searchString esta contenido dentro del titulo o dentro del contenido
      {"content": { "$regex": searchString, "$options": "i"}}
    ]})
    .sort([['date', 'descending']])
    .exec( (err, articles) => {
      
      if (err) {
      return res.status(500).send( {
        status: 'error',
        message: 'error en la peticion'
      } );
      };

      if (!articles || articles.length <= 0) {
        return res.status(404).send( {
          status: 'error',
          message: 'no hay articulos para mostrar'
        } );
        };


      return res.status(200).send( {
        status: 'success',
        articles
      } );
    })
    
  }
  
};

module.exports = controller;