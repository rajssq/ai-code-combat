# 🎙️ Huddle Notifier

Bot do Slack que notifica automaticamente todos os membros de um canal quando um huddle é iniciado.

## ✨ Funcionalidades

- 📢 **Notificação no canal** quando alguém inicia um huddle
- 💬 **DM personalizada** para cada membro com botão de acesso rápido
- ⚙️ **Configuração por canal** - ative/desative notificações conforme necessário
- 📅 **Agendamento de huddles** para organizar a rotina do time
- 🏠 **App Home** com instruções e status

---

## 🚀 Instalação

### Pré-requisitos

- Node.js (versão 14 ou superior)
- Uma conta no Slack com permissões de administrador do workspace
- ngrok (para desenvolvimento local)

### Passo 1: Clonar o repositório

```bash
git clone https://github.com/rajssq/ai-code-combat.git
cd ai-code-combat
```

### Passo 2: Instalar dependências

```bash
npm install
```

### Passo 3: Criar o app no Slack

1. Acesse: https://api.slack.com/apps
2. Clique em **"Create New App"**
3. Selecione **"From an app manifest"**
4. Escolha seu workspace
5. Cole o seguinte manifest YAML:

```yaml
display_information:
  name: Huddle Notifier
  description: Notifica membros do canal quando huddles são iniciados
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
      url: https://sua-url-do-ngrok.ngrok-free.dev/slack/events
      description: Agendar lembretes de huddle
      should_escape: false
    - command: /huddle-config
      url: https://sua-url-do-ngrok.ngrok-free.dev/slack/events
      description: Ver configurações e canais ativos
      should_escape: false
    - command: /huddle-setup
      url: https://sua-url-do-ngrok.ngrok-free.dev/slack/events
      description: Ativar/desativar notificações no canal
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
    request_url: https://sua-url-do-ngrok.ngrok-free.dev/slack/events
    bot_events:
      - app_home_opened
      - user_huddle_changed
  interactivity:
    is_enabled: true
    request_url: https://sua-url-do-ngrok.ngrok-free.dev/slack/events
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

6. Clique em **"Next"** e depois **"Create"**

### Passo 4: Obter os tokens

1. Vá em **"OAuth & Permissions"** (menu lateral)
2. Clique em **"Install to Workspace"**
3. Autorize as permissões
4. Copie o **Bot User OAuth Token** (começa com `xoxb-`)
5. Vá em **"Basic Information"**
6. Copie o **Signing Secret**

### Passo 5: Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
SLACK_BOT_TOKEN=xoxb-seu-token-aqui
SLACK_SIGNING_SECRET=seu-signing-secret-aqui
PORT=3000
```

### Passo 6: Configurar ngrok

1. Instale o ngrok: https://ngrok.com/download
2. Execute:
   ```bash
   ngrok http 3000
   ```
3. Copie a URL gerada (ex: `https://abc123.ngrok-free.dev`)

### Passo 7: Atualizar URLs no Slack

1. Volte em https://api.slack.com/apps
2. Selecione seu app
3. Vá em **"App Manifest"**
4. Substitua todas as ocorrências de `sua-url-do-ngrok.ngrok-free.dev` pela URL do ngrok
5. Clique em **"Save Changes"**

### Passo 8: Iniciar o bot

```bash
node app.js
```

Você deve ver:

```
⚡️ Huddle Notifier está rodando na porta 3000!
```

---

## 📖 Como usar

### 1. Ativar notificações em um canal

No canal onde você quer receber notificações, digite:

```
/huddle-setup
```

Você verá uma mensagem de confirmação. Agora o canal está configurado! ✅

### 2. Iniciar um huddle

Quando **qualquer membro** do canal configurado iniciar um huddle:

- 📢 **Uma mensagem aparecerá no canal** alertando todos
- 💬 **Cada membro receberá uma DM** com um botão para entrar diretamente no huddle

### 3. Ver configurações

Para ver quais canais estão configurados e huddles agendados:

```
/huddle-config
```

### 4. Agendar huddles (opcional)

Para agendar lembretes de huddles recorrentes:

```
/huddle-schedule
```

Preencha o modal com:

- Horário do huddle
- Canal
- Mensagem personalizada (opcional)

### 5. Desativar notificações

Para desativar notificações em um canal, use novamente:

```
/huddle-setup
```

---

## 🎯 Fluxo de uso típico

1. **Admin configura o canal:**

   ```
   /huddle-setup
   ```

2. **Alguém inicia um huddle** clicando no ícone de fone 🎧

3. **Todos recebem:**

   - Notificação pública no canal
   - DM privada com botão "🎧 Ir para o canal"

4. **Membros entram** clicando no botão ou no ícone do canal

---

## 🛠️ Estrutura do projeto

```
huddle-notifier/
├── app.js              # Código principal do bot
├── .env                # Variáveis de ambiente (não commitar!)
├── package.json        # Dependências
├── README.md           # Este arquivo
└── .gitignore          # Arquivos ignorados pelo Git
```

---

## 🔧 Comandos disponíveis

| Comando            | Descrição                                      |
| ------------------ | ---------------------------------------------- |
| `/huddle-setup`    | Ativa/desativa notificações no canal atual     |
| `/huddle-config`   | Mostra canais configurados e huddles agendados |
| `/huddle-schedule` | Agenda lembretes de huddles recorrentes        |

---

## 🐛 Troubleshooting

### O comando não funciona

- Verifique se o bot está instalado no workspace
- Confirme que o app está rodando (`node app.js`)
- Verifique se o ngrok está ativo

### Não recebi a DM

- Certifique-se que o canal está configurado com `/huddle-setup`
- Verifique se você não é um bot
- Confirme que o scope `im:write` está ativo

### Erro 401 Unauthorized

- Verifique se os tokens no `.env` estão corretos
- Reinstale o app no workspace

### Erro de verificação de URL

- Certifique-se que `node app.js` está rodando
- Verifique se a URL do ngrok está correta no manifest
- Tente reiniciar o ngrok e atualizar o manifest

---

## 📝 Notas importantes

- ⚠️ **Ngrok URL muda:** Toda vez que reiniciar o ngrok, você precisa atualizar o manifest
- 💾 **Dados em memória:** As configurações são perdidas ao reiniciar o bot (implemente um banco de dados para produção)
- 🔒 **Não commite o .env:** Mantenha seus tokens em segredo

---
