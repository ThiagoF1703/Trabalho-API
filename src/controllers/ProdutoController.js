const { Op } = require('sequelize');
const Produto = require('../models/Produto');    
const Categoria = require('../models/Categoria'); 

class ProdutoController {

  async listAvailable(req, res) {
    try {
      const produtos = await Produto.findAll({
        where: {
          quantidade: { [Op.gt]: 0 } // Apenas produtos com estoque
        },
        include: { model: Categoria, as: 'categoria', attributes: ['id', 'nome'] }
      });
      return res.json(produtos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar produtos.', details: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id, {
        include: { model: Categoria, as: 'categoria', attributes: ['id', 'nome'] }
      });

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      return res.json(produto);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produto.', details: error.message });
    }
  }

  // --- ROTAS DE ADMINISTRAÇÃO ---

  async create(req, res) {
    try {
      const { nome, preco, quantidade, categoria_id } = req.body;

      // Verifica se a categoria existe
      const categoria = await Categoria.findByPk(categoria_id);
      if (!categoria) {
        return res.status(400).json({ error: 'Categoria não encontrada.' });
      }

      const produto = await Produto.create({ nome, preco, quantidade, categoria_id });
      return res.status(201).json(produto);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao criar produto.', details: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      await produto.update(req.body);
      return res.json(produto);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar produto.', details: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id);

      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      await produto.destroy();
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar produto.', details: error.message });
    }
  }
}

module.exports = new ProdutoController();