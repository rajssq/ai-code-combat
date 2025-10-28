# 🎙️ Huddle Notifier

Bot do Slack que notifica automaticamente todos os membros de um canal quando um huddle é iniciado.

## ✨ Funcionalidades

- 📢 **Notificação no canal** quando alguém inicia um huddle
- 💬 **DM personalizada** para cada membro com botão de acesso rápido
- ⚙️ **Configuração por canal** - ative/desative notificações conforme necessário
- 📅 **Agendamento de huddles** para organizar a rotina do time
- 🏠 **App Home** com instruções e status

---

## 👥 Para membros da equipe: Como adicionar o app ao workspace compartilhado

Se você é um membro da equipe e quer testar o Huddle Notifier no **mesmo workspace**, mas com sua própria instância do bot (para desenvolvimento independente):

### Adicione sua própria versão do app (Para desenvolvimento)

Se você quer rodar sua própria instância do bot para desenvolvimento:

#### 1. Criar seu próprio app no Slack

1. Acesse: https://api.slack.com/apps
2. Clique em **"Create New App"**
3. Selecione **"From an app manifest"**
4. **IMPORTANTE:** Escolha o **mesmo workspace** da equipe
5. Cole o manifest YAML (está na seção "Instalação" abaixo)
6. **Mude o nome do app** para algo único, exemplo:
   ```yaml
   display_information:
     name: Huddle Notifier - João # ← Coloque seu nome aqui!
     description: Versão de teste do Huddle Notifier
   ```
7. Clique em **"Next"** e depois **"Create"**

#### 2. Configurar seu ambiente local

Siga os passos da seção **"Instalação (para desenvolvedores)"** abaixo, começando do **Passo 4**.

**Resultado:** Agora o workspace terá múltiplos bots (um por desenvolvedor):

- Huddle Notifier
- Huddle Notifier - João
- Huddle Notifier - Maria

Cada um rodando na máquina do respectivo desenvolvedor! 🎉

### Adicione uma conta de teste para simular múltiplos usuários

Para testar as notificações com múltiplos usuários:

#### Método 1: Criar nova conta no workspace

1. Como voce tem acesso ao login do workspace convide uma conta pessoal sua
2. Entre no workspace com a nova conta

#### Método 2: Usar o Slack em múltiplos navegadores

1. **Navegador 1 (principal):** Sua conta normal
2. **Navegador 2 (anônimo/incógnito):** Conta de teste
3. **Slack Desktop:** Pode adicionar múltiplos workspaces

#### Método 3: Usar o Slack mobile

1. Instale o Slack no celular
2. Faça login com a conta de teste
3. Sua conta principal fica no desktop

### O que você pode testar:

- ✅ Entrar e sair de huddles
- ✅ Receber notificações no canal
- ✅ Receber DMs com botão de acesso rápido
- ✅ Usar os comandos `/huddle-setup`, `/huddle-config`, `/huddle-schedule`
- ✅ Ver a página inicial do bot (App Home)
- ✅ Testar com múltiplos usuários simultâneos

---

## 🚀 Instalação

Se você quer rodar o bot localmente no seu ambiente de desenvolvimento:

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

⚠️ **IMPORTANTE:** Nunca commite o arquivo `.env` no Git! Ele contém informações sensíveis.

### Passo 6: Configurar ngrok

O ngrok é necessário para expor seu servidor local para a internet, permitindo que o Slack envie eventos para seu bot.

#### 6.1. Baixar o ngrok

1. Acesse: https://ngrok.com/download
2. Baixe a versão para seu sistema operacional
3. Extraia o arquivo

**Windows:**

- Coloque o `ngrok.exe` em uma pasta (ex: `C:\ngrok\`)

**Mac/Linux:**

- Mova para `/usr/local/bin/` ou outra pasta no PATH

#### 6.2. Criar conta e autenticar

1. Crie uma conta gratuita em: https://dashboard.ngrok.com/signup
2. Após login, acesse: https://dashboard.ngrok.com/get-started/your-authtoken
3. Copie o comando que aparece, algo como:
   ```bash
   ngrok config add-authtoken SEU_TOKEN_AQUI
   ```
4. Cole e execute esse comando no terminal

**Exemplo:**

```bash
ngrok config add-authtoken 2abcdefGHIjklMNO3PqrSTuVwXyZ_4abcDEfGHijK5LmnO
```

#### 6.3. Iniciar o ngrok

Agora você pode rodar o ngrok na porta 3000:

```bash
ngrok http 3000
```

Você verá algo assim:

```
Session Status                online
Account                       seu-email@gmail.com (Plan: Free)
Version                       3.x.x
Region                        South America (sa)
Latency                       82ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.dev -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

3. **Copie a URL** que aparece em "Forwarding" (ex: `https://abc123.ngrok-free.dev`)

⚠️ **IMPORTANTE:**

- Deixe essa janela do terminal **aberta**! Se fechar, o ngrok para de funcionar
- **Plano gratuito:** Após autenticar com authtoken, a URL pode se manter a mesma entre reinicializações (mas não é garantido)
- Se a URL mudar, você precisará atualizar o manifest no Slack

### Passo 7: Atualizar URLs no Slack

1. Volte em https://api.slack.com/apps
2. Selecione seu app
3. Vá em **"App Manifest"**
4. Substitua todas as ocorrências de `sua-url-do-ngrok.ngrok-free.dev` pela URL do ngrok que você copiou
5. Clique em **"Save Changes"**

**Exemplo:** Se sua URL do ngrok é `https://abc123.ngrok-free.dev`, o manifest ficará:

```yaml
slash_commands:
  - command: /huddle-setup
    url: https://abc123.ngrok-free.dev/slack/events
    # ...
```

### Passo 8: Iniciar o bot

Abra um **novo terminal** (mantendo o ngrok rodando) e execute:

```bash
node app.js
```

Você deve ver:

```
⚡️ Huddle Notifier está rodando na porta 3000!
```

### Passo 9: Verificar se está funcionando

1. No Slack, vá em qualquer canal
2. Digite `/huddle-setup`
3. Se funcionar, o bot está configurado corretamente! ✅

**Agora você deve ter 2 terminais abertos:**

- Terminal 1: `ngrok http 3000` (rodando)
- Terminal 2: `node app.js` (rodando)

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

- ✅ Verifique se o bot está instalado no workspace
- ✅ Confirme que o app está rodando (`node app.js`)
- ✅ Verifique se o ngrok está ativo
- ✅ Confirme que a URL do ngrok no manifest está atualizada

### Não recebi a DM

- ✅ Certifique-se que o canal está configurado com `/huddle-setup`
- ✅ Verifique se você não é um bot
- ✅ Confirme que o scope `im:write` está ativo no manifest

### Erro 401 Unauthorized

- ✅ Verifique se os tokens no `.env` estão corretos
- ✅ Reinstale o app no workspace (OAuth & Permissions → Reinstall)

### Erro de verificação de URL (URL isn't verified)

- ✅ Certifique-se que `node app.js` está rodando
- ✅ Verifique se a URL do ngrok está correta no manifest
- ✅ Tente reiniciar o ngrok e atualizar o manifest
- ✅ Aguarde alguns segundos e clique em "Retry"

### Erro 502 Bad Gateway

- ✅ O Node.js não está rodando - execute `node app.js`
- ✅ Verifique se a porta 3000 está livre

### ngrok expirou ou URL mudou

- ✅ Reinicie o ngrok: `ngrok http 3000`
- ✅ Copie a nova URL
- ✅ Atualize o manifest com a nova URL
- ✅ Não precisa reinstalar o app, só salvar o manifest
- ℹ️ **Dica:** Com o authtoken configurado, a URL gratuita pode se manter a mesma em alguns casos

---

## 🧪 Cenários de teste recomendados

### Teste 1: Notificação básica

1. Configure um canal com `/huddle-setup`
2. Inicie um huddle
3. Verifique se apareceu mensagem no canal
4. Verifique se você recebeu DM

### Teste 2: Múltiplos usuários

1. Crie ou use uma segunda conta
2. Adicione ambas as contas no mesmo canal
3. Com a conta A, inicie um huddle
4. Verifique se a conta B recebeu notificação

### Teste 3: Múltiplos canais

1. Configure 2 canais diferentes com `/huddle-setup`
2. Inicie huddle no canal A
3. Verifique se ambos os canais foram notificados (se você está em ambos)

### Teste 4: Desativar notificações

1. Em um canal configurado, use `/huddle-setup` novamente
2. Inicie um huddle
3. Confirme que não há notificação

---

## 📝 Notas importantes

- 🔄 **Ngrok URL:** Com o authtoken configurado, a URL pode se manter entre reinicializações (plano gratuito), mas não é garantido
- 💾 **Dados em memória:** As configurações são perdidas ao reiniciar o bot (implemente um banco de dados para produção)
- 🔒 **Não commite o .env:** Mantenha seus tokens em segredo
- 🔄 **Dois terminais:** Sempre mantenha ngrok e node rodando simultaneamente
- 👥 **Teste com múltiplos usuários:** Use contas secundárias ou peça ajuda de colegas
- 🎯 **Múltiplos bots no mesmo workspace:** Cada desenvolvedor pode ter sua própria instância com nome diferente

---

## 🎓 Recursos adicionais

- [Documentação do Slack Bolt](https://slack.dev/bolt-js/)
- [Guia de Events API](https://api.slack.com/events-api)
- [Documentação do ngrok](https://ngrok.com/docs)

---
