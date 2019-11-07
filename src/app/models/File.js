import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        // Nome real do arquivo ex: boleto.pdf
        file_name: Sequelize.STRING,

        // Nome do arquivo gerado pelo multer e salvo no server ftp ex: file12324651.pdf
        file_name_in_server: Sequelize.STRING,

        // Mimetype do arquivo ex: pdf, png, jpeg e etc
        extension: Sequelize.STRING,
      },
      // configs da tabela
      {
        sequelize,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        manifestationId: 'manifestation_id',
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Manifestation);
    this.belongsTo(models.User);
  }
}

export default File;
