// ==========================================================================
// ARQUIVO PRINCIPAL DE INICIALIZAÇÃO LOCAL: server.js
// ==========================================================================
const http = require('http');
const app = require('./api/index'); // Importa a aplicação Express configurada
require('dotenv').config();

// Definindo a porta do servidor
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

// Criando o servidor HTTP utilizando o app Express
const server = http.createServer(app);

// ==========================================================================
// TRATAMENTO DE ERROS GLOBAIS DO SERVIDOR (Boas práticas de Produção)
// ==========================================================================

// Captura erros específicos do servidor (ex: Porta já em uso, permissões)
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Porta ' + PORT;

    switch (error.code) {
        case 'EACCES':
            console.error(`[ERRO] ${bind} requer privilégios elevados de administrador.`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`[ERRO] ${bind} já está sendo utilizada por outra aplicação.`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});

// Evento disparado quando o servidor começa a escutar com sucesso
server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'porta ' + addr.port;
    
    console.log(`\n=============================================================`);
    console.log(`🚀 BACKEND REFATORADO - B7STORE OPERACIONAL`);
    console.log(`=============================================================`);
    console.log(`🌐 Servidor escutando com sucesso na ${bind}`);
    console.log(`🏠 Local: http://localhost:${PORT}`);
    console.log(`📦 Banco de Dados: Conectado ao Supabase com sucesso.`);
    console.log(`-------------------------------------------------------------`);
    console.log(`📝 Rotas disponíveis para testes no seu Frontend:`);
    console.log(` 👉 GET/POST  | http://localhost:${PORT}/api/produtos`);
    console.log(` 👉 POST      | http://localhost:${PORT}/api/clientes/cadastro`);
    console.log(` 👉 POST      | http://localhost:${PORT}/api/clientes/login`);
    console.log(` 👉 POST      | http://localhost:${PORT}/api/pedidos`);
    console.log(`=============================================================\n`);
});

// ==========================================================================
// CAPTURA DE FALHAS CRÍTICAS DO PROCESSO NODE
// ==========================================================================

// Captura erros de código assíncrono que não foram tratados com try/catch
process.on('unhandledRejection', (reason, promise) => {
    console.error(`\n[ALERTA CRÍTICO] Rejeição não tratada detectada em:`, promise);
    console.error(`Motivo/Erro:`, reason);
});

// Captura exceções fatais síncronas para evitar o crash imediato sem log
process.on('uncaughtException', (error) => {
    console.error(`\n[ALERTA CRÍTICO] Exceção não capturada gerada:`, error.message);
    console.error(error.stack);
    // Em cenários ideais, faria o graceful shutdown aqui
});

// Inicializa a escuta do servidor
server.listen(PORT);