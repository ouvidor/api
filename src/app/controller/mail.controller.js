import Mail from '../../lib/Mail';

class MailController {
  // envia um email
  async save(req, res) {
    const { title, text, secretary } = req.body;

    try {
      await Mail.sendMail({
        to: `${secretary.title} <${secretary.email}>`,
        subject: `[Ouvidoria] - ${title}`,
        template: 'manifestation',
        // variáveis a serem usadas no template
        context: { text },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json(`Não pode enviar o email: ${title}`);
    }

    return res.status(200).json(`Email: ${title}. enviado com sucesso`);
  }
} // fim da classe

export default new MailController();
