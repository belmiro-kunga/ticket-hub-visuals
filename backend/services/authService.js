const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

class AuthService {
  // Hash password
  static async hashPassword(password) {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  // Compare password
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'ticket-hub',
      audience: 'ticket-hub-users'
    });
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET, {
        issuer: 'ticket-hub',
        audience: 'ticket-hub-users'
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Find user by email
  static async findUserByEmail(email) {
    try {
      const result = await query(
        'SELECT id, name, email, password_hash, phone, department, avatar, role, is_active, last_login FROM users WHERE email = $1 AND is_active = true',
        [email]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new Error('Database error');
    }
  }

  // Update last login
  static async updateLastLogin(userId) {
    try {
      await query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [userId]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      // Don't throw error as this is not critical
    }
  }

  // Login user (regular users)
  static async loginUser(email, password) {
    try {
      // Find user by email
      const user = await this.findUserByEmail(email);
      
      if (!user) {
        return { success: false, message: 'Credenciais inválidas' };
      }

      // Check if user role is 'user' (not admin)
      if (user.role !== 'user') {
        return { success: false, message: 'Acesso negado. Use o login administrativo.' };
      }

      // Compare password
      const isPasswordValid = await this.comparePassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        return { success: false, message: 'Credenciais inválidas' };
      }

      // Update last login
      await this.updateLastLogin(user.id);

      // Remove password from user object
      const { password_hash, ...userWithoutPassword } = user;

      // Generate token
      const token = this.generateToken(userWithoutPassword);

      return {
        success: true,
        user: userWithoutPassword,
        token,
        message: 'Login realizado com sucesso'
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  // Login admin (admin users)
  static async loginAdmin(email, password) {
    try {
      // Find user by email
      const user = await this.findUserByEmail(email);
      
      if (!user) {
        return { success: false, message: 'Credenciais administrativas inválidas' };
      }

      // Check if user role is 'admin'
      if (user.role !== 'admin') {
        return { success: false, message: 'Acesso administrativo negado' };
      }

      // Compare password
      const isPasswordValid = await this.comparePassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        return { success: false, message: 'Credenciais administrativas inválidas' };
      }

      // Update last login
      await this.updateLastLogin(user.id);

      // Remove password from user object
      const { password_hash, ...userWithoutPassword } = user;

      // Generate token
      const token = this.generateToken(userWithoutPassword);

      return {
        success: true,
        user: userWithoutPassword,
        token,
        message: 'Login administrativo realizado com sucesso'
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, message: 'Erro interno do servidor' };
    }
  }

  // Get user by ID
  static async getUserById(userId) {
    try {
      const result = await query(
        'SELECT id, name, email, phone, department, avatar, role, is_active, created_at, last_login FROM users WHERE id = $1 AND is_active = true',
        [userId]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new Error('Database error');
    }
  }

  // Verify user session
  static async verifySession(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await this.getUserById(decoded.id);
      
      if (!user) {
        return { success: false, message: 'Usuário não encontrado' };
      }

      return {
        success: true,
        user,
        decoded
      };
    } catch (error) {
      return { success: false, message: 'Sessão inválida ou expirada' };
    }
  }
}

module.exports = AuthService;
