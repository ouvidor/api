import Sequelize, { Model } from 'sequelize';

class Manifestation extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        category: {
          type: Sequelize.INTEGER,
          // adicionar referencia a tabela category depois...
        },
        read: Sequelize.TINYINT,
      },
      // configs da tabela
      {
        sequelize,
        underscored: true,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User);
  }
}

export default Manifestation;
