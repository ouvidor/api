import Multer from 'multer';

class FileController {
  createDiskStorage() {
    const storage = Multer.diskStorage({
      destination(req, file, cb) {
        cb(null, `${process.cwd()}/temp`);
      },
      filename(req, file, cb) {
        const [type, extension] = file.mimetype.split('/');

        cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
      },
    });
    return storage;
  }

  // Retorna todas entries de Roles no DB
  async upload(req, res) {
    res.send('kk');
  }
} // fim da classe

export default new FileController();
