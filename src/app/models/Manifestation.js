import Sequelize, { Model } from 'sequelize';

class Manifestation extends Model {
  static init(sequelize) {
    super.init(
      {
        protocol: Sequelize.STRING,
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        read: Sequelize.TINYINT,
        location: Sequelize.STRING,
        latitude: Sequelize.STRING,
        longitude: Sequelize.STRING,
        type_id: {
          type: Sequelize.INTEGER,
          values: [1, 2, 3, 4, 5],
          allowNull: false,
        },
      },
      // configs da tabela
      {
        sequelize,
        underscored: true,
        createdAt: 'created_at', // <====== this line and the following one
        updatedAt: 'updated_at',
      }
    );

    // criação do protocolo. exemplo: k6f2uhi9
    this.addHook('beforeSave', async manifestation => {
      // converte o tempo UNIX em Base36
      manifestation.protocol = Date.now().toString(36);
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Secretary, {
      foreignKey: 'secretary_id',
      as: 'secretary',
      targetKey: 'id',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      targetKey: 'id',
    });
    this.belongsToMany(models.Category, {
      through: 'manifestation_category',
      as: 'categories',
      foreignKey: 'manifestation_id',
      constraints: false,
    });
  }
}

export default Manifestation;
