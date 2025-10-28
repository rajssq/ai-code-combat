require("dotenv").config();
const { App } = require("@slack/bolt");

// Inicializar o app com configuração de receiver
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
  port: process.env.PORT || 3000,
  processBeforeResponse: true,
});

// Armazenamento em memória
const huddleSchedules = new Map();
const userHuddleStates = new Map(); // Rastrear estado dos usuários
const channelConfigs = new Map(); // Configuração de canais para notificar
const huddleChannels = new Map(); // Rastrear em qual canal o huddle está ativo

// 1. EVENTO: Detectar mudanças em huddles
app.event("user_huddle_changed", async ({ event, client }) => {
  try {
    const userId = event.user?.id || event.user;
    const huddleState = event.user?.profile?.huddle_state;
    const huddleCallId = event.user?.profile?.huddle_state_call_id;

    // Pegar estado anterior
    const previousState = userHuddleStates.get(userId) || "default_unset";

    console.log(`\n🔄 Mudança detectada!`);
    console.log(`👤 Usuário: ${userId}`);
    console.log(`📊 Estado anterior: ${previousState}`);
    console.log(`📊 Estado atual: ${huddleState}`);

    // Detectar ENTRADA no huddle
    if (huddleState === "in_a_huddle" && previousState !== "in_a_huddle") {
      console.log(`\n✅✅✅ ${userId} ENTROU NO HUDDLE! ✅✅✅`);
      console.log(`🆔 Call ID: ${huddleCallId}\n`);

      userHuddleStates.set(userId, huddleState);
      huddleChannels.set(huddleCallId, { userId, timestamp: Date.now() });

      // Buscar informações do usuário para saber nome
      let userName = userId;
      try {
        const userInfo = await client.users.info({ user: userId });
        userName = userInfo.user.real_name || userInfo.user.name;
      } catch (err) {
        console.error("Erro ao buscar info do usuário:", err);
      }

      // Notificar em TODOS os canais configurados
      const channelsNotified = [];

      for (const [channelId, config] of channelConfigs.entries()) {
        try {
          // Verificar se o usuário está no canal
          const members = await client.conversations.members({
            channel: channelId,
          });

          if (members.members.includes(userId)) {
            console.log(`📢 Notificando canal ${channelId}`);

            // 1. Enviar mensagem pública no canal
            await client.chat.postMessage({
              channel: channelId,
              text: `🎙️ <!channel> *Huddle iniciado!*\n<@${userId}> iniciou um huddle. Clique no ícone de fone de ouvido 🎧 para participar!`,
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `🎙️ *Huddle iniciado neste canal!*\n\n<@${userId}> acabou de iniciar um huddle.\n\n👉 *Como participar:*\nClique no ícone de fone de ouvido 🎧 no canto superior direito do canal.`,
                  },
                },
                {
                  type: "divider",
                },
                {
                  type: "context",
                  elements: [
                    {
                      type: "mrkdwn",
                      text: `⏰ ${new Date().toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`,
                    },
                  ],
                },
              ],
              unfurl_links: false,
              unfurl_media: false,
            });

            console.log(`✅ Mensagem enviada para o canal ${channelId}`);

            // 2. Enviar DM para CADA membro do canal (exceto quem iniciou)
            const memberCount = members.members.length;
            console.log(`📬 Enviando DMs para ${memberCount - 1} membros...`);

            for (const memberId of members.members) {
              // Não enviar DM para quem iniciou o huddle nem para bots
              if (memberId === userId) continue;

              try {
                // Verificar se é bot
                const memberInfo = await client.users.info({ user: memberId });
                if (memberInfo.user.is_bot) continue;

                // Enviar DM com botão
                await client.chat.postMessage({
                  channel: memberId,
                  text: `🎙️ Huddle iniciado em <#${channelId}>! <@${userId}> está te chamando para participar.`,
                  blocks: [
                    {
                      type: "header",
                      text: {
                        type: "plain_text",
                        text: "🎙️ Huddle Iniciado!",
                        emoji: true,
                      },
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: `<@${userId}> iniciou um huddle em <#${channelId}>`,
                      },
                    },
                    {
                      type: "section",
                      text: {
                        type: "mrkdwn",
                        text: `💡 *Como entrar:*\n1. Abra o canal <#${channelId}>\n2. Clique no ícone de fone 🎧 no canto superior`,
                      },
                    },
                    {
                      type: "actions",
                      elements: [
                        {
                          type: "button",
                          text: {
                            type: "plain_text",
                            text: "🎧 Ir para o canal",
                            emoji: true,
                          },
                          url: `slack://channel?team=${event.user.team_id}&id=${channelId}`,
                          style: "primary",
                        },
                      ],
                    },
                    {
                      type: "context",
                      elements: [
                        {
                          type: "mrkdwn",
                          text: `⏰ ${new Date().toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`,
                        },
                      ],
                    },
                  ],
                });

                console.log(`  ✅ DM enviada para ${memberId}`);
              } catch (dmError) {
                console.error(
                  `  ❌ Erro ao enviar DM para ${memberId}:`,
                  dmError.message
                );
              }
            }

            channelsNotified.push(channelId);
          }
        } catch (err) {
          console.error(`Erro ao notificar canal ${channelId}:`, err.message);
        }
      }

      console.log(`✅ Canais notificados: ${channelsNotified.length}`);

      // Se nenhum canal foi configurado, avisar o usuário
      if (channelsNotified.length === 0) {
        try {
          await client.chat.postMessage({
            channel: userId,
            text: `⚠️ Você entrou no huddle, mas nenhum canal está configurado para notificações.\n\nUse \`/huddle-setup\` em um canal para ativar as notificações automáticas!`,
          });
        } catch (err) {
          console.error("Erro ao enviar DM:", err);
        }
      }
    }
    // Detectar SAÍDA do huddle
    else if (
      huddleState === "default_unset" &&
      previousState === "in_a_huddle"
    ) {
      console.log(`\n❌❌❌ ${userId} SAIU DO HUDDLE! ❌❌❌\n`);
      userHuddleStates.set(userId, huddleState);
    }
    // Estado mantido ou mudança intermediária
    else {
      userHuddleStates.set(userId, huddleState);
      console.log(`ℹ️ Estado mantido: ${huddleState}\n`);
    }
  } catch (error) {
    console.error("❌ Erro no evento huddle:", error);
  }
});

