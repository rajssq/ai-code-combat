/**
 * App Home - Página inicial multilíngue do Huddle Notifier
 * Suporta: Português, Inglês e Espanhol
 */
const { getTranslations, getUserLanguage } = require("../utils/translations");

async function handleAppHome({ event, client }) {
  try {
    const userId = event.user;
    const t = getTranslations(userId);
    const currentLang = getUserLanguage(userId);

    // Flag emojis para os idiomas
    const langFlags = {
      en: "🇬🇧",
      pt: "🇧🇷",
      es: "🇪🇸",
    };

    await client.views.publish({
      user_id: userId,
      view: {
        type: "home",
        callback_id: "home_view",
        blocks: [
          // Language selector no topo (discreto)
          {
            type: "actions",
            elements: [
              {
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: `${langFlags[currentLang]} ${t.changeLanguage}`,
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "🇬🇧 English",
                    },
                    value: "en",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "🇧🇷 Português",
                    },
                    value: "pt",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "🇪🇸 Español",
                    },
                    value: "es",
                  },
                ],
                initial_option: {
                  text: {
                    type: "plain_text",
                    text:
                      currentLang === "en"
                        ? "🇬🇧 English"
                        : currentLang === "pt"
                        ? "🇧🇷 Português"
                        : "🇪🇸 Español",
                  },
                  value: currentLang,
                },
                action_id: "change_language",
              },
            ],
          },
          { type: "divider" },

          // Hero section
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${t.appTitle}*\n${t.appSubtitle}`,
            },
          },
          { type: "divider" },

          // Quick actions
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${t.quickActions}*`,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: t.enableNotifications,
                },
                style: "primary",
                value: "enable_notifications",
                action_id: "enable_notifications_home",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: t.viewSettings,
                },
                value: "view_settings",
                action_id: "view_settings_home",
              },
            ],
          },
          { type: "divider" },

          // Features
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${t.whatItDoes}*`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${t.instantNotifications}*\n${t.instantNotificationsDesc}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${t.directMessages}*\n${t.directMessagesDesc}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${t.scheduleReminders}*\n${t.scheduleRemindersDesc}`,
            },
          },
          { type: "divider" },

          // Getting started
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${t.gettingStarted}*\n${t.gettingStartedDesc}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${t.step1}\n${t.step2}\n${t.step3}`,
            },
          },
          { type: "divider" },

          // Commands
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${t.availableCommands}*`,
            },
          },
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_list",
                style: "bullet",
                elements: [
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "text",
                        text: "/huddle-setup",
                        style: { code: true },
                      },
                      { type: "text", text: ` — ${t.commandSetup}` },
                    ],
                  },
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "text",
                        text: "/huddle-config",
                        style: { code: true },
                      },
                      { type: "text", text: ` — ${t.commandConfig}` },
                    ],
                  },
                  {
                    type: "rich_text_section",
                    elements: [
                      {
                        type: "text",
                        text: "/huddle-schedule",
                        style: { code: true },
                      },
                      { type: "text", text: ` — ${t.commandSchedule}` },
                    ],
                  },
                ],
              },
            ],
          },
          { type: "divider" },

          // Support
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${t.needHelp}*\n${t.needHelpDesc}`,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: t.documentation,
                },
                url: "https://github.com/rajssq/ai-code-combat",
                action_id: "view_docs",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: t.reportIssue,
                },
                url: "https://github.com/rajssq/ai-code-combat/issues",
                action_id: "report_issue",
              },
            ],
          },

          // Footer
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: t.footer,
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error("Erro ao publicar home:", error);
  }
}

// Handler para mudança de idioma
async function handleLanguageChange({ ack, body, client, action }) {
  await ack();

  const { setUserLanguage, getTranslations } = require("../utils/translations");
  const userId = body.user.id;
  const newLanguage = action.selected_option.value;

  // Salvar preferência
  setUserLanguage(userId, newLanguage);

  // Republicar home com novo idioma
  await handleAppHome({ event: { user: userId }, client });

  // Enviar confirmação
  const t = getTranslations(userId);
  try {
    await client.chat.postEphemeral({
      channel: userId,
      user: userId,
      text: `✓ ${t.languageChanged}`,
    });
  } catch (error) {
    console.error("Erro ao enviar confirmação:", error);
  }
}

// Handler para os botões da home
async function handleHomeActions({ ack, body, client }) {
  await ack();

  const { getTranslations } = require("../utils/translations");
  const userId = body.user.id;
  const t = getTranslations(userId);
  const action = body.actions[0];

  if (action.action_id === "enable_notifications_home") {
    try {
      await client.chat.postEphemeral({
        channel: userId,
        user: userId,
        text: t.howToEnable,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: t.howToEnable,
            },
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  } else if (action.action_id === "view_settings_home") {
    const { channelConfigs } = require("../storage/memory");
    const configuredChannels = Array.from(channelConfigs.keys());

    try {
      await client.chat.postEphemeral({
        channel: userId,
        user: userId,
        text: `${t.yourSettings} ${configuredChannels.length}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `${t.yourSettings} ${configuredChannels.length}`,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                configuredChannels.length > 0
                  ? `${t.notificationsEnabledIn}\n${configuredChannels
                      .map((id) => `• <#${id}>`)
                      .join("\n")}`
                  : t.noChannelsConfigured,
            },
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao mostrar settings:", error);
    }
  }
}

module.exports = { handleAppHome, handleHomeActions, handleLanguageChange };
