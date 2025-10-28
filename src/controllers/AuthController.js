const jwt = require('jsonwebtoken');
const Cliente = require('../models/Cliente'); 
const Cidade = require('../models/Cidade');   

class AuthController {

  async register(req, res) {
    try {
      const { nome, email, senha, altura, nascimento, cidade_id, role } = req.body;

      // 1. Verifica se a cidade existe
      const cidade = await Cidade.findByPk(cidade_id);
      if (!cidade) {
        return res.status(400).json({ error: 'Cidade não encontrada.' });
      }

      // 2. Verifica se o e-mail já está em uso
      const clienteExists = await Cliente.findOne({ where: { email } });
      if (clienteExists) {
        return res.status(400).json({ error: 'Este e-mail já está em uso.' });
      }

      // 3. Cria o cliente
      const cliente = await Cliente.create({
        nome,
        email,
        senha, 
        altura,
        nascimento,
        cidade_id,
        role: role || 'cliente'
      });

      cliente.senha_hash = undefined;
      return res.status(201).json(cliente);

    } catch (error) {
      return res.status(400).json({ error: 'Falha no registro.', details: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      const cliente = await Cliente.findOne({ where: { email } });

      // 1. Verifica se o usuário existe
      if (!cliente) {
        return res.status(401).json({ error: 'Usuário não encontrado.' });
      }

      // 2. Verifica se a senha está correta
      if (!(await cliente.checkPassword(senha))) {
        return res.status(401).json({ error: 'Senha incorreta.' });
      }

      const { id, nome, role } = cliente;

      // 3. Gera o Token JWT
      const token = jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.json({
        user: { id, nome, email, role },
        token,
      });

    } catch (error) {
      return res.status(500).json({ error: 'Falha no login.', details: error.message });
    }
  }
}

module.exports = new AuthController();