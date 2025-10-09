/**
 * 🚀 INDEX.TS - Servidor Principal
 *
 * Este é o arquivo principal que inicia o servidor Express.
 * Configurações, middlewares e rotas são definidos aqui.
 */

// ========================================
// IMPORTAÇÕES
// ========================================

// Express: framework web
import express, { Application } from 'express'

// CORS: permite requisições de outros domínios
import cors from 'cors'

// Helmet: adiciona segurança HTTP
import helmet from 'helmet'

// Rotas da aplicação
import routes from './routes'

// ========================================
// CONFIGURAÇÕES
// ========================================

/**
 * Porta onde o servidor irá rodar
 * Tenta usar variável de ambiente PORT, senão usa 3000
 */
const PORT = parseInt(process.env.PORT || '3000', 10)

// ========================================
// CRIAR APLICAÇÃO EXPRESS
// ========================================

/**
 * Cria a aplicação Express
 * Esta é a base do nosso servidor
 */
const app: Application = express()

// ========================================
// MIDDLEWARES
// ========================================

/**
 * Middlewares são funções que executam ANTES das rotas.
 * Eles processam a requisição antes de chegar no controller.
 */

// 🔒 HELMET
// Adiciona headers de segurança HTTP
// Protege contra ataques comuns
app.use(helmet())

// 🌐 CORS
// Permite que outros sites/apps acessem a API
// Sem isso, apenas o mesmo domínio poderia fazer requisições
app.use(cors())

// 📦 JSON PARSER
// Converte o body das requisições de JSON para objeto JavaScript
// Exemplo: '{"name":"João"}' vira { name: "João" }
app.use(express.json())

// ========================================
// ROTAS
// ========================================

/**
 * Rota de Health Check
 * Serve para verificar se o servidor está funcionando
 * Acesse: http://localhost:3000/health
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando perfeitamente!',
    timestamp: new Date().toISOString(),
  })
})

/**
 * Rotas da API
 * Todas as rotas começam com /api
 *
 * Exemplos de rotas disponíveis:
 * - GET    /api/students
 * - GET    /api/students/:id
 * - POST   /api/students
 * - PUT    /api/students/:id
 * - DELETE /api/students/:id
 */
app.use('/api', routes)

// ========================================
// INICIAR SERVIDOR
// ========================================

/**
 * Função que inicia o servidor HTTP
 * Faz o servidor "escutar" requisições na porta configurada
 */
function iniciarServidor(): void {
  app.listen(PORT, () => {
    // Mensagens exibidas quando o servidor inicia
    console.log(`🚀 Servidor rodando na porta ${PORT}`)
    console.log(`📬 Health check: http://localhost:${PORT}/health`)
    console.log(`📚 API Usuarios: http://localhost:${PORT}/api/user`)
    console.log(`\n✨ Tudo pronto! Use as rotas acima para testar.\n`)
  })
}

// Chama a função para iniciar o servidor
iniciarServidor()