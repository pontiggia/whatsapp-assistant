import MessagingResponse from "twilio/lib/twiml/MessagingResponse.js";
import { initializeSession, getSession, updateSession, addMessageToSession } from "../utils/session.js";
import { getOpenAIResponse } from "../utils/openai.js";
import { createGoogleCalendarEvent } from "../utils/calendar.js";

export const receiveWhatsappMessage = async (req, res) => {
  const { Body, From, ProfileName } = req.body;
  console.log(`Message from ${ProfileName} (${From}): ${Body}`);

  const twiml = new MessagingResponse();
  const userId = From;

  // Inicializar la sesión del usuario si no existe
  if (!getSession(userId)) {
    initializeSession(userId);
  }

  addMessageToSession(userId, { role: "user", content: Body });

  try {
    const session = getSession(userId);
    let response;
    switch (session.state) {
      case "start":
        response = await getOpenAIResponse(session.messages);
        updateSession(userId, { state: "collecting_event_data" });
        break;

      case "collecting_event_data":
        response = await getOpenAIResponse(session.messages);
        // Intentar extraer JSON de la respuesta de OpenAI
        let eventDetails;
        try {
          eventDetails = JSON.parse(response);
          updateSession(userId, {
            eventData: {
              summary: eventDetails.summary,
              description: eventDetails.description || `Evento creado por ${ProfileName}`,
              startDateTime: eventDetails.startDateTime,
              endDateTime: eventDetails.endDateTime,
            },
            state: "confirm_event",
          });
          response = `Evento: ${eventDetails.summary}\nDescripción: ${eventDetails.description}\nInicio: ${eventDetails.startDateTime}\nFin: ${eventDetails.endDateTime}\n\n¿Deseas confirmar este evento? (sí/no)`;
        } catch (error) {
          response = 'No entendí tu mensaje. Por favor proporciona los detalles del evento en el siguiente formato:\n\n{"summary": "Título del evento", "description": "Descripción del evento", "startDateTime": "YYYY-MM-DDTHH:MM:SS", "endDateTime": "YYYY-MM-DDTHH:MM:SS"}';
        }
        break;

      case "confirm_event":
        if (Body.toLowerCase() === "sí" || Body.toLowerCase() === "si") {
          try {
            // Verificar conflictos antes de crear el evento
            const htmlLink = await createGoogleCalendarEvent(session.eventData, ProfileName);
            response = `Evento creado: ${htmlLink}`;
          } catch (error) {
            console.error("Error creating event: ", error);
            response = error.message.includes('conflicto con otro evento') 
                ? "Hay un conflicto con otro evento en el mismo rango de tiempo. Por favor, elige otro horario."
                : "Hubo un error al crear el evento.";
          }
        } else {
          response = "Evento cancelado.";
        }
        // Reset the session
        initializeSession(userId);
        response += " ¿Hay algo más en lo que te pueda ayudar?";
        break;

      default:
        response = "No entendí tu mensaje. ¿Puedes repetirlo?";
        initializeSession(userId);
        break;
    }

    twiml.message(response);
  } catch (error) {
    console.error("Error getting response from OpenAI: ", error);
    twiml.message("Hubo un error al procesar tu mensaje.");
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
};