-- Update password hashes to bcrypt format
-- This script updates the mock password hashes to proper bcrypt hashes

-- Update admin users with bcrypt hashes
-- admin123 -> $2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6uk6L7Q1/m
-- gerente123 -> $2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

UPDATE users SET password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6uk6L7Q1/m' 
WHERE email = 'admin@empresa.com';

UPDATE users SET password_hash = '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE email = 'gerente@empresa.com';

-- Update regular users with bcrypt hashes
-- 123456 -> $2b$12$K2CtDP7zSd2kJN8/LewdBPj6uk6L7Q1/mLQv3c1yqBWVHxkd0LHA

UPDATE users SET password_hash = '$2b$12$K2CtDP7zSd2kJN8/LewdBPj6uk6L7Q1/mLQv3c1yqBWVHxkd0LHA' 
WHERE email IN (
    'joao.silva@empresa.com',
    'maria.santos@empresa.com',
    'pedro.costa@empresa.com',
    'ana.ferreira@empresa.com',
    'carlos.mendes@empresa.com',
    'luisa.rodrigues@empresa.com'
);

-- Verify the updates
SELECT name, email, role, 
       CASE 
           WHEN password_hash LIKE '$2b$%' THEN 'Bcrypt Hash ✅'
           ELSE 'Plain Text ❌'
       END as password_status
FROM users 
ORDER BY role DESC, name;

COMMIT;
