require("dotenv").config();
const { App } = require("@slack/bolt");

// Inicializar o app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false, // true p Socket Mode
  port: process.env.PORT || 3000,
});

// Armazenamento em memória (substituir por DB depois)
const huddleSchedules = new Map();

// 1. EVENTO: Detectar mudanças em huddles
app.event("user_huddle_changed", async ({ event, client }) => {
  try {
    console.log("Huddle event:", event);

    const { user } = event;

    // Verificar se usuário entrou ou saiu do huddle
    if (event.user_huddle) {
      // Usuário ENTROU no huddle
      const huddleId = event.user_huddle.id;
      const channelId = event.user_huddle.channel_id;

      console.log(`✅ Usuário ${user.id} entrou no huddle ${huddleId}`);

      // Enviar mensagem de boas-vindas
      await client.chat.postMessage({
        channel: channelId,
        text: `🎙️ <@${user.id}> entrou no huddle!`,
      });
    } else {
      // Usuário SAIU do huddle
      console.log(`❌ Usuário ${user.id} saiu do huddle`);
    }
  } catch (error) {
    console.error("Erro no evento huddle:", error);
  }
});

// 2. COMANDO: /huddle-schedule
app.command("/huddle-schedule", async ({ command, ack, client }) => {
  await ack();

  try {
    // Abrir modal para agendar huddle
    await client.views.open({
      trigger_id: command.trigger_id,
      view: {
        type: "modal",
        callback_id: "schedule_huddle_modal",
        title: {
          type: "plain_text",
          text: "Agendar Huddle",
        },
        submit: {
          type: "plain_text",
          text: "Agendar",
        },
        blocks: [
          {
            type: "input",
            block_id: "huddle_time",
            element: {
              type: "timepicker",
              action_id: "time_select",
              initial_time: "10:00",
            },
            label: {
              type: "plain_text",
              text: "Horário do huddle",
            },
          },
          {
            type: "input",
            block_id: "huddle_channel",
            element: {
              type: "channels_select",
              action_id: "channel_select",
              placeholder: {
                type: "plain_text",
                text: "Selecione o canal",
              },
            },
            label: {
              type: "plain_text",
              text: "Canal",
            },
          },
          {
            type: "input",
            block_id: "huddle_message",
            optional: true,
            element: {
              type: "plain_text_input",
              action_id: "message_input",
              placeholder: {
                type: "plain_text",
                text: "Ex: Daily standup",
              },
            },
            label: {
              type: "plain_text",
              text: "Mensagem (opcional)",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Erro ao abrir modal:", error);
  }
});

// 3. MODAL SUBMIT: Salvar agendamento
app.view("schedule_huddle_modal", async ({ ack, body, view, client }) => {
  await ack();

  const values = view.state.values;
  const time = values.huddle_time.time_select.selected_time;
  const channel = values.huddle_channel.channel_select.selected_channel;
  const message =
    values.huddle_message.message_input.value || "Hora do huddle!";

  // Salvar agendamento (em produção, usar banco de dados)
  const scheduleId = Date.now().toString();
  huddleSchedules.set(scheduleId, {
    time,
    channel,
    message,
    userId: body.user.id,
  });

  console.log("📅 Huddle agendado:", { time, channel, message });

  // Confirmar agendamento
  await client.chat.postMessage({
    channel: body.user.id,
    text: `✅ Huddle agendado para ${time} no canal <#${channel}>!\n> ${message}`,
  });
});

// 4. COMANDO: /huddle-config
app.command("/huddle-config", async ({ command, ack, client }) => {
  await ack();

  try {
    const schedules = Array.from(huddleSchedules.values());

    let blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*⚙️ Configurações do Huddle Notifier*",
        },
      },
      {
        type: "divider",
      },
    ];

    if (schedules.length === 0) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "_Nenhum huddle agendado. Use `/huddle-schedule` para criar um._",
        },
      });
    } else {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Huddles agendados:* ${schedules.length}`,
        },
      });

      schedules.forEach((schedule, index) => {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${index + 1}. *${schedule.time}* - <#${
              schedule.channel
            }>\n> ${schedule.message}`,
          },
        });
      });
    }

    await client.chat.postEphemeral({
      channel: command.channel_id,
      user: command.user_id,
      blocks: blocks,
    });
  } catch (error) {
    console.error("Erro no comando config:", error);
  }
});

// 5. APP HOME: Página inicial do app
app.event("app_home_opened", async ({ event, client }) => {
  try {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: "home",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*🎙️ Bem-vindo ao Huddle Notifier!*",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Como usar:*\n• `/huddle-schedule` - Agendar lembretes\n• `/huddle-config` - Ver configurações\n• O bot notifica automaticamente quando alguém entra/sai de huddles",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Benefícios:*\n✅ Organiza rotina do time\n✅ Lembretes automáticos\n✅ Integração nativa com Slack",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Erro ao publicar home:", error);
  }
});

// INICIAR O APP
(async () => {
  await app.start();
  console.log("⚡️ Huddle Notifier está rodando!");
})();
