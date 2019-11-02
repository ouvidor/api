/**
 * Esse middleware checa a maior Role do usuário e
 * previne que o usuário acesse camadas que não em acesso
 */

function getMostImportantLevel(roles) {
  if (!roles) {
    throw new Error('Necessário um token');
  }

  const levels = roles.map(role => role.level);

  if (!levels) {
    throw new Error('Token invalido');
  }

  return Math.min(levels);
}

class Roles {
  admin(req, res, next) {
    try {
      const highestLevel = getMostImportantLevel(req.user_roles);
      if (highestLevel > 2) {
        return res.status(401).json({ error: 'Acesso exclusivo para Admins' });
      }

      return next();
    } catch (err) {
      console.log(err);
      return res.status(401).json(err);
    }
  }

  adminMaster(req, res, next) {
    try {
      const highestLevel = getMostImportantLevel(req.user_roles);

      if (highestLevel > 1) {
        return res
          .status(401)
          .json({ error: 'Acesso exclusivo para Admins Master' });
      }

      return next();
    } catch (err) {
      console.log(err);
      return res.status(401).json(err);
    }
  }
}

export default new Roles();
