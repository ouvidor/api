/**
 * Esse middleware checa a maior Role do usuário e
 * previne que o usuário acesse camadas que não em acesso
 */
class Roles {
  admin(req, res, next) {
    try {
      if (req.user_role.id < 2) {
        return res.status(403).json({ error: 'Acesso exclusivo para Admins' });
      }

      return next();
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  adminMaster(req, res, next) {
    try {
      if (req.user_role.id < 3) {
        return res
          .status(403)
          .json({ error: 'Acesso exclusivo para Admins Master' });
      }

      return next();
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new Roles();
