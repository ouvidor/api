/**
 * O ErrorHandler.js implementa a manipulação de erros padrão do Express JS, é utilizado como um
 * Midleware, mais informações ----> https://expressjs.com/pt-br/guide/error-handling.html
 *
 * Atenção, o error handler do express apenas trata problemas ocorridos nas rotas ou midlewares.
 *
 * Para adicionar um novo tratamento de erro, deve se atentar ao codigo de erro reportado quando acontecer uma
 * exceção, toda vez que um erro ocorrer e não estiver mapeado, a linha 16 desse arquivo será executada
 * informando qual o codigo do erro ocorrido, com isso é só criar mais um case e tratar o erro
 * individualmente.
 *
 */

class ErrorHandler {
  async expressErrorHandler(err, req, res, next) {
    console.error(`ERROR HANDLER: ${err.code}`);
    switch (err.code) {
      // Erro do multer quando um arquivo for maior que o permitido na configuração
      case 'LIMIT_FILE_SIZE':
        res
          .status(500)
          .json({ message: 'O tamanho maximo de anexos é 8MB', error: err });
        break;
      default:
        res.status(500).json({ message: 'Erro', error: err });
        break;
    }
    next();
  }

  async genericErrorHandler(err) {
    switch (err.message) {
      default:
        console.log('Erro generico sem tratamento definido');
        console.log(`Codigo do erro:${err.code}`);
        console.log(`Erro na integra:`);
        console.log(err);
        break;
    }
  }
}
export default new ErrorHandler();
