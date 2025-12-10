# Configuração WebSocket para Console em Tempo Real

## Como Funciona

O painel está configurado para se conectar a um servidor WebSocket e receber logs em tempo real. O console aparecerá automaticamente quando a página carregar, sem precisar clicar em nada.

## Integração com seu Servidor (run.js)

Para que os logs apareçam no painel, você precisa adicionar um endpoint WebSocket no seu servidor Node.js.

### Exemplo de Implementação (Express + ws)

```javascript
import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Array para armazenar conexões ativas
const clients = new Set();

// Endpoint WebSocket para logs
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Cliente conectado ao console');

  ws.on('close', () => {
    clients.remove(ws);
    console.log('Cliente desconectado');
  });

  ws.on('error', (error) => {
    console.error('Erro WebSocket:', error);
  });
});

// Função para enviar logs para todos os clientes conectados
export function broadcastLog(message, type = 'info') {
  const logMessage = JSON.stringify({ message, type });
  
  clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(logMessage);
    }
  });
  
  // Também imprimir no console do servidor
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// Usar em seu código
broadcastLog('🚀 Iniciando ciclo de automação...', 'info');
broadcastLog('✓ Conta processada com sucesso', 'success');
broadcastLog('✗ Erro ao processar conta', 'error');
broadcastLog('⚠ Aviso importante', 'warning');

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
```

### Tipos de Log Disponíveis

- `info` - Mensagens informativas (cor ciano)
- `success` - Sucesso (cor verde)
- `error` - Erros (cor vermelha)
- `warning` - Avisos (cor amarela)

### Exemplo de Uso no seu Script

```javascript
import { broadcastLog } from './server.js';

async function processarContas() {
  broadcastLog('📊 Carregando contas...', 'info');
  
  for (let i = 1; i <= 12; i++) {
    try {
      broadcastLog(`⏳ Processando conta_${i} (${i}/12)...`, 'info');
      // Seu código aqui
      broadcastLog(`✓ conta_${i} processada com sucesso`, 'success');
    } catch (error) {
      broadcastLog(`✗ Erro ao processar conta_${i}: ${error.message}`, 'error');
    }
  }
  
  broadcastLog('✓ Todas as contas processadas!', 'success');
  broadcastLog('📈 Ganho de seguidores: +150', 'success');
}
```

## Variáveis de Ambiente

Se você estiver usando uma URL diferente para o servidor, configure a variável de ambiente:

```bash
VITE_SERVER_URL=https://seu-app.onrender.com
```

Se não estiver definida, o painel usará `window.location.origin` (mesma origem).

## Testando Localmente

1. Implemente o WebSocket no seu servidor
2. Rode o servidor na porta 3000
3. Acesse `http://localhost:3000` no navegador
4. O console deve mostrar "✓ Conectado ao servidor"
5. Quando seu script enviar logs via `broadcastLog()`, eles aparecerão em tempo real

## No Render

1. Coloque todo o código (frontend + backend) no Render
2. Configure as variáveis de ambiente se necessário
3. O WebSocket funcionará automaticamente entre frontend e backend
4. Os logs aparecerão em tempo real no console do painel

## Troubleshooting

**Console mostra "Desconectado":**
- Verifique se o servidor está rodando
- Verifique se o endpoint `/ws/logs` existe
- Verifique o console do navegador para erros (F12)

**Logs não aparecem:**
- Certifique-se de usar `broadcastLog()` no seu código
- Verifique se os clientes WebSocket estão sendo adicionados ao Set
- Verifique se o WebSocket está no estado OPEN (readyState === 1)

**Erro de CORS:**
- Se estiver em domínios diferentes, configure CORS no servidor
- WebSocket não usa CORS, mas certifique-se que a conexão é permitida
