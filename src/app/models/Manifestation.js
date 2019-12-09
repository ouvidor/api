import Sequelize, { Model } from 'sequelize';

class Manifestation extends Model {
  static init(sequelize) {
    super.init(
      {
        protocol: {
          defaultValue: 0,
          type: Sequelize.STRING,
        },
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        read: Sequelize.TINYINT,
        location: Sequelize.STRING,
        latitude: Sequelize.STRING,
        longitude: Sequelize.STRING,
      },
      // configs da tabela
      {
        sequelize,
        underscored: true,
        createdAt: 'created_at', // <====== this line and the following one
        updatedAt: 'updated_at',
      }
    );

    // criação do protocolo. exemplo: 2019125-52
    this.addHook('afterCreate', async manifestation => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDay();
      const number = manifestation.id % 10000; // ultimos 4 números

      manifestation.protocol = `${year}${month}${day}-${number}`;
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
    this.belongsTo(models.Type, {
      foreignKey: 'type_id',
      as: 'type',
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
