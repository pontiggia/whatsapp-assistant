import { google } from "googleapis";
import authorize from "./googleAuth.js";

export const createGoogleCalendarEvent = async (eventData, profileName) => {
  const auth = await authorize();
  const calendar = google.calendar({ version: 'v3', auth });

  const { summary, description, startDateTime, endDateTime } = eventData;

  const existingEvents = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date(startDateTime).toISOString(),
    timeMax: new Date(endDateTime).toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  if (existingEvents.data.items.length > 0) {
    throw new Error('Hay un conflicto con otro evento en el mismo rango de tiempo.');
  }

  // Crear el nuevo evento si no hay conflictos
  const event = {
    summary,
    description: description || `Evento creado por ${profileName}`,
    start: {
      dateTime: new Date(startDateTime).toISOString(),
      timeZone: 'America/Argentina/Buenos_Aires',
    },
    end: {
      dateTime: new Date(endDateTime).toISOString(),
      timeZone: 'America/Argentina/Buenos_Aires',
    },
  };

  const calendarResponse = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });

  return calendarResponse.data.htmlLink;
};
