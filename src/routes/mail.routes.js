import { Router } from 'express';

import MailValidator from '../middlewares/validators/Mail';
import Mail from '../lib/Mail';

const mailRoutes = Router();

mailRoutes.post('/', MailValidator, async (request, response) => {
  const { title, text, email } = request.body;

  try {
    await Mail.sendMail({
      to: `Secretária <${email}>`,
      subject: `[Ouvidoria] - ${title}`,
      template: 'manifestation',
      // variáveis a serem usadas no template
      context: { text },
    });
  } catch (err) {
    return response
      .status(500)
      .json({ error: `Não pode enviar o email: ${title}` });
  }

  return response
    .status(200)
    .json({ message: `Email: ${title}. enviado com sucesso` });
});

export default mailRoutes;
