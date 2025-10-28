# 🎙️ Huddle Notifier

Bot do Slack que notifica automaticamente todos os membros de um canal quando um huddle é iniciado.

---

## 🎯 O que o bot faz?

Quando alguém inicia um huddle no Slack:
- 📢 Envia notificação pública no canal
- 💬 Envia DM privada para cada membro com botão para entrar
- ⚙️ Permite ativar/desativar por canal
- 📅 Permite agendar lembretes de huddles

---

## 🚀 Como rodar o projeto (Passo a Passo)

### Pré-requisitos

Você precisa ter instalado:
- ✅ [Node.js](https://nodejs.org/) (versão 14+)
- ✅ [Git](https://git-scm.com/)
- ✅ Acesso ao workspace do Slack

---

## 📦 Etapa 1: Clonar e Instalar

```bash
# Clone o repositório
git clone https://github.com/rajssq/ai-code-combat.git
cd ai-code-combat

# Instale as dependências
npm install
```

✅ **Checkpoint:** Você deve ver a pasta `node_modules` criada.

---

## 🌐 Etapa 2: Configurar o ngrok

O ngrok cria um túnel da internet para seu computador, permitindo que o Slack se comunique com seu bot local.

### 2.1 - Baixar o ngrok

1. Acesse: https://ngrok.com/download
2. Baixe para seu sistema operacional
3. Extraia o arquivo

**Windows:** Coloque em `C:\ngrok\`  
**Mac/Linux:** Mova para `/usr/local/bin/`

### 2.2 - Criar conta e autenticar

1. Crie conta gratuita: https://dashboard.ngrok.com/signup
2. Faça login e acesse: https://dashboard.ngrok.com/get-started/your-authtoken
3. Você verá um comando similar a este:
   ```bash
   ngrok config add-authtoken 2abcdefGHIjklMNO3PqrSTuVwXyZ
   ```
4. **Copie e execute no terminal**

### 2.3 - Iniciar o ngrok

Abra um terminal e rode:

```bash
ngrok http 3000
```

Você verá algo assim:

```
Forwarding    https://abc123-xyz.ngrok-free.dev -> http://localhost:3000
```

**📝 IMPORTANTE:**
- ✅ **Deixe esta janela aberta!**
- ✅ **Copie esta URL** (ex: `https://abc123-xyz.ngrok-free.dev`)
- ⚠️ Esta URL será usada no próximo passo

✅ **Checkpoint:** O ngrok está rodando e você copiou a URL.

---

## 🤖 Etapa 3: Criar o Bot no Slack

### 3.1 - Criar o App

1. Acesse: https://api.slack.com/apps
2. Clique em **"Create New App"**
3. Escolha **"From an app manifest"**
4. Selecione o workspace da equipe
5. **Cole o manifest abaixo** (leia a observação antes!)

### 3.2 - Manifest YAML

⚠️ **ANTES DE COLAR:** Substitua `https://SUA-URL-AQUI.ngrok-free.dev` pela URL que você copiou do ngrok!

```yaml
display_information:
  name: Huddle Notifier - SEU_NOME  # ← Mude para seu nome (ex: João)
  description: Bot de notificação de huddles
  background_color: "#4A154B"
features:
  app_home:
    home_tab_enabled: true
    messages_tab_enabled: true
    messages_tab_read_only_enabled: false
  bot_user:
    display_name: Huddle Notifier
    always_online: true
  slash_commands:
    - command: /huddle-schedule
      url: https://SUA-URL-AQUI.ngrok-free.dev/slack/events
      description: Agendar lembretes de huddle
      should_escape: false
    - command: /huddle-config
      url: https://SUA-URL-AQUI.ngrok-free.dev/slack/events
      description: Ver configurações
      should_escape: false
    - command: /huddle-setup
      url: https://SUA-URL-AQUI.ngrok-free.dev/slack/events
      description: Ativar notificações no canal
      should_escape: false
oauth_config:
  scopes:
    bot:
      - commands
      - chat:write
      - chat:write.public
      - users:read
      - channels:read
      - channels:manage
      - conversations.connect:read
      - im:write
settings:
  event_subscriptions:
    request_url: https://SUA-URL-AQUI.ngrok-free.dev/slack/events
    bot_events:
      - app_home_opened
      - user_huddle_changed
  interactivity:
    is_enabled: true
    request_url: https://SUA-URL-AQUI.ngrok-free.dev/slack/events
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

6. Clique em **"Next"** → **"Create"**

✅ **Checkpoint:** Seu app foi criado no Slack.

---

## 🔑 Etapa 4: Obter os Tokens

### 4.1 - Bot Token

1. No menu lateral, clique em **"OAuth & Permissions"**
2. Clique em **"Install to Workspace"**
3. Clique em **"Permitir"**
4. Copie o **Bot User OAuth Token** (começa com `xoxb-`)

### 4.2 - Signing Secret

1. No menu lateral, clique em **"Basic Information"**
2. Role até **"App Credentials"**
3. Copie o **Signing Secret**

✅ **Checkpoint:** Você tem 2 tokens copiados.

---

## ⚙️ Etapa 5: Configurar o Ambiente

Crie um arquivo chamado `.env` na raiz do projeto com este conteúdo:

```env
SLACK_BOT_TOKEN=xoxb-seu-token-aqui
SLACK_SIGNING_SECRET=seu-signing-secret-aqui
PORT=3000
```

**Exemplo de como deve ficar:**
```env
SLACK_BOT_TOKEN=xoxb-1234567890-1234567890123-abcdefghijk
SLACK_SIGNING_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
PORT=3000
```

⚠️ **NUNCA COMITE ESTE ARQUIVO NO GIT!**

✅ **Checkpoint:** Arquivo `.env` criado com seus tokens.

---

## ▶️ Etapa 6: Iniciar o Bot

Abra um **NOVO terminal** (mantendo o ngrok rodando no primeiro) e execute:

```bash
node app.js
```

Você deve ver:
```
⚡️ Huddle Notifier está rodando na porta 3000!
```

✅ **Checkpoint:** Você tem 2 terminais abertos:
- **Terminal 1:** ngrok rodando
- **Terminal 2:** node rodando

---

## ✅ Etapa 7: Testar se Funciona

1. Abra o Slack
2. Vá em qualquer canal
3. Digite:
   ```
   /huddle-setup
   ```

Se aparecer uma mensagem do bot, **está funcionando!** 🎉

---

## 📱 Como Usar o Bot

### Ativar notificações em um canal

```
/huddle-setup
```

### Ver status das configurações

```
/huddle-config
```

### Agendar huddles

```
/huddle-schedule
```

### Testar notificações

1. Configure um canal com `/huddle-setup`
2. Clique no ícone de fone 🎧 para iniciar um huddle
3. Veja a mágica acontecer! ✨

---

## 🧪 Testando com Múltiplos Usuários

Para testar as notificações, você precisa de 2+ usuários no mesmo canal.

### Opção 1: Convidar outra conta sua

1. Você tem acesso ao workspace
2. Convide seu email pessoal
3. Entre com a segunda conta

### Opção 2: Usar múltiplos navegadores

- **Chrome normal:** Conta principal
- **Chrome anônimo:** Conta secundária

### Opção 3: Desktop + Mobile

- **Desktop:** Conta principal
- **Celular:** Instale o Slack e entre com conta secundária

### Cenário de Teste Completo

1. **Com a Conta A:**
   - Configure um canal com `/huddle-setup`
   - Inicie um huddle (ícone 🎧)

2. **Com a Conta B:**
   - Verifique se recebeu notificação no canal
   - Verifique se recebeu DM com botão

---

## 🐛 Problemas Comuns

### ❌ Comando não funciona
**Solução:**
- Verifique se `node app.js` está rodando
- Verifique se ngrok está rodando
- Confirme que a URL no manifest está correta

### ❌ Erro 502 Bad Gateway
**Solução:**
- O Node não está rodando
- Execute `node app.js`

### ❌ Erro 401 Unauthorized
**Solução:**
- Tokens no `.env` estão errados
- Copie novamente do Slack

### ❌ URL não verificada
**Solução:**
- Aguarde 10 segundos
- Clique em "Retry" no Slack

### ❌ Não recebo DM
**Solução:**
- Canal precisa estar configurado com `/huddle-setup`
- Você não pode ser um bot

### ❌ ngrok mudou de URL
**Solução:**
1. Copie a nova URL do ngrok
2. Vá no Slack → App Manifest
3. Substitua todas as URLs antigas
4. Clique em "Save"

---

## 🎯 Tarefas de Melhoria (6 dias)

Aqui estão as melhorias que vocês podem implementar no projeto:

### 🚀 PRIORIDADE ALTA

#### 1. Deploy em Produção (⏱️ 2 dias)
**Objetivo:** Tirar o bot do localhost e colocar online 24/7

**Opções:**
- **Heroku** (mais fácil)
  - [ ] Criar conta no Heroku
  - [ ] Fazer deploy via Git
  - [ ] Configurar variáveis de ambiente
  - [ ] Atualizar manifest com URL permanente
  
- **Railway** (recomendado)
  - [ ] Conectar repositório GitHub
  - [ ] Deploy automático
  - [ ] URL permanente gerada

- **Render** (alternativa)
  - [ ] Deploy gratuito
  - [ ] Fácil configuração

**Resultado:** Bot funcionando sem precisar deixar computador ligado.

#### 2. Banco de Dados (⏱️ 2 dias)
**Objetivo:** Salvar configurações permanentemente

**Problema atual:** Quando o bot reinicia, perde todas as configurações.

**Opções:**
- **MongoDB Atlas** (NoSQL, fácil)
  - [ ] Criar cluster gratuito
  - [ ] Instalar `mongoose`
  - [ ] Criar models: Channel, Schedule
  - [ ] Migrar Maps para banco
  
- **PostgreSQL** (SQL, robusto)
  - [ ] Usar Supabase (gratuito)
  - [ ] Criar tabelas
  - [ ] Usar Prisma ORM

**Resultado:** Configurações persistem entre reinicializações.

---

### 📊 PRIORIDADE MÉDIA

#### 2. Notificações Avançadas (⏱️ 1 dia)
**Objetivo:** Melhorar experiência do usuário

**Features:**
- [ ] Notificar quando huddle termina
- [ ] Lembretes 5min antes de huddle agendado
- [ ] Resumo diário: "Hoje teve X huddles"
- [ ] Permitir silenciar notificações temporariamente
- [ ] Customizar mensagem de notificação por canal

---

## 📋 Checklist de Deploy

Para quem for fazer o deploy:

- [ ] Código no GitHub está atualizado
- [ ] Variáveis de ambiente configuradas no serviço
- [ ] Banco de dados criado e conectado
- [ ] URLs no manifest atualizadas
- [ ] Bot reinstalado no workspace
- [ ] Testado em produção
- [ ] Documentação atualizada

---

## 💡 Dicas Importantes

- 🔄 Sempre mantenha 2 terminais abertos (ngrok + node)
- 🔐 Nunca comite o arquivo `.env`
- 🧪 Teste com múltiplas contas antes de mostrar pro time
- 📝 Use nomes únicos para seu bot (ex: Huddle Notifier - João)
- 💬 Se tiver dúvidas, pergunte no canal da equipe

---

## ✅ Resumo Rápido

1. ✅ Clone o repositório
2. ✅ `npm install`
3. ✅ Configure ngrok e copie URL
4. ✅ Crie app no Slack com manifest
5. ✅ Copie tokens (Bot Token + Signing Secret)
6. ✅ Crie arquivo `.env` com tokens
7. ✅ Rode `ngrok http 3000` (terminal 1)
8. ✅ Rode `node app.js` (terminal 2)
9. ✅ Teste com `/huddle-setup`
10. ✅ Escolha uma tarefa de melhoria e mãos à obra!
