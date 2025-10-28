const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Cidade = require('../models/Cidade');
const Cliente = require('../models/Cliente');
const Categoria = require('../models/Categoria');
const Produto = require('../models/Produto');
const Pedido = require('../models/Pedido');
const PedidoProduto = require('../models/PedidoProduto');

const models = [Cidade, Cliente, Categoria, Produto, Pedido, PedidoProduto];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(dbConfig);

    models.forEach(model => {
      if (model && typeof model.init === 'function') {
        model.init(this.connection);
      }
    });

    models.forEach(model => {
      if (model && typeof model.associate === 'function') {
        model.associate(this.connection.models);
      }
    });
  }
}

module.exports = new Database();