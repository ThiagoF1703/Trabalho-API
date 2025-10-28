const { Router } = require('express');

// Middlewares
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

// Roteadores
const publicRoutes = require('./publicRoutes');
const clientRoutes = require('./clientRoutes');
const adminRoutes = require('./adminRoutes');

const routes = new Router();

// Rotas públicas (não precisam de token)
routes.use(publicRoutes);

// Rotas de Cliente (precisam de token, mas não de admin)
routes.use(authMiddleware, clientRoutes);

// Rotas de Admin 
routes.use('/admin', authMiddleware, adminMiddleware, adminRoutes);

module.exports = routes;