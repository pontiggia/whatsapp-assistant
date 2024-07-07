const userSessions = {};

export const initializeSession = (userId) => {
  userSessions[userId] = {
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that helps users schedule events. Keep in mind that we are in year 2024. You always answer in Spanish.",
      },
      {
        role: "system",
        content: "When collecting event details, please respond in JSON format with the following fields: summary, description, startDateTime, endDateTime.",
      },
      {
        role: "system",
        content: "If you encounter an error or do not understand the user’s request, ask for clarification in a friendly manner instead of immediately restarting the session.",
      },
    ],
    state: "start",
    eventData: {},
  };
};

export const getSession = (userId) => userSessions[userId];

export const updateSession = (userId, update) => {
  userSessions[userId] = {
    ...userSessions[userId],
    ...update,
  };
};

export const addMessageToSession = (userId, message) => {
  userSessions[userId].messages.push(message);
};
