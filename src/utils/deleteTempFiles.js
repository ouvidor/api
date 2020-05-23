import fileSystem from 'fs';

const deleteTempFiles = files => {
  files.forEach(file => {
    if (file) {
      fileSystem.unlink(`${process.cwd()}/temp/${file.filename}`, error => {
        if (error) throw error;
        console.log(`Arquivo ${file.filename} deletado!`);
      });
    }
  });
};

export default deleteTempFiles;
