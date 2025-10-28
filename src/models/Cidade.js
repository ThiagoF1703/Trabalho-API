const { Model, DataTypes } = require('sequelize');

class Cidade extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
    }, {
      sequelize,
      tableName: 'cidades',
    });
  }

  static associate(models) {
    // Uma Cidade tem muitos Clientes
    this.hasMany(models.Cliente, { foreignKey: 'cidade_id', as: 'clientes' });
  }
}

module.exports = Cidade;