const { Model, DataTypes } = require('sequelize');

class Categoria extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
    }, {
      sequelize,
      tableName: 'categorias',
    });
  }

  static associate(models) {
    // Uma Categoria tem muitos Produtos
    this.hasMany(models.Produto, { foreignKey: 'categoria_id', as: 'produtos' });
  }
}

module.exports = Categoria;