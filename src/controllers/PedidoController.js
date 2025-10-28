const Pedido = require('../models/Pedido');     
const Produto = require('../models/Produto');   
const Cliente = require('../models/Cliente');   
const sequelize = require('sequelize');
const db = require('../database/index');

class PedidoController {

  async create(req, res) {
    // Inicia uma transação do banco de dados
    const t = await db.connection.transaction();
    
    try {
      const { endereco, produtos } = req.body; // produtos = [ { produto_id: 1, quantidade: 2 }, ... ]
      const cliente_id = req.userId; // Vem do middleware de autenticação

      if (!produtos || produtos.length === 0) {
        return res.status(400).json({ error: 'O pedido deve conter pelo menos um produto.' });
      }

      // 1. Validar estoque de todos os produtos ANTES de criar o pedido
      for (const item of produtos) {
        const produtoDb = await Produto.findByPk(item.produto_id, { transaction: t });
        if (!produtoDb) {
          await t.rollback();
          return res.status(404).json({ error: `Produto com ID ${item.produto_id} não encontrado.` });
        }
        if (produtoDb.quantidade < item.quantidade) {
          await t.rollback();
          return res.status(400).json({ error: `Estoque insuficiente para "${produtoDb.nome}". Disponível: ${produtoDb.quantidade}` });
        }
      }

      // 2. Criar o Pedido
      const pedido = await Pedido.create({
        endereco,
        cliente_id,
        status: 'processando',
        horario: new Date(),
      }, { transaction: t });

      // 3. Associar produtos ao pedido e atualizar estoque
      for (const item of produtos) {
        const produtoDb = await Produto.findByPk(item.produto_id, { transaction: t });

        await pedido.addProduto(produtoDb, {
          through: {
            preco: produtoDb.preco, // Salva o preço do momento da compra
            quantidade: item.quantidade,
          },
          transaction: t
        });

        // Atualiza o estoque do produto
        const novaQuantidade = produtoDb.quantidade - item.quantidade;
        await produtoDb.update({ quantidade: novaQuantidade }, { transaction: t });
      }

      // 4. Se tudo deu certo, confirma a transação
      await t.commit();

      // 5. Retorna o pedido completo
      const pedidoCompleto = await Pedido.findByPk(pedido.id, {
        include: [
          { model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email'] },
          { 
            model: Produto, 
            as: 'produtos', 
            through: { attributes: ['preco', 'quantidade'] } // Inclui dados da tabela pivô
          }
        ]
      });

      return res.status(201).json(pedidoCompleto);

    } catch (error) {
      await t.rollback();
      return res.status(500).json({ error: 'Falha ao processar o pedido.', details: error.message });
    }
  }

  async listMy(req, res) {
    try {
      const pedidos = await Pedido.findAll({
        where: { cliente_id: req.userId }, // Apenas pedidos do usuário logado
        include: [
          { 
            model: Produto, 
            as: 'produtos', 
            attributes: ['id', 'nome'],
            through: { attributes: ['preco', 'quantidade'] }
          }
        ],
        order: [['horario', 'DESC']]
      });
      return res.json(pedidos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar pedidos.', details: error.message });
    }
  }

  // --- ROTAS DE ADMINISTRAÇÃO ---

  async listAll(req, res) {
    try {
      const pedidos = await Pedido.findAll({
        include: [
          { model: Cliente, as: 'cliente', attributes: ['id', 'nome', 'email'] },
          { model: Produto, as: 'produtos', attributes: ['id', 'nome']}
        ],
        order: [['horario', 'DESC']]
      });
      return res.json(pedidos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar todos os pedidos.', details: error.message });
    }
  }

  async updateStatus(req, res) {
     try {
      const { id } = req.params;
      const { status } = req.body; 

      if (!status) {
        return res.status(400).json({ error: 'O campo "status" é obrigatório.' });
      }

      const pedido = await Pedido.findByPk(id);
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido não encontrado.' });
      }

      await pedido.update({ status });
      return res.json(pedido);

    } catch (error) {
      return res.status(400).json({ error: 'Erro ao atualizar status do pedido.', details: error.message });
    }
  }
}

module.exports = new PedidoController();