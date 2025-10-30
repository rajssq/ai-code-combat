const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: false,
  port: process.env.PORT || 3000,
  processBeforeResponse: true,
});
e;
if (!process.env.SLACK_BOT_TOKEN || !process.env.SLACK_SIGNING_SECRET) {
  console.error(
    "Erro: SLACK_BOT_TOKEN e SLACK_SIGNING_SECRET são obrigatórios"
  );
  process.exit(1);
}

module.exports = app;
