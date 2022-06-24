'use strict'

var mongoose = require('mongoose');
let app = require('./app');
let port = 3900;

// mongose.connect((url, opciones).then(() => {}))
// mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/api_rest', { useNewUrlParser: true})

              .then(() => {
                console.log("conexion correcta");

                // crear servidor y ponerme a escuchar peticion
                app.listen(port , () =>{
                  console.log("servidor corriendo");
                })
              });

