const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido ou formato inválido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Você pode guardar o userId para usar depois
    next(); // Libera o acesso à próxima função
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
