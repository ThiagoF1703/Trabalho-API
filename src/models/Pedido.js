const { Model, DataTypes } = require('sequelize');

class Pedido extends Model {
  static init(sequelize) {
    super.init({
      horario: DataTypes.DATE,
      endereco: DataTypes.STRING,
      status: DataTypes.STRING,
    }, {
      sequelize,
      tableName: 'pedidos',
    });
  }

  static associate(models) {
    // Um Pedido pertence a um Cliente
    this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

    // Um Pedido tem muitos Produtos (relação N:N)
    this.belongsToMany(models.Produto, {
      through: models.PedidoProduto, // Tabela de ligação
      foreignKey: 'pedido_id',
      otherKey: 'produto_id',
      as: 'produtos',
    });
  }
}

module.exports = Pedido;