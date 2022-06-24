'use strict'

let express = require('express');
let ArticleController = require('../controllers/article');

let router = express.Router();

let multipart = require('connect-multiparty');
let md_upload = multipart({uploadDir: './upload/articles'})

// Rutas de prueba
// router.post('/datos-curso', ArticleController.datosCurso);
// router.post('/test-controlador', ArticleController.test);

// Rutas utiles
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
// netodo pora obtener los ultimos 5 reutilizo el mismo metodo, pero le paso un parametro opcional
//router.get('/articles', ArticleController.getArticles);
// esta vez va a recibir un id obligatorio
router.get('/article/:id', ArticleController.getArticle);
// Aca vamos a utilizar el metodo put, sirve para actualizar
router.put('/article/:id', ArticleController.update);
//metodo para eliminar
router.delete('/article/:id', ArticleController.delete);
// metodo para subir archivos, aca aplicamos el midelwere
router.post('/upload-image/:id', md_upload ,ArticleController.upload);
//metodo para obtener imagen
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search)
module.exports = router;