const AuthService = require('../services/authService');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso requerido'
      });
    }

    const verification = await AuthService.verifySession(token);
    
    if (!verification.success) {
      return res.status(401).json({
        success: false,
        message: verification.message
      });
    }

    req.user = verification.user;
    req.tokenData = verification.decoded;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Middleware to verify admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação requerida'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Acesso administrativo requerido'
    });
  }

  next();
};

// Middleware to verify user role (regular user)
const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação requerida'
    });
  }

  if (req.user.role !== 'user') {
    return res.status(403).json({
      success: false,
      message: 'Acesso de usuário requerido'
    });
  }

  next();
};

// Middleware to verify either admin or user role
const requireAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Autenticação requerida'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireUser,
  requireAuthenticated
};
