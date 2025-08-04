const bcrypt = require('bcryptjs');

async function generateHashes() {
    const passwords = {
        'admin123': 'admin@empresa.com',
        'gerente123': 'gerente@empresa.com',
        '123456': 'usuarios regulares'
    };

    console.log('Gerando hashes bcrypt para as senhas:');
    console.log('=====================================');

    for (const [password, description] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(password, 12);
        console.log(`\nSenha: ${password} (${description})`);
        console.log(`Hash: ${hash}`);
        console.log(`Verificação: ${await bcrypt.compare(password, hash) ? '✅ OK' : '❌ ERRO'}`);
    }
}

generateHashes().catch(console.error);
