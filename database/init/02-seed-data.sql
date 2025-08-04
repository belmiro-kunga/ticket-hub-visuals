-- Ticket Hub Initial Data Script
-- This script inserts initial users, departments and sample data

-- Insert departments first
INSERT INTO departments (id, name, description, email, is_active) VALUES
(uuid_generate_v4(), 'Tecnologia da Informação', 'Departamento responsável pela infraestrutura e sistemas', 'ti@empresa.com', true),
(uuid_generate_v4(), 'Recursos Humanos', 'Departamento de gestão de pessoas e talentos', 'rh@empresa.com', true),
(uuid_generate_v4(), 'Financeiro', 'Departamento financeiro e contabilidade', 'financeiro@empresa.com', true),
(uuid_generate_v4(), 'Vendas', 'Departamento comercial e vendas', 'vendas@empresa.com', true),
(uuid_generate_v4(), 'Marketing', 'Departamento de marketing e comunicação', 'marketing@empresa.com', true),
(uuid_generate_v4(), 'Operações', 'Departamento de operações e logística', 'operacoes@empresa.com', true),
(uuid_generate_v4(), 'Administração', 'Departamento administrativo geral', 'admin@empresa.com', true),
(uuid_generate_v4(), 'Gerência', 'Gerência executiva', 'gerencia@empresa.com', true);

-- Insert admin users
INSERT INTO users (id, name, email, password_hash, phone, department, avatar, role, is_active) VALUES
(uuid_generate_v4(), 'Administrador Sistema', 'admin@empresa.com', '$2b$10$rQZ8kJxHfXvQZGtVxJxHfO8kJxHfXvQZGtVxJxHfO8kJxHfXvQZG', '+244 900 000 000', 'Administração', 'AD', 'admin', true),
(uuid_generate_v4(), 'Gerente Geral', 'gerente@empresa.com', '$2b$10$rQZ8kJxHfXvQZGtVxJxHfO8kJxHfXvQZGtVxJxHfO8kJxHfXvQZG', '+244 900 000 001', 'Gerência', 'GG', 'admin', true);

-- Insert regular users
INSERT INTO users (id, name, email, password_hash, phone, department, avatar, role, is_active) VALUES
(uuid_generate_v4(), 'João Silva', 'joao.silva@empresa.com', '$2b$10$rQZ8kJxHfXvQZGtVxJxHfO8kJxHfXvQZGtVxJxHfO8kJxHfXvQZG', '+244 923 456 789', 'Tecnologia da Informação', 'JS', 'user', true),
(uuid_generate_v4(), 'Maria Santos', 'maria.santos@empresa.com', '$2b$10$rQZ8kJxHfXvQZGtVxJxHfO8kJxHfXvQZGtVxJxHfO8kJxHfXvQZG', '+244 924 567 890', 'Recursos Humanos', 'MS', 'user', true),
(uuid_generate_v4(), 'Pedro Costa', 'pedro.costa@empresa.com', '$2b$10$rQZ8kJxHfXvQZGtVxJxHfO8kJxHfXvQZGtVxJxHfO8kJxHfXvQZG', '+244 925 678 901', 'Financeiro', 'PC', 'user', true),
(uuid_generate_v4(), 'Ana Ferreira', 'ana.ferreira@empresa.com', '$2b$10$rQZ8kJxHfXvQZGtVxJxHfO8kJxHfXvQZGtVxJxHfXvQZGtVxJxHfO8kJxHfXvQZG', '+244 926 789 012', 'Vendas', 'AF', 'user', true),
(uuid_generate_v4(), 'Carlos Mendes', 'carlos.mendes@empresa.com', '$2b$10$rQZ8kJxHfXvQZGtVxJxHfO8kJxHfXvQZGtVxJxHfO8kJxHfXvQZG', '+244 927 890 123', 'Marketing', 'CM', 'user', true),
(uuid_generate_v4(), 'Luisa Rodrigues', 'luisa.rodrigues@empresa.com', '$2b$10$rQZ8kJxHfXvQZGtVxJxHfO8kJxHfXvQZGtVxJxHfO8kJxHfXvQZG', '+244 928 901 234', 'Operações', 'LR', 'user', true);

-- Insert sample tickets for demonstration
DO $$
DECLARE
    user_joao UUID;
    user_maria UUID;
    user_pedro UUID;
    user_ana UUID;
    admin_user UUID;
    ticket_1 UUID;
    ticket_2 UUID;
    ticket_3 UUID;
    ticket_4 UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO user_joao FROM users WHERE email = 'joao.silva@empresa.com';
    SELECT id INTO user_maria FROM users WHERE email = 'maria.santos@empresa.com';
    SELECT id INTO user_pedro FROM users WHERE email = 'pedro.costa@empresa.com';
    SELECT id INTO user_ana FROM users WHERE email = 'ana.ferreira@empresa.com';
    SELECT id INTO admin_user FROM users WHERE email = 'admin@empresa.com';

    -- Insert sample tickets
    INSERT INTO tickets (id, user_id, subject, description, category, priority, urgency, affected_users, business_impact, status, assigned_to) VALUES
    (uuid_generate_v4(), user_joao, 'Problema de acesso ao sistema', 'Não consigo fazer login no sistema desde ontem. Aparece mensagem de erro "Credenciais inválidas" mesmo com senha correta.', 'conta_acesso', 'alta', 'mais_rapido_possivel', 'apenas_eu', 'Não consigo trabalhar sem acesso ao sistema principal', 'em_andamento', admin_user),
    (uuid_generate_v4(), user_maria, 'Erro no relatório de RH', 'O relatório mensal de funcionários está apresentando dados incorretos na seção de férias.', 'erro_sistema', 'media', 'em_breve', 'poucos', 'Relatórios incorretos podem afetar decisões de gestão', 'aberto', NULL),
    (uuid_generate_v4(), user_pedro, 'Solicitação de nova funcionalidade', 'Gostaria de solicitar a implementação de um dashboard financeiro com gráficos em tempo real.', 'nova_funcionalidade', 'baixa', 'posso_aguardar', 'alguns', 'Melhoraria a visualização dos dados financeiros', 'pendente', admin_user),
    (uuid_generate_v4(), user_ana, 'Sistema de vendas lento', 'O sistema de vendas está muito lento hoje, demora mais de 30 segundos para carregar as páginas.', 'problema_tecnico', 'urgente', 'critico', 'muitos', 'Vendas paradas devido à lentidão do sistema', 'resolvido', admin_user);

    -- Get ticket IDs for status history
    SELECT id INTO ticket_1 FROM tickets WHERE subject = 'Problema de acesso ao sistema';
    SELECT id INTO ticket_2 FROM tickets WHERE subject = 'Erro no relatório de RH';
    SELECT id INTO ticket_3 FROM tickets WHERE subject = 'Solicitação de nova funcionalidade';
    SELECT id INTO ticket_4 FROM tickets WHERE subject = 'Sistema de vendas lento';

    -- Insert additional status history (the trigger will create the initial ones)
    INSERT INTO ticket_status_history (ticket_id, status, changed_by, comment, created_at) VALUES
    (ticket_1, 'aberto', user_joao, 'Ticket criado pelo usuário', NOW() - INTERVAL '2 days'),
    (ticket_1, 'em_andamento', admin_user, 'Investigando o problema de acesso', NOW() - INTERVAL '1 day'),
    
    (ticket_3, 'aberto', user_pedro, 'Solicitação de nova funcionalidade enviada', NOW() - INTERVAL '5 days'),
    (ticket_3, 'pendente', admin_user, 'Aguardando aprovação da diretoria', NOW() - INTERVAL '3 days'),
    
    (ticket_4, 'aberto', user_ana, 'Relatado problema de performance', NOW() - INTERVAL '1 day'),
    (ticket_4, 'em_andamento', admin_user, 'Investigando causa da lentidão', NOW() - INTERVAL '8 hours'),
    (ticket_4, 'resolvido', admin_user, 'Problema resolvido - servidor reiniciado e cache limpo', NOW() - INTERVAL '2 hours');

END $$;

-- Update department managers
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'admin@empresa.com') WHERE name = 'Administração';
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'gerente@empresa.com') WHERE name = 'Gerência';
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'joao.silva@empresa.com') WHERE name = 'Tecnologia da Informação';
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'maria.santos@empresa.com') WHERE name = 'Recursos Humanos';
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'pedro.costa@empresa.com') WHERE name = 'Financeiro';
UPDATE departments SET manager_id = (SELECT id FROM users WHERE email = 'ana.ferreira@empresa.com') WHERE name = 'Vendas';

COMMIT;
