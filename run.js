const MultiSiteAutomation = require('./script.js');
const express = require('express');
const fs = require('fs').promises;

const targetUsername = 'comedor_di_primas';
const followerCount = 500;
const accountsFilePath = './accounts.txt'; // Caminho para o arquivo de contas

async function readAccounts(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');
        return lines.map(line => {
            const [username, password] = line.split(' ');
            return { username, password };
        });
    } catch (error) {
        console.error('Erro ao ler o arquivo de contas:', error.message);
        return [];
    }
}

async function startAutomation() {
    const accounts = await readAccounts(accountsFilePath);

    if (accounts.length === 0) {
        console.error('Nenhuma conta encontrada no arquivo accounts.txt. Por favor, adicione suas contas.');
        return;
    }

    while (true) { // loop infinito aqui fora
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            console.log(`Iniciando automação para a conta: ${account.username}`);

            const automation = new MultiSiteAutomation(account.username, account.password);
            await automation.initBrowser();
            
            // 🚀 novo método: processa só 1 ciclo dos sites
            await automation.runOneCycle(targetUsername, followerCount);
            
            await automation.closeBrowser();

            // Se não for a última conta, espera 5 minutos
            if (i < accounts.length - 1) {
                console.log("⏳ Aguardando 5 minutos antes da próxima conta...");
                await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
            }
        }

        // Quando terminar TODAS as contas, espera 1h30min
        console.log("⏳ Todas as contas processadas. Aguardando 1h30min antes de reiniciar...");
        await new Promise(resolve => setTimeout(resolve, 90 * 60 * 1000));
    }
}

// Instalar chalk se não estiver presente
async function installDependencies() {
    try {
        require.resolve('chalk');
    } catch (e) {
        console.log('Instalando chalk...');
        const { exec } = require('child_process');
        await new Promise((resolve, reject) => {
            exec('npm install chalk', (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return reject(error);
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
                resolve();
            });
        });
    }
}

installDependencies().then(() => {
    startAutomation();
});

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Automação de múltiplos sites está rodando!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});



