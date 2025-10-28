module.exports = (req, res, next) => {
  // O req.userRole foi definido no middleware 'auth.js'
  if (req.userRole !== 'admin') {
    return res.status(403).json({ 
      error: 'Acesso negado. Esta rota é restrita a administradores.' 
    });
  }
  
  return next(); // Permite que a requisição continue
};