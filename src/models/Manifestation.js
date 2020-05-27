import Sequelize, { Model } from 'sequelize';
import crypto from 'crypto';

class Manifestation extends Model {
  static init(sequelize) {
    super.init(
      {
        protocol: Sequelize.STRING,
        title: Sequelize.STRING,
        description: Sequelize.TEXT,
        read: {
          type: Sequelize.TINYINT,
          defaultValue: 0,
        },
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

    // criação do protocolo. exemplo: k6f2uhi9
    this.addHook('beforeSave', async manifestation => {
      // converte o tempo UNIX em Base36 e coloca no final 3 caracteres aleatorios
      if (!manifestation.protocol) {
        const stringToEncript = `${Date.now().toString(36)}${crypto
          .randomBytes(5)
          .toString('hex')
          .slice(0, 3)}`;

        manifestation.protocol = stringToEncript;
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.ManifestationStatusHistory, {
      foreignKey: 'manifestations_id',
      as: 'status_history',
      sourceKey: 'id',
    });
    this.belongsTo(models.Secretary, {
      foreignKey: 'secretariats_id',
      as: 'secretary',
      targetKey: 'id',
    });
    this.belongsTo(models.User, {
      foreignKey: 'users_id',
      as: 'user',
      targetKey: 'id',
    });
    this.belongsToMany(models.Category, {
      through: 'manifestations_categories',
      as: 'categories',
      foreignKey: 'manifestations_id',
      constraints: false,
    });
    this.hasMany(models.File, {
      as: 'files',
      foreignKey: 'manifestations_id',
    });
    this.belongsTo(models.Type, {
      as: 'type',
      foreignKey: 'types_id',
      targetKey: 'id',
    });
    this.belongsTo(models.Ombudsman, {
      as: 'ombudsman',
      foreignKey: 'ombudsmen_id',
      targetKey: 'id',
    });
    this.hasOne(models.Avaliation, {
      as: 'avaliation',
      foreignKey: 'manifestations_id',
    });
  }
}

export default Manifestation;
