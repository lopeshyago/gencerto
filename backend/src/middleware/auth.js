const jwt = require('jsonwebtoken');

const accessSecret = process.env.JWT_SECRET || process.env.SUPABASE_JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET || accessSecret;

// Middleware para rotas que exigem autenticação via JWT
const authenticateToken = (req, res, next) => {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, accessSecret);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    console.error('Erro na autenticação do token:', error);
    return res.status(401).json({ message: 'Não autorizado, token inválido.' });
  }
};

// Alias mantido para compatibilidade com o server.js
const protect = authenticateToken;

// Gera tokens curtos para autenticação das rotas
const generateToken = (userId) =>
  jwt.sign({ userId }, accessSecret, { expiresIn: '1h' });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, refreshSecret, { expiresIn: '7d' });

const verifyRefreshToken = (token) => jwt.verify(token, refreshSecret);

module.exports = {
  authenticateToken,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  protect,
};
