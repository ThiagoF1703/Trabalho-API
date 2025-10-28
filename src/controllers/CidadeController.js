const Cidade = require('../models/Cidade'); // <-- CORRIGIDO

class CidadeController {
  async index(req, res) {
    const cidades = await Cidade.findAll();
    return res.json(cidades);
  }

  async store(req, res) {
    const { nome } = req.body;
    const cidade = await Cidade.create({ nome });
    return res.status(201).json(cidade);
  }

  async update(req, res) {
    const { id } = req.params;
    const cidade = await Cidade.findByPk(id);
    if (!cidade) return res.status(404).json({ error: 'Cidade não encontrada.'});
    await cidade.update(req.body);
    return res.json(cidade);
  }

  async delete(req, res) {
    const { id } = req.params;
    const cidade = await Cidade.findByPk(id);
    if (!cidade) return res.status(404).json({ error: 'Cidade não encontrada.'});
    await cidade.destroy();
    return res.status(204).send();
  }
}
module.exports = new CidadeController();