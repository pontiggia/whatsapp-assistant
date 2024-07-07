# WhatsApp Assistant

WhatsApp Assistant is a Node.js application designed to automate event scheduling through WhatsApp messages. It integrates with Google Calendar to check for event conflicts and create new events, and uses OpenAI's GPT-3.5 model to understand and process user requests.

## Features

- **WhatsApp Integration**: Receive and respond to WhatsApp messages using Twilio's API.
- **Event Scheduling**: Schedule events on Google Calendar based on user requests.
- **Natural Language Processing**: Leverage OpenAI's GPT-3.5 model to parse event details from natural language inputs.
- **Conflict Detection**: Automatically detect scheduling conflicts before creating new events.

## Prerequisites

- Node.js installed on your machine.
- A Twilio account and a WhatsApp number configured for messaging.
- A Google Cloud account with the Calendar API enabled.
- An OpenAI API key for accessing GPT-3.5.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsapp-assistant.git
```

2. Navigate to the project directory:
```bash
cd whatsapp-assistant
```

3. Install the dependencies:
```bash
npm install
```

4. Set up environment variables:
- Rename `.env.example` to `.env`.
- Fill in your Twilio, Google, and OpenAI credentials.

## Usage

1. Start the server:
```bash
npm start
```

2. Send a WhatsApp message to your Twilio number to interact with the assistant.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.