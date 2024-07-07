import dotenv from "dotenv";
import twilio from "twilio";
import { OpenAI } from "openai";

dotenv.config();

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, OPENAI_API_KEY } = process.env;

export const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
export const openai = new OpenAI(OPENAI_API_KEY);
