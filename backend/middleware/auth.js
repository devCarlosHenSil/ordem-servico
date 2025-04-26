// backend/middlewares/auth.js

const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  // 1) Pega o header Authorization
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Token não fornecido ou formato inválido' });
  }

  // 2) Extrai o token
  const token = authHeader.split(' ')[1];

  try {
    // 3) Verifica e decodifica
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4) Usa o id presente no payload (payload = { id, email })
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
