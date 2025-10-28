const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    // Verifica se o token é válido
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Adiciona os dados do usuário (id, role) na requisição
    req.userId = decoded.id;
    req.userRole = decoded.role;

    return next(); // Permite que a requisição continue
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};