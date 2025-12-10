import MultiSiteAutomation from './script.js';
import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import fs from 'fs/promises';

const targetUsername = 'comedor_di_primas';
const followerCount = 500;
const accountsFilePath = './accounts.txt'; // Caminho para o arquivo de contas

const wsClients = new Set();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Endpoint WebSocket para logs
wss.on('connection', (ws) => {
    wsClients.add(ws);
    console.log('✓ Cliente conectado ao console');

    ws.on('close', () => {
        wsClients.delete(ws);
        console.log('✗ Cliente desconectado');
    });

    ws.on('error', (error) => {
        console.error('Erro WebSocket:', error);
    });
});

// Função para enviar logs para todos os clientes WebSocket
function broadcastLog(message, type = 'info') {
    const logMessage = JSON.stringify({ message, type });
    
    // Enviar para todos os clientes WebSocket conectados
    wsClients.forEach((client) => {
        if (client.readyState === 1) { // 1 = OPEN
            try {
                client.send(logMessage);
            } catch (err) {
                console.error('Erro ao enviar log:', err);
            }
        }
    });
    
    // Também imprimir no console do servidor
    console.log(`[${type.toUpperCase()}] ${message}`);
}

async function readAccounts(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');
        return lines.map(line => {
            const [username, password] = line.split(' ');
            return { username, password };
        });
    } catch (error) {
        broadcastLog(`Erro ao ler o arquivo de contas: ${error.message}`, 'error');
        return [];
    }
}

async function startAutomation() {
    const accounts = await readAccounts(accountsFilePath);

    if (accounts.length === 0) {
        broadcastLog('Nenhuma conta encontrada no arquivo accounts.txt. Por favor, adicione suas contas.', 'error');
        return;
    }

    broadcastLog(`✓ ${accounts.length} contas carregadas`, 'success');

    while (true) { // loop infinito aqui fora
        broadcastLog('🚀 Iniciando ciclo de automação...', 'info');
        broadcastLog('📊 Carregando contas...', 'info');

        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            broadcastLog(`⏳ Processando ${account.username} (${i + 1}/${accounts.length})...`, 'info');

            try {
                const automation = new MultiSiteAutomation(account.username, account.password);
                await automation.initBrowser();
                
                // 🚀 novo método: processa só 1 ciclo dos sites
                await automation.runOneCycle(targetUsername, followerCount);
                
                await automation.closeBrowser();

                broadcastLog(`✓ ${account.username} processada com sucesso`, 'success');
            } catch (error) {
                broadcastLog(`✗ Erro ao processar ${account.username}: ${error.message}`, 'error');
            }

            // Se não for a última conta, espera 5 minutos
            if (i < accounts.length - 1) {
                broadcastLog('⏳ Aguardando 5 minutos antes da próxima conta...', 'info');
                await new Promise(resolve => setTimeout(resolve, 5 * 60 * 1000));
            }
        }

        // Quando terminar TODAS as contas, espera 1h30min
        broadcastLog('✓ Todas as contas processadas!', 'success');
        broadcastLog('⏳ Aguardando 1h30min antes de reiniciar...', 'info');
        await new Promise(resolve => setTimeout(resolve, 90 * 60 * 1000));
    }
}

// Dependências já instaladas via pnpm

// Rotas HTTP
app.get('/', (req, res) => {
    res.send('Automação de múltiplos sites está rodando!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    broadcastLog(`Servidor rodando na porta ${PORT}`, 'success');
});

// Iniciar automação
startAutomation().catch(err => {
    broadcastLog(`Erro ao iniciar: ${err.message}`, 'error');
});
