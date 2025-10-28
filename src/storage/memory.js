// Armazenamento temporário em memória (será perdido ao reiniciar)
// TODO: Migrar para banco de dados em produção

const huddleSchedules = new Map();
const userHuddleStates = new Map();
const channelConfigs = new Map();
const huddleChannels = new Map();

module.exports = {
  huddleSchedules,
  userHuddleStates,
  channelConfigs,
  huddleChannels,
};
