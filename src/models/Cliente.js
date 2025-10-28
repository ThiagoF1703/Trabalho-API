const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class Cliente extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      altura: DataTypes.DOUBLE,
      nascimento: DataTypes.DATE,
      email: DataTypes.STRING,
      senha: {
        type: DataTypes.VIRTUAL,
        set(value) {
          this.setDataValue('senha_hash', bcrypt.hashSync(value, 8));
        }
      },
      senha_hash: DataTypes.STRING, // Este campo existe no banco
      role: {
        type: DataTypes.ENUM('cliente', 'admin'),
        defaultValue: 'cliente',
      },
    }, {
      sequelize,
      tableName: 'clientes',
    });
  }

  static associate(models) {
    // Um Cliente pertence a uma Cidade
    this.belongsTo(models.Cidade, { foreignKey: 'cidade_id', as: 'cidade' });
    // Um Cliente tem muitos Pedidos
    this.hasMany(models.Pedido, { foreignKey: 'cliente_id', as: 'pedidos' });
  }

  // Método de instância para verificar a senha
  checkPassword(senha) {
    return bcrypt.compareSync(senha, this.senha_hash);
  }
}

module.exports = Cliente;