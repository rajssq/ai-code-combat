const { huddleSchedules } = require("../storage/memory");

/**
 * Comando /huddle-schedule
 * Abre modal para agendar huddles recorrentes
 */
async function handleSchedule({ command, ack, client }) {
  await ack();

  try {
    await client.views.open({
      trigger_id: command.trigger_id,
      view: {
        type: "modal",
        callback_id: "schedule_huddle_modal",
        title: { type: "plain_text", text: "Agendar Huddle" },
        submit: { type: "plain_text", text: "Agendar" },
        blocks: [
          {
            type: "input",
            block_id: "huddle_time",
            element: {
              type: "timepicker",
              action_id: "time_select",
              initial_time: "10:00",
            },
            label: { type: "plain_text", text: "Horário" },
          },
          {
            type: "input",
            block_id: "huddle_channel",
            element: {
              type: "channels_select",
              action_id: "channel_select",
              placeholder: { type: "plain_text", text: "Selecione o canal" },
            },
            label: { type: "plain_text", text: "Canal" },
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
                text: "Mensagem opcional",
              },
            },
            label: { type: "plain_text", text: "Descrição" },
          },
        ],
      },
    });
  } catch (error) {
    console.error("Erro ao abrir modal de agendamento:", error.message);
  }
}

/**
 * Handler de submit do modal de agendamento
 */
async function handleScheduleSubmit({ ack, body, view, client }) {
  await ack();

  try {
    const values = view.state.values;
    const time = values.huddle_time.time_select.selected_time;
    const channel = values.huddle_channel.channel_select.selected_channel;
    const message =
      values.huddle_message.message_input.value || "Hora do huddle";

    const scheduleId = Date.now().toString();
    huddleSchedules.set(scheduleId, {
      time,
      channel,
      message,
      userId: body.user.id,
    });

    console.log(`Huddle agendado: ${time} em ${channel}`);

    await client.chat.postMessage({
      channel: body.user.id,
      text: `Huddle agendado para ${time} no canal <#${channel}>`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Agendamento criado*\n${time} • <#${channel}>`,
          },
        },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: message }],
        },
      ],
    });
  } catch (error) {
    console.error("Erro ao processar agendamento:", error.message);

    await client.chat
      .postMessage({
        channel: body.user.id,
        text: "Não foi possível criar o agendamento. Tente novamente.",
      })
      .catch(() => {});
  }
}

module.exports = { handleSchedule, handleScheduleSubmit };
