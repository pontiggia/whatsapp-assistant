import { openai } from "../config.js";

export const getOpenAIResponse = async (messages) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return completion.choices[0].message.content;
};
