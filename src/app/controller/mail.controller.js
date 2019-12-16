import Mail from '../../lib/Mail';

class MailController {
  // envia um email
  async send(req, res) {
    const { title, text, email } = req.body;

    try {
      await Mail.sendMail({
        to: `Secretária <${email}>`,
        subject: `[Ouvidoria] - ${title}`,
        template: 'manifestation',
        // variáveis a serem usadas no template
        context: { text },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: `Não pode enviar o email: ${title}` });
    }

    return res
      .status(200)
      .json({ message: `Email: ${title}. enviado com sucesso` });
  }
} // fim da classe

export default new MailController();
