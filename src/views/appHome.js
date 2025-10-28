/**
 * App Home - Página inicial do bot
 * Exibida quando o usuário clica no bot na barra lateral
 */
async function handleAppHome({ event, client }) {
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
          { type: "divider" },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Como usar:*\n• `/huddle-setup` - Ativar notificações\n• `/huddle-config` - Ver configurações\n• `/huddle-schedule` - Agendar lembretes",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Benefícios:*\n✅ Organiza rotina do time\n✅ Lembretes automáticos\n✅ Integração nativa",
            },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Erro ao publicar home:", error);
  }
}

module.exports = handleAppHome;
