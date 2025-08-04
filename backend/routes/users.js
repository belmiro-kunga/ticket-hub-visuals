const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for user creation
const createUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { success: false, message: 'Muitas tentativas de criação de usuário. Tente novamente em 15 minutos.' }
});

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📊 Fetching all users...');
    
    const query = `
      SELECT 
        id, name, email, phone, department, role, is_active, 
        created_at, last_login, avatar, default_priority,
        (SELECT COUNT(*) FROM tickets WHERE assigned_to = users.id) as tickets_assigned,
        (SELECT COUNT(*) FROM tickets WHERE assigned_to = users.id AND status = 'resolvido') as tickets_resolved
      FROM users 
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query);
    
    const users = result.rows.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.is_active ? 'active' : 'inactive',
      department: user.department,
      joinDate: user.created_at,
      lastLogin: user.last_login,
      ticketsAssigned: parseInt(user.tickets_assigned) || 0,
      ticketsResolved: parseInt(user.tickets_resolved) || 0,
      avatar: user.avatar,
      defaultPriority: user.default_priority,
      permissions: [] // TODO: Implement permissions system
    }));
    
    console.log(`✅ Found ${users.length} users`);
    res.json({ success: true, users });
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao buscar usuários' 
    });
  }
});

// Get user by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso negado' 
      });
    }
    
    const query = `
      SELECT 
        id, name, email, phone, department, role, is_active, 
        created_at, last_login, avatar
      FROM users 
      WHERE id = $1
    `;
    
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }
    
    const user = result.rows[0];
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.is_active ? 'active' : 'inactive',
        department: user.department,
        joinDate: user.created_at,
        lastLogin: user.last_login,
        avatar: user.avatar
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao buscar usuário' 
    });
  }
});

// Create new user (admin only)
router.post('/', authenticateToken, requireAdmin, createUserLimiter, async (req, res) => {
  try {
    const { name, email, password, phone, department, role, defaultPriority } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !department || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome, email, senha, departamento e função são obrigatórios' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Formato de email inválido' 
      });
    }
    
    // Validate role
    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Função inválida. Use: admin ou user' 
      });
    }
    
    // Validate priority (optional, defaults to 'media')
    const validPriorities = ['baixa', 'media', 'alta', 'urgente'];
    const priority = defaultPriority || 'media';
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prioridade inválida. Use: baixa, media, alta ou urgente' 
      });
    }
    
    // Check if email already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email já está em uso' 
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Generate user ID
    const userId = uuidv4();
    
    // Insert new user
    const insertQuery = `
      INSERT INTO users (
        id, name, email, password_hash, phone, department, role, default_priority,
        is_active, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW()
      ) RETURNING id, name, email, phone, department, role, default_priority, created_at
    `;
    
    const result = await db.query(insertQuery, [
      userId, name, email.toLowerCase(), passwordHash, 
      phone || null, department, role, priority
    ]);
    
    const newUser = result.rows[0];
    
    console.log(`✅ User created successfully: ${newUser.email}`);
    
    res.status(201).json({ 
      success: true, 
      message: 'Usuário criado com sucesso',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        status: 'active',
        department: newUser.department,
        joinDate: newUser.created_at
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao criar usuário' 
    });
  }
});

// Update user (admin only or own profile)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone, department, role, status, defaultPriority } = req.body;
    
    // Users can only update their own profile unless they're admin
    const isOwnProfile = req.user.id === id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Acesso negado' 
      });
    }
    
    // Only admins can change role and status
    if (!isAdmin && (role || status)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Apenas administradores podem alterar função e status' 
      });
    }
    
    // Check if user exists
    const existingUser = await db.query(
      'SELECT id, email FROM users WHERE id = $1',
      [id]
    );
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Check if email is being changed and if it's already in use
    if (email && email.toLowerCase() !== existingUser.rows[0].email) {
      const emailCheck = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email.toLowerCase(), id]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: 'Email já está em uso' 
        });
      }
    }
    
    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    
    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email.toLowerCase());
    }
    
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone || null);
    }
    
    if (department) {
      updates.push(`department = $${paramCount++}`);
      values.push(department);
    }
    
    if (role && isAdmin) {
      updates.push(`role = $${paramCount++}`);
      values.push(role);
    }
    
    if (status && isAdmin) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(status === 'active');
    }
    
    if (password) {
      // Hash the new password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      updates.push(`password_hash = $${paramCount++}`);
      values.push(passwordHash);
    }
    
    if (defaultPriority) {
      // Validate priority
      const validPriorities = ['baixa', 'media', 'alta', 'urgente'];
      if (validPriorities.includes(defaultPriority)) {
        updates.push(`default_priority = $${paramCount++}`);
        values.push(defaultPriority);
      }
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nenhum campo para atualizar' 
      });
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    const updateQuery = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, department, role, is_active, default_priority, updated_at
    `;
    
    const result = await db.query(updateQuery, values);
    const updatedUser = result.rows[0];
    
    console.log(`✅ User updated successfully: ${updatedUser.email}`);
    
    res.json({ 
      success: true, 
      message: 'Usuário atualizado com sucesso',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.is_active ? 'active' : 'inactive',
        department: updatedUser.department,
        defaultPriority: updatedUser.default_priority,
        updatedAt: updatedUser.updated_at
      }
    });
    
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao atualizar usuário' 
    });
  }
});

// Delete user (admin only) - Soft delete (deactivate)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Não é possível excluir sua própria conta' 
      });
    }
    
    // Check if user exists
    const existingUser = await db.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [id]
    );
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Instead of deleting, deactivate the user to preserve data integrity
    await db.query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
      [id]
    );
    
    const user = existingUser.rows[0];
    console.log(`✅ User deactivated successfully: ${user.email}`);
    
    res.json({ 
      success: true, 
      message: 'Usuário desativado com sucesso' 
    });
    
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao excluir usuário' 
    });
  }
});

// Hard delete user (admin only) - Permanently remove from database
router.delete('/:id/hard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Não é possível excluir sua própria conta' 
      });
    }
    
    // Check if user exists
    const existingUser = await db.query(
      'SELECT id, name, email FROM users WHERE id = $1',
      [id]
    );
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }
    
    // Permanently delete the user
    await db.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    
    const user = existingUser.rows[0];
    console.log(`🗑️ User permanently deleted: ${user.email}`);
    
    res.json({ 
      success: true, 
      message: 'Usuário excluído permanentemente' 
    });
    
  } catch (error) {
    console.error('❌ Error hard deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao excluir usuário' 
    });
  }
});

// Reactivate user (admin only)
router.patch('/:id/reactivate', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const existingUser = await db.query(
      'SELECT id, name, email, is_active FROM users WHERE id = $1',
      [id]
    );
    
    if (existingUser.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }
    
    const user = existingUser.rows[0];
    
    if (user.is_active) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuário já está ativo' 
      });
    }
    
    // Reactivate the user
    await db.query(
      'UPDATE users SET is_active = true, updated_at = NOW() WHERE id = $1',
      [id]
    );
    
    console.log(`✅ User reactivated: ${user.email}`);
    
    res.json({ 
      success: true, 
      message: 'Usuário reativado com sucesso' 
    });
    
  } catch (error) {
    console.error('❌ Error reactivating user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao reativar usuário' 
    });
  }
});

// Get user statistics (admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE is_active = true) as active_users,
        COUNT(*) FILTER (WHERE is_active = false) as inactive_users,
        COUNT(*) FILTER (WHERE role = 'admin') as admin_users,
        COUNT(*) FILTER (WHERE role = 'user') as regular_users,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_month
      FROM users
    `;
    
    const result = await db.query(statsQuery);
    const stats = result.rows[0];
    
    res.json({ 
      success: true, 
      stats: {
        total: parseInt(stats.total_users),
        active: parseInt(stats.active_users),
        inactive: parseInt(stats.inactive_users),
        admins: parseInt(stats.admin_users),
        regular: parseInt(stats.regular_users),
        newThisMonth: parseInt(stats.new_users_month)
      }
    });
    
  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor ao buscar estatísticas' 
    });
  }
});

module.exports = router;
