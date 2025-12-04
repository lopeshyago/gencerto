const jwt = require('jsonwebtoken');

const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrai o token do cabeçalho: "Bearer TOKEN"
      token = req.headers.authorization.split(' ')[1];

      // Verifica o token usando o segredo JWT do Supabase
      const decoded = jwt.verify(token, supabaseJwtSecret);

      // Anexa os dados do usuário do token à requisição para uso posterior
      req.user = decoded;

      return next();
    } catch (error) {
      console.error('Erro na autenticação do token:', error);
      return res.status(401).json({ message: 'Não autorizado, token inválido.' });
    }
  }

  return res.status(401).json({ message: 'Não autorizado, nenhum token fornecido.' });
};

module.exports = { protect };