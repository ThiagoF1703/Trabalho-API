const { Model, DataTypes } = require('sequelize');

class Produto extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      preco: DataTypes.DOUBLE,
      quantidade: DataTypes.DOUBLE, // Estoque
    }, {
      sequelize,
      tableName: 'produtos',
    });
  }

  static associate(models) {
    // Um Produto pertence a uma Categoria
    this.belongsTo(models.Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
    
    // Um Produto pertence a muitos Pedidos (relação N:N)
    this.belongsToMany(models.Pedido, {
      through: models.PedidoProduto, // Tabela de ligação
      foreignKey: 'produto_id',
      otherKey: 'pedido_id',
      as: 'pedidos',
    });
  }
}

module.exports = Produto;