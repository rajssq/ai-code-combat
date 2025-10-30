const {
  userHuddleStates,
  channelConfigs,
  huddleChannels,
} = require("../storage/memory");
const { notifyChannelMembers } = require("../utils/notifications");

/**
 * Handler do evento user_huddle_changed
 * Detecta quando usuários entram/saem de huddles
 */
async function handleHuddleChanged({ event, client }) {
  try {
    const userId = event.user?.id || event.user;
    const huddleState = event.user?.profile?.huddle_state;
    const huddleCallId = event.user?.profile?.huddle_state_call_id;
    const previousState = userHuddleStates.get(userId) || "default_unset";

    console.log(`Mudança de estado: ${userId} -> ${huddleState}`);

    // Usuário entrou no huddle
    if (huddleState === "in_a_huddle" && previousState !== "in_a_huddle") {
      console.log(` ${userId} entrou no huddle ${huddleCallId}`);

      userHuddleStates.set(userId, huddleState);

      // Verifica se este huddle já existe (alguém já estava nele)
      const existingHuddle = huddleChannels.get(huddleCallId);

      if (!existingHuddle) {
        // É o PRIMEIRO usuário - INICIOU o huddle
        console.log(` ${userId} INICIOU o huddle - notificando canais`);

        huddleChannels.set(huddleCallId, {
          initiatorId: userId,
          timestamp: Date.now(),
          participants: [userId],
        });

        const channelsNotified = [];

        for (const [channelId] of channelConfigs.entries()) {
          try {
            const result = await notifyChannelMembers(
              client,
              channelId,
              userId,
              event.user.team_id
            );

            if (result.notified) {
              channelsNotified.push(channelId);
              console.log(`Notificado: ${channelId} (${result.dmsSent} DMs)`);
            } else if (result.reason) {
              console.log(`Ignorado: ${channelId} (${result.reason})`);
            }
          } catch (error) {
            console.error(` Erro ao notificar ${channelId}:`, error.message);
          }
        }

        console.log(`${channelsNotified.length} canal(is) notificado(s)`);

        // Avisar usuário se nenhum canal está configurado
        if (channelsNotified.length === 0) {
          try {
            await client.chat.postMessage({
              channel: userId,
              text: "Nenhum canal configurado para notificações",
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "*Nenhum canal configurado*\nUse `/huddle-setup` em um canal para ativar as notificações.",
                  },
                },
              ],
            });
          } catch (dmError) {
            console.error("⚠️ Não foi possível enviar DM:", dmError.message);
          }
        }
      } else {
        // Huddle já existe - alguém está ENTRANDO em um huddle ativo
        console.log(`  ➕ ${userId} entrou em huddle existente (não notifica)`);

        if (!existingHuddle.participants) {
          existingHuddle.participants = [
            existingHuddle.userId || existingHuddle.initiatorId,
          ];
        }

        if (!existingHuddle.participants.includes(userId)) {
          existingHuddle.participants.push(userId);
        }
      }
    }
    // Usuário saiu do huddle
    else if (
      huddleState === "default_unset" &&
      previousState === "in_a_huddle"
    ) {
      console.log(`👋 ${userId} saiu do huddle`);
      userHuddleStates.set(userId, huddleState);

      // Remove usuário da lista de participantes de todos os huddles
      for (const [callId, huddle] of huddleChannels.entries()) {
        if (huddle.participants && huddle.participants.includes(userId)) {
          huddle.participants = huddle.participants.filter(
            (id) => id !== userId
          );

          // Se não sobrou ninguém, limpa o huddle
          if (huddle.participants.length === 0) {
            huddleChannels.delete(callId);
            console.log(`  🏁 Huddle ${callId} finalizado`);
          }
        }
      }
    } else {
      userHuddleStates.set(userId, huddleState);
    }
  } catch (error) {
    console.error("❌ Erro no evento huddle:", error.message);
  }
}

module.exports = handleHuddleChanged;
