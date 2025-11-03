# 🎧 Huddle Notifier

> Never miss a team huddle again. Automatic notifications for Slack huddles with smart alerts and multi-language support.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Slack API](https://img.shields.io/badge/Slack-API-4A154B)](https://api.slack.com/)
[![Deployment](https://img.shields.io/badge/deploy-Railway-blueviolet)](https://railway.app/)

---

## 📖 Índice

- [Visão Geral](#-visão-geral)
- [Para Usuários Finais](#-para-usuários-finais)
- [Para Desenvolvedores](#-para-desenvolvedores)
- [Arquitetura Técnica](#-arquitetura-técnica)
- [Para Apresentação](#-para-apresentação)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Visão Geral

[![](https://mermaid.ink/img/pako:eNqNVc1u20YQfpUtc5VscklJFVEEJSkZFepYRhhfShnCmruSFiG5xGrpxDF8Kope2p7SW4ui6CHoqQ-hN-kT9BE6_JNJ0UZEQMLO6Jtvdj7OjO61UFCm2dpaknSD3riLBMGzzW5Kx0I7n72avXF2P-5-nfrIP3e8bxdaCcqfSyP49_efkM9ilAjFVzwku0-7vwQiit8S8KGQJCS6bkTgfUTE4hvJFNsiyUIhJUvg3ISaeyhZs4SSGBACUYY2GaVRG2sV2FPJYp5QBPDd35KHAiX5bTgwQ0FUVBFAVh465V7Mfd9B_vz8Ckr-ft6s1TeC__745R_0TZEcXRT1MolcoRoXeTw1WM8YUZlkyGjy5c-Z4QQTkCBUBGVbJpdlZctwQ5I1o9eHaDeYURChEBqlkseMSwGR2e5PyUUH7gXT5JYTBMJtQcJ4_0Lsr27k6cuvV1lEklweHnKRoSyuivsCQaWfOnSTAGoFPW00TZQkMqcrAxrQvbafVQN31MBO4ImYJBRSnBbtQWR_c5ihhLrBVVV21R02ooRHd_2tAoIsRfrY1vVOmJfXsG9WNIB2QSRvvFISvwqmvKQGzQYIMLkiHz922B4VmeUagiRVdzhrIclTqjzfeq-n3tVrf-4j53LWVAZMI3iiORC7hVa4bgFxUGFABMVseLNLsuwICECzBVyGJIqWnLYxVgCZ1EkqtuoV2-YN9NnxcacX07Pdz95s7jdLcGFN_PZDNTL1ikilKLZEI6mLC9xcrknCPxAkISAhiAqkoNWbQLMAOlm-EmASiFQgf1oyN3FWgZuV81_mTcrdFIr4YI8clHVpoH7_JYx9ZeK2abXM8tsvQ2CqSxsOlcOtHW7l8GqHVzkmTxHhmghXRLgmwhURrolwRYRbRHnztO-Ud0nHY3Y8Vvuej546YX3_SeF2jQPbrK9V2fjAtlodpO5gZqDoFY8i-4XlGAPL7W2VFG-Z_WK1WlXn_jtO1cY20_e9UERCFr81KS5rCqYbbECeQ-GjUOZRKOsYlFvfC7Ob4Yg-h8JHocyjUNZzKK0H__acaraSGetpMZMxyU3tPo9faGrDYrbQbDhSIt_mc_wAMSlJvhMirsOkyNYbzV6RaAtWllJYIxNOYMoeITBQTHoiS5RmG2ZBodn32nvN7ptD82RoWKY51AfD0WCMRz3tLvcbJ9ZoPBoNhwP4jHVsPfS0D0Ve48Qwx1-OBrpumDrWx6b58D9vx6HY?type=png)](https://mermaid.live/edit#pako:eNqNVc1u20YQfpUtc5VscklJFVEEJSkZFepYRhhfShnCmruSFiG5xGrpxDF8Kope2p7SW4ui6CHoqQ-hN-kT9BE6_JNJ0UZEQMLO6Jtvdj7OjO61UFCm2dpaknSD3riLBMGzzW5Kx0I7n72avXF2P-5-nfrIP3e8bxdaCcqfSyP49_efkM9ilAjFVzwku0-7vwQiit8S8KGQJCS6bkTgfUTE4hvJFNsiyUIhJUvg3ISaeyhZs4SSGBACUYY2GaVRG2sV2FPJYp5QBPDd35KHAiX5bTgwQ0FUVBFAVh465V7Mfd9B_vz8Ckr-ft6s1TeC__745R_0TZEcXRT1MolcoRoXeTw1WM8YUZlkyGjy5c-Z4QQTkCBUBGVbJpdlZctwQ5I1o9eHaDeYURChEBqlkseMSwGR2e5PyUUH7gXT5JYTBMJtQcJ4_0Lsr27k6cuvV1lEklweHnKRoSyuivsCQaWfOnSTAGoFPW00TZQkMqcrAxrQvbafVQN31MBO4ImYJBRSnBbtQWR_c5ihhLrBVVV21R02ooRHd_2tAoIsRfrY1vVOmJfXsG9WNIB2QSRvvFISvwqmvKQGzQYIMLkiHz922B4VmeUagiRVdzhrIclTqjzfeq-n3tVrf-4j53LWVAZMI3iiORC7hVa4bgFxUGFABMVseLNLsuwICECzBVyGJIqWnLYxVgCZ1EkqtuoV2-YN9NnxcacX07Pdz95s7jdLcGFN_PZDNTL1ikilKLZEI6mLC9xcrknCPxAkISAhiAqkoNWbQLMAOlm-EmASiFQgf1oyN3FWgZuV81_mTcrdFIr4YI8clHVpoH7_JYx9ZeK2abXM8tsvQ2CqSxsOlcOtHW7l8GqHVzkmTxHhmghXRLgmwhURrolwRYRbRHnztO-Ud0nHY3Y8Vvuej546YX3_SeF2jQPbrK9V2fjAtlodpO5gZqDoFY8i-4XlGAPL7W2VFG-Z_WK1WlXn_jtO1cY20_e9UERCFr81KS5rCqYbbECeQ-GjUOZRKOsYlFvfC7Ob4Yg-h8JHocyjUNZzKK0H__acaraSGetpMZMxyU3tPo9faGrDYrbQbDhSIt_mc_wAMSlJvhMirsOkyNYbzV6RaAtWllJYIxNOYMoeITBQTHoiS5RmG2ZBodn32nvN7ptD82RoWKY51AfD0WCMRz3tLvcbJ9ZoPBoNhwP4jHVsPfS0D0Ve48Qwx1-OBrpumDrWx6b58D9vx6HY)

### O Problema

Em equipes remotas, **70% dos huddles espontâneos no Slack são perdidos** pelos membros da equipe. As notificações nativas do Slack se perdem no meio de centenas de mensagens, resultando em:

- ⏰ 15-20 minutos perdidos por dia esperando pessoas entrarem
- 🤝 Oportunidades de colaboração perdidas
- 😤 Frustração com comunicação assíncrona desnecessária

### Nossa Solução

Huddle Notifier detecta automaticamente quando alguém inicia um huddle e envia notificações inteligentes para todos os membros do canal:

✅ **Notificação no Canal** - Mensagem pública visível para todos  
✅ **DMs Personalizadas** - Mensagem privada com botão de acesso rápido  
✅ **Controle por Canal** - Ative/desative conforme necessário  
✅ **Agendamento** - Lembretes automáticos de huddles recorrentes  
✅ **Multi-idioma** - Interface em PT-BR, EN e ES  

---

## 👤 Para Usuários Finais

### Como Usar

#### Passo 1: Ativar Notificações em um Canal

```
/huddle-setup
```

Digite este comando em qualquer canal onde você quer receber notificações de huddle.

#### Passo 2: Testar

1. Clique no ícone de fone 🎧 no cabeçalho do canal
2. Inicie um huddle
3. Veja a mágica acontecer! 

**O que você verá:**
- 📢 Notificação pública no canal: "Huddle Iniciado - @usuario iniciou um huddle"
- 💬 DM privada com botão "Abrir Canal" para entrar rapidamente

#### Passo 3: Gerenciar Configurações

```
/huddle-config
```

Visualize todos os canais onde as notificações estão ativas.

### Comandos Disponíveis

| Comando | Descrição | Exemplo de Uso |
|---------|-----------|----------------|
| `/huddle-setup` | Ativa ou desativa notificações no canal atual | Use no #general para ativar |
| `/huddle-config` | Mostra canais ativos e agendamentos | Ver status das configurações |
| `/huddle-schedule` | Agenda lembretes de huddle recorrentes | Lembrete toda segunda às 10h |

### App Home

Clique no nome do bot na barra lateral → **"Home"** para:

- 🌍 Mudar idioma da interface (PT-BR/EN/ES)
- ⚡ Acesso rápido para ativar notificações
- 📚 Ver documentação e ajuda
- ⚙️ Gerenciar suas preferências

---

## 💻 Para Desenvolvedores

### 🛠️ Stack Tecnológica

**Backend:**
- **Runtime:** Node.js v14+
- **Framework:** Slack Bolt SDK v3.17+
- **Server:** Express.js (integrado ao Bolt)

**Infraestrutura:**
- **Deploy:** Railway (Free tier)
- **Disponibilidade:** 24/7
- **Storage:** In-memory (Maps) - *Migração para banco planejada*

**APIs & Serviços:**
- Slack Events API - Detecção em tempo real
- Slack Web API - Envio de mensagens
- OAuth 2.0 - Autenticação segura

### 📁 Estrutura do Projeto

```
huddle-notifier/
├── src/
│   ├── config/
│   │   └── app.js              # Configuração do Bolt
│   ├── storage/
│   │   └── memory.js           # Armazenamento em memória
│   ├── events/
│   │   └── huddleChanged.js    # Handler de eventos de huddle
│   ├── commands/
│   │   ├── setup.js            # Comando /huddle-setup
│   │   ├── config.js           # Comando /huddle-config
│   │   └── schedule.js         # Comando /huddle-schedule
│   ├── views/
│   │   └── appHome.js          # App Home multi-idioma
│   └── utils/
│       ├── notifications.js    # Funções de notificação
│       └── translations.js     # Suporte i18n
├── app.js                      # Ponto de entrada
├── .env.example                # Template de variáveis
├── package.json                # Dependências
├── manifest.yml                # Slack App Manifest
└── README.md                   # Esta documentação
```

---

### 🚀 Setup para Desenvolvimento Local

#### Pré-requisitos

- ✅ Node.js 14+ e npm instalados
- ✅ Conta no Slack (acesso admin ao workspace)
- ✅ Conta no ngrok (para testes locais)
- ✅ Git instalado

#### Instalação Passo a Passo

**1. Clone o Repositório**

```bash
git clone https://github.com/rajssq/ai-code-combat.git
cd ai-code-combat
```

**2. Instale as Dependências**

```bash
npm install
```

**3. Configure o ngrok**

O ngrok cria um túnel da internet para seu localhost, permitindo que o Slack se comunique com seu bot local.

```bash
# Baixe e instale: https://ngrok.com/download
# Autentique (pegue o token em: https://dashboard.ngrok.com/get-started/your-authtoken)
ngrok config add-authtoken SEU_TOKEN_AQUI

# Inicie o túnel
ngrok http 3000
```

**Você verá algo assim:**
```
Forwarding    https://abc123-xyz.ngrok-free.app -> http://localhost:3000
```

⚠️ **IMPORTANTE:** Copie esta URL! Você vai precisar dela no próximo passo.

**4. Crie o App no Slack**

1. Acesse: https://api.slack.com/apps
2. Clique em **"Create New App"**
3. Escolha **"From an app manifest"**
4. Selecione seu workspace
5. Cole o conteúdo do arquivo `manifest.yml` (substitua `SUA-URL-AQUI.ngrok-free.app` pela URL do ngrok)
6. Clique em **"Create"**

**5. Configure Event Subscriptions**

Esta é uma etapa **CRÍTICA** para o bot funcionar:

1. No painel do seu app, vá em **"Event Subscriptions"** (menu lateral)
2. Ative o toggle **"Enable Events"**
3. No campo **"Request URL"**, cole sua URL do ngrok + `/slack/events`:
   ```
   https://abc123-xyz.ngrok-free.app/slack/events
   ```
4. **AGUARDE A VERIFICAÇÃO** ⏱️
   - O Slack enviará uma requisição de desafio para verificar a URL
   - Você deve ver ✅ **"Verified"** se tudo estiver correto
   - Se aparecer ❌ erro:
     - Certifique-se de que `node app.js` está rodando
     - Verifique se o ngrok está ativo
     - Confirme que a URL está correta (incluindo `/slack/events`)
     - Verifique o `SLACK_SIGNING_SECRET` no `.env`

5. Role até **"Subscribe to bot events"** e adicione:
   - `user_huddle_changed` - Detecta mudanças em huddles
   - `app_home_opened` - Habilita a página Home do app

6. Clique em **"Save Changes"**

⚠️ **ATENÇÃO:** Sempre que o ngrok reiniciar (nova URL), você precisará atualizar a Request URL aqui!

**6. Configure as Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
SLACK_BOT_TOKEN=xoxb-seu-bot-token-aqui
SLACK_SIGNING_SECRET=seu-signing-secret-aqui
PORT=3000
```

**Onde encontrar os tokens:**
- **Bot Token:** OAuth & Permissions → Install to Workspace → copie o token `xoxb-...`
- **Signing Secret:** Basic Information → App Credentials → copie o Signing Secret

⚠️ **NUNCA comite o arquivo `.env` no Git!**

**7. Inicie o Bot**

```bash
# Terminal 1 - Mantenha o ngrok rodando
ngrok http 3000

# Terminal 2 - Inicie o bot
node app.js
```

Você deve ver:
```
⚡️ Huddle Notifier está rodando na porta 3000!
```

**8. Teste**

Vá ao Slack e digite em qualquer canal:
```
/huddle-setup
```

Se o bot responder, está funcionando! 🎉

### 🔧 Componentes Principais

#### Event Handler (`huddleChanged.js`)

Processa eventos `user_huddle_changed` do Slack:

```javascript
// Detecta quando usuário entra em huddle
if (event.user.huddle.in_a_huddle) {
  // Verifica se canal tem notificações ativas
  // Envia notificação no canal
  // Envia DM para cada membro
}
```

**Fluxo:**
1. Slack envia evento → Bot recebe webhook
2. Verifica configuração do canal
3. Envia notificação pública no canal
4. Lista membros do canal
5. Envia DM individual para cada membro (exceto quem iniciou)

#### Sistema de Notificações (`notifications.js`)

Funções principais:

- `sendChannelNotification(channel, user)` - Posta mensagem no canal
- `sendMemberDM(userId, channelId, initiatorName)` - Envia DM com botão
- `notifyChannelMembers(channel, initiator)` - Orquestra notificações completas

**Exemplo de DM:**
```javascript
{
  blocks: [
    { type: "header", text: "Huddle em Andamento" },
    { type: "section", text: "@usuario iniciou um huddle em #canal" },
    { type: "actions", elements: [
      { type: "button", text: "Abrir Canal", url: "slack://channel?id=C123" }
    ]}
  ]
}
```

#### Sistema de Traduções (`translations.js`)

Suporte multi-idioma para App Home:

```javascript
const translations = {
  'pt-BR': { welcome: 'Bem-vindo' },
  'en': { welcome: 'Welcome' },
  'es': { welcome: 'Bienvenido' }
}
```

### 🧪 Testando Localmente

**Cenário de Teste Completo:**

1. **Configurar:** Execute `/huddle-setup` no canal de teste
2. **Iniciar Huddle:** Clique no ícone 🎧 e inicie um huddle
3. **Verificar:**
   - ✅ Notificação apareceu no canal?
   - ✅ Você recebeu DM?
   - ✅ Botão "Abrir Canal" funciona?
   - ✅ Outros membros receberam notificação?

**Testando com Múltiplos Usuários:**

Você precisa de 2+ usuários no mesmo canal:

- **Opção 1:** Convide outra conta sua
- **Opção 2:** Use navegadores diferentes (Chrome normal + anônimo)
- **Opção 3:** Desktop + Mobile

### 🐛 Troubleshooting

| Problema | Solução |
|----------|---------|
| ❌ Comando não funciona | Verifique se `node app.js` e ngrok estão rodando |
| ❌ Erro 502 Bad Gateway | O Node não está rodando - execute `node app.js` |
| ❌ Erro 401 Unauthorized | Tokens no `.env` incorretos - copie novamente do Slack |
| ❌ URL não verificada | Certifique-se que o bot está rodando ANTES de salvar a URL |
| ❌ Não recebo DM | Canal precisa estar configurado com `/huddle-setup` |
| ❌ ngrok mudou URL | Atualize a Request URL no Event Subscriptions |
| ❌ "url_verification failed" | Verifique o SLACK_SIGNING_SECRET no .env |

---

## 🏗️ Arquitetura Técnica

### Diagrama de Arquitetura

```mermaid
graph TB
    subgraph Slack["🔷 Slack Platform"]
        Events["Events API(user_huddle_changed)"]
        Commands["Slash Commands(/huddle-setup, /huddle-config)"]
        OAuth["OAuth 2.0(Authentication)"]
    end

    subgraph Railway["☁️ Railway Server"]
        subgraph BoltSDK["Slack Bolt SDK Application"]
            Receivers["📥 Receivers- Events- Commands- Actions- Views"]
            
            subgraph Handlers["🎯 Event Handlers"]
                HuddleHandler["huddleChanged.js"]
                SetupHandler["setup.js"]
                ConfigHandler["config.js"]
                HomeHandler["appHome.js"]
            end
            
            subgraph Notifications["📬 Notification Layer"]
                ChannelMsg["sendChannelMsg()"]
                MemberDM["sendMemberDM()"]
                NotifyAll["notifyMembers()"]
            end
            
            Storage["💾 In-Memory Storage(JavaScript Maps)- enabledChannels- userStates- scheduledReminders- userLanguages"]
        end
    end

    Events -->|Webhooks| Receivers
    Commands -->|HTTP POST| Receivers
    OAuth -->|Tokens| Receivers
    
    Receivers -->|Route| Handlers
    Handlers -->|Process| Notifications
    Notifications -->|Read/Write| Storage
    
    Notifications -.->|API Calls| Slack

    style Slack fill:#4A154B,color:#fff
    style Railway fill:#0B0D0E,color:#fff
    style BoltSDK fill:#2EB67D,color:#fff
    style Notifications fill:#E01E5A,color:#fff
    style Storage fill:#ECB22E,color:#000
```

### Fluxo de Dados Detalhado

```mermaid
sequenceDiagram
    participant User as 👤 Usuário
    participant Slack as 🔷 Slack
    participant Bot as 🤖 Huddle Notifier
    participant Storage as 💾 Storage
    participant Members as 👥 Membros do Canal

    User->>Slack: Clica em "Start Huddle" 🎧
    Slack->>Bot: POST /slack/events{type: "user_huddle_changed"}
    
    Bot->>Storage: Verifica se canal está ativo
    Storage-->>Bot: ✅ Canal configurado
    
    Bot->>Slack: Posta mensagem no canal"@user iniciou um huddle"
    
    Bot->>Slack: Lista membros do canal
    Slack-->>Bot: [member1, member2, member3...]
    
    loop Para cada membro (exceto iniciador)
        Bot->>Slack: Envia DM com botão"Abrir Canal"
    end
    
    Members->>Slack: Clicam no botão
    Slack->>Members: Abre o canal com huddle ativo
```

### Decisões de Design

#### 1. **Por que In-Memory Storage?**

**Situação Atual:**
- JavaScript Maps para armazenamento rápido
- Dados perdidos ao reiniciar (aceitável para MVP)
- Zero dependências de infraestrutura

**Prós:**
- ✅ Desenvolvimento rápido
- ✅ Sem custos adicionais
- ✅ Perfeito para validação de conceito
- ✅ Latência zero de acesso

**Contras:**
- ⚠️ Não persiste entre deploys
- ⚠️ Limitado pela memória do servidor
- ⚠️ Não escalável para grandes times

**Próximo Passo:**
- Migração para **MongoDB Atlas** (Free tier: 512MB)
- Modelos: `Channel`, `User`, `Schedule`, `Reminder`
- Estimativa: 2 dias de desenvolvimento

#### 2. **Arquitetura Event-Driven**

**Fluxo de Eventos:**
```
Usuário inicia huddle
    ↓
Slack envia webhook `user_huddle_changed`
    ↓
Bot valida payload e checa configuração
    ↓
Envia notificação assíncrona
    ↓
    ├─▶ Notificação no canal (pública)
    └─▶ DMs individuais (paralelo)
```

**Vantagens:**
- ⚡ Processamento assíncrono = baixa latência
- 🔄 Desacoplamento de componentes
- 📈 Facilita escalabilidade futura

#### 3. **Por que Bolt SDK?**

Alternativas consideradas:
- ❌ Slack Web API direto (muito low-level)
- ❌ Slack SDK legado (descontinuado)
- ✅ **Bolt SDK** (recomendação oficial do Slack)

**Benefícios do Bolt:**
- Abstração de alto nível
- Request signing automático
- Retry logic integrado
- Documentação excelente
- Comunidade ativa

### 🔒 Segurança

**Autenticação:**
- OAuth 2.0 flow completo
- Token refresh automático
- Signing secret validation em todo webhook

**Privacidade:**
- ✅ Zero persistência de mensagens
- ✅ Apenas eventos de huddle monitorados
- ✅ DMs criptografadas pelo Slack
- ✅ Sem acesso a conteúdo de mensagens

**Boas Práticas:**
- Variáveis de ambiente para secrets
- HTTPS obrigatório
- Rate limiting no Slack
- Dependências atualizadas regularmente

---

### 🐛 Reportar Bugs

1. Verifique se o bug já não foi reportado em [Issues](https://github.com/rajssq/ai-code-combat/issues)
2. Crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Ambiente (OS, Node version, etc)

### 💡 Sugerir Features

1. Abra uma issue com tag `enhancement`
2. Descreva:
   - Problema que resolve
   - Solução proposta
   - Alternativas consideradas
   - Impacto esperado

---

## 🔗 Links Úteis

- 📖 [Documentação do Slack API](https://api.slack.com/docs)
- 🔧 [Bolt SDK para Node.js](https://slack.dev/bolt-js)
- 🚀 [Railway Docs](https://docs.railway.app/)
- 🔐 [ngrok Docs](https://ngrok.com/docs)

---

<div align="center">

**⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!**

[![GitHub Stars](https://img.shields.io/github/stars/rajssq/ai-code-combat?style=social)](https://github.com/rajssq/ai-code-combat)

</div>