// 2. COMANDO: /huddle-schedule
app.command("/huddle-schedule", async ({ command, ack, client }) => {
  await ack();

  try {
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

  const scheduleId = Date.now().toString();
  huddleSchedules.set(scheduleId, {
    time,
    channel,
    message,
    userId: body.user.id,
  });

  console.log("📅 Huddle agendado:", { time, channel, message });

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
    const configuredChannels = Array.from(channelConfigs.keys());

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

    // Mostrar canais configurados
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*📺 Canais com notificações ativas:* ${configuredChannels.length}`,
      },
    });

    if (configuredChannels.length > 0) {
      configuredChannels.forEach((channelId) => {
        blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `• <#${channelId}>`,
          },
        });
      });
    } else {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "_Nenhum canal configurado. Use `/huddle-setup` em um canal para ativar._",
        },
      });
    }

    blocks.push({ type: "divider" });

    // Mostrar huddles agendados
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
          text: `*📅 Huddles agendados:* ${schedules.length}`,
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

//  /huddle-setup - Configurar canal

app.command("/huddle-setup", async ({ command, ack, client }) => {
  await ack();

  const channelId = command.channel_id;

  try {
    // Verificar se já está configurado
    const isConfigured = channelConfigs.has(channelId);

    if (isConfigured) {
      // Desativar
      channelConfigs.delete(channelId);
      console.log(`❌ Notificações desativadas no canal ${channelId}`);

      await client.chat.postEphemeral({
        channel: channelId,
        user: command.user_id,
        text: `❌ Notificações de huddle *desativadas* neste canal.\n\nPara reativar, use \`/huddle-setup\` novamente.`,
      });
    } else {
      // Ativar
      channelConfigs.set(channelId, {
        activatedBy: command.user_id,
        activatedAt: Date.now(),
      });
      console.log(`✅ Notificações ativadas no canal ${channelId}`);

      await client.chat.postMessage({
        channel: channelId,
        text: `✅ *Notificações de huddle ativadas!*\n\nAgora todos os membros deste canal serão notificados quando alguém iniciar um huddle. 🎙️`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `✅ *Notificações de huddle ativadas!*\n\nA partir de agora, quando alguém deste canal iniciar um huddle, todos os membros serão notificados automaticamente.\n\n💡 _Para desativar, use_ \`/huddle-setup\` _novamente._`,
            },
          },
        ],
      });
    }
  } catch (error) {
    console.error("Erro no comando setup:", error);
    await client.chat.postEphemeral({
      channel: channelId,
      user: command.user_id,
      text: `❌ Erro ao configurar notificações. Tente novamente.`,
    });
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
              text: "*Como usar:*\n• `/huddle-schedule` - Agendar lembretes\n• `/huddle-config` - Ver configurações\n• O bot notifica automaticamente quando você entra/sai de huddles",
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
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Huddle Notifier está rodando na porta ${port}!`);
})();
