const { Router } = require('express');
const PedidoController = require('../controllers/PedidoController');

const routes = new Router();

// --- Pedidos (Requisitos do Cliente) ---
routes.post('/pedidos', PedidoController.create); // Realização de um pedido
routes.get('/pedidos/meus', PedidoController.listMy); // Consulta de pedidos realizados

module.exports = routes;