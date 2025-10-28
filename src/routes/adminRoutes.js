const { Router } = require('express');
const ProdutoController = require('../controllers/ProdutoController');
const PedidoController = require('../controllers/PedidoController');
const CategoriaController = require('../controllers/CategoriaController');
const CidadeController = require('../controllers/CidadeController');

const routes = new Router();

// --- Gerenciamento de Produtos (Requisito do Admin) ---
routes.post('/produtos', ProdutoController.create);
routes.put('/produtos/:id', ProdutoController.update);
routes.delete('/produtos/:id', ProdutoController.delete);

// --- Gerenciamento de Pedidos (Requisito do Admin) ---
routes.get('/pedidos', PedidoController.listAll); // Ver todos os pedidos
routes.put('/pedidos/:id/status', PedidoController.updateStatus); // Mudar status

// --- CRUDs Bônus (Cidades e Categorias) ---
routes.get('/categorias', CategoriaController.index);
routes.post('/categorias', CategoriaController.store);
routes.put('/categorias/:id', CategoriaController.update);
routes.delete('/categorias/:id', CategoriaController.delete);

routes.get('/cidades', CidadeController.index);
routes.post('/cidades', CidadeController.store);
routes.put('/cidades/:id', CidadeController.update);
routes.delete('/cidades/:id', CidadeController.delete);


module.exports = routes;