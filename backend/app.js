'use strict'

// cargar modulos de node para crear servidor
let express = require('express');
let bodyParser = require('body-parser');
// ejecutar express (http)

let app = express();
// cargar ficheros rutas

let articles_routes = require('./routes/article')

//middLewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));

//cors
// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


//añadir prefijos a rutas
app.use('/api', articles_routes)


// esportar modulo (fichero actual)
module.exports = app;

