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

    console.log(`\n🔄 Huddle state change: ${userId} -> ${huddleState}`);

    // Usuário ENTROU no huddle
    if (huddleState === "in_a_huddle" && previousState !== "in_a_huddle") {
      console.log(`✅ ${userId} entrou no huddle ${huddleCallId}`);

      userHuddleStates.set(userId, huddleState);
      huddleChannels.set(huddleCallId, { userId, timestamp: Date.now() });

      // Notificar todos os canais configurados onde o usuário está
      const channelsNotified = [];
      for (const [channelId] of channelConfigs.entries()) {
        const result = await notifyChannelMembers(
          client,
          channelId,
          userId,
          event.user.team_id
        );

        if (result.notified) {
          channelsNotified.push(channelId);
        }
      }

      console.log(`✅ ${channelsNotified.length} canal(is) notificado(s)\n`);

      // Avisar usuário se nenhum canal está configurado
      if (channelsNotified.length === 0) {
        await client.chat.postMessage({
          channel: userId,
          text: `⚠️ Nenhum canal configurado para notificações.\n\nUse \`/huddle-setup\` em um canal para ativar!`,
        });
      }
    }
    // Usuário SAIU do huddle
    else if (
      huddleState === "default_unset" &&
      previousState === "in_a_huddle"
    ) {
      console.log(`❌ ${userId} saiu do huddle\n`);
      userHuddleStates.set(userId, huddleState);
    }
    // Estado mantido
    else {
      userHuddleStates.set(userId, huddleState);
    }
  } catch (error) {
    console.error("❌ Erro no evento huddle:", error);
  }
}

module.exports = handleHuddleChanged;
