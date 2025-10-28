const { Router } = require('express');
const AuthController = require('../controllers/AuthController');
const ProdutoController = require('../controllers/ProdutoController');

const routes = new Router();

// --- Autenticação ---
routes.post('/auth/register', AuthController.register);
routes.post('/auth/login', AuthController.login);

// --- Visualização de Produtos (Requisito do Cliente) ---
routes.get('/produtos', ProdutoController.listAvailable);
routes.get('/produtos/:id', ProdutoController.getOne);

module.exports = routes;