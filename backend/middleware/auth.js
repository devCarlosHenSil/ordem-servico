const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'd0d4f9738e27ae26749736c1227055d41cf7fefae46c60d4ff2d86e36184f263bce2c02b4df889d11f5a172d5f79a8a99298d499c7b92eb86c4084d337a7f965';

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verificarToken;
