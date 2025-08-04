-- Update passwords with correct bcrypt hashes
-- Generated hashes for the actual passwords

-- Admin users
UPDATE users SET password_hash = '$2a$12$RTB8cbIhHSMcrUyeAp3Ivef33LnmbHgD5CLRxIS7tcY12WzWous8e' 
WHERE email = 'admin@empresa.com';

UPDATE users SET password_hash = '$2a$12$kB9hZfqzypqrKwV9waHiqumsynbVK3UCiIGHc/mJ.HNGR97tnBEFe' 
WHERE email = 'gerente@empresa.com';

-- Regular users (password: 123456)
UPDATE users SET password_hash = '$2a$12$2CYVyPSoyuaAjPFDOjY7oe.jG4ieW0u02IOYED7jF5ysPgvq4wQba' 
WHERE email = 'joao.silva@empresa.com';

UPDATE users SET password_hash = '$2a$12$2CYVyPSoyuaAjPFDOjY7oe.jG4ieW0u02IOYED7jF5ysPgvq4wQba' 
WHERE email = 'maria.santos@empresa.com';

UPDATE users SET password_hash = '$2a$12$2CYVyPSoyuaAjPFDOjY7oe.jG4ieW0u02IOYED7jF5ysPgvq4wQba' 
WHERE email = 'pedro.costa@empresa.com';

UPDATE users SET password_hash = '$2a$12$2CYVyPSoyuaAjPFDOjY7oe.jG4ieW0u02IOYED7jF5ysPgvq4wQba' 
WHERE email = 'ana.ferreira@empresa.com';

UPDATE users SET password_hash = '$2a$12$2CYVyPSoyuaAjPFDOjY7oe.jG4ieW0u02IOYED7jF5ysPgvq4wQba' 
WHERE email = 'carlos.mendes@empresa.com';

UPDATE users SET password_hash = '$2a$12$2CYVyPSoyuaAjPFDOjY7oe.jG4ieW0u02IOYED7jF5ysPgvq4wQba' 
WHERE email = 'luisa.rodrigues@empresa.com';

-- Verify the updates
SELECT name, email, LENGTH(password_hash) as hash_length,
       CASE 
           WHEN LENGTH(password_hash) = 60 THEN 'Hash Completo ✅'
           ELSE 'Hash Incompleto ❌'
       END as hash_status
FROM users 
ORDER BY role DESC, name;
