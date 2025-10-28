const { Model, DataTypes } = require('sequelize');

class PedidoProduto extends Model {
  static init(sequelize) {
    super.init({
      // Chaves primárias estrangeiras
      pedido_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      produto_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      preco: DataTypes.DOUBLE,
      quantidade: DataTypes.DOUBLE,
    }, {
      sequelize,
      tableName: 'pedidos_produtos',
      timestamps: false, 
    });
  }
}

module.exports = PedidoProduto;