require("dotenv").config();

const app = require("./src/config/app");
const handleHuddleChanged = require("./src/events/huddleChanged");
const handleSetup = require("./src/commands/setup");
const handleConfig = require("./src/commands/config");
const {
  handleSchedule,
  handleScheduleSubmit,
} = require("./src/commands/schedule");
const {
  handleAppHome,
  handleHomeActions,
  handleLanguageChange,
} = require("./src/views/appHome");

// Registrar eventos
app.event("user_huddle_changed", handleHuddleChanged);
app.event("app_home_opened", handleAppHome);

// Registrar comandos
app.command("/huddle-setup", handleSetup);
app.command("/huddle-config", handleConfig);
app.command("/huddle-schedule", handleSchedule);

// Registrar views
app.view("schedule_huddle_modal", handleScheduleSubmit);

// Registrar ações da App Home
app.action("enable_notifications_home", handleHomeActions);
app.action("view_settings_home", handleHomeActions);
app.action("change_language", handleLanguageChange); // NOVO

// Iniciar o app
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`🎧 Huddle Notifier rodando na porta ${port}!`);
})();
