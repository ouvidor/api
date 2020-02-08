import File from '../models/File';

class FileController {
  async save(req, res) {
    const uploadedFiles = req.files.map(file => ({
      name: file.originalname,
      path: file.filename,
    }));

    const files = await File.bulkCreate(uploadedFiles, { returning: true });

    return res.json({ files });
  }
}

export default new FileController();
