// Armazenamento temporário em memória (perdido ao reiniciar o app)

const huddleSchedules = new Map();
const userHuddleStates = new Map();
const channelConfigs = new Map();
const huddleChannels = new Map();
const userLanguagePreferences = new Map();

module.exports = {
  huddleSchedules,
  userHuddleStates,
  channelConfigs,
  huddleChannels,
  userLanguagePreferences,
};
