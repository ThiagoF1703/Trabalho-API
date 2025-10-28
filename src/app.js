require('dotenv').config();
require('./database'); // Conecta no DB e carrega os models

const express = require('express');
const cors = require('cors');
const routes = require('./routes');

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(cors()); // Permite acesso de qualquer origem
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes); 
  }

  exceptionHandler() {
    this.server.use((err, req, res, next) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
      }
      
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    });
  }
}

module.exports = new App().server;