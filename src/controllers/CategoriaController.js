const Categoria = require('../models/Categoria'); // <-- CORRIGIDO

class CategoriaController {
  async index(req, res) {
    const categorias = await Categoria.findAll();
    return res.json(categorias);
  }

  async store(req, res) {
    const { nome } = req.body;
    const categoria = await Categoria.create({ nome });
    return res.status(201).json(categoria);
  }
  
  async update(req, res) {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada.'});
    await categoria.update(req.body);
    return res.json(categoria);
  }

  async delete(req, res) {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(4404).json({ error: 'Categoria não encontrada.'});
    await categoria.destroy();
    return res.status(204).send();
  }
}
module.exports = new CategoriaController();