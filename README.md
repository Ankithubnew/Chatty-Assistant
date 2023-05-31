# Chatty Assistant

Chatty Assistant is a Facebook Messenger AI assistant that performs various tasks and provides multiple features. It utilizes the OpenAI API, particularly the ChatGPT model, to generate responses and handle different user requests.

## Features

1. **Remember Previous Payload**: Chatty Assistant remembers the user's previous payload and utilizes it to provide personalized responses.

2. **Image Generation**: Chatty Assistant can generate images based on user prompts using the OpenAI API. Simply provide a prompt, and the assistant will create an image accordingly.

3. **YouTube Video Summarization**: Chatty Assistant can summarize YouTube videos by fetching their transcripts and using the ChatGPT model to generate concise summaries.

4. **Truecaller Integration**: Chatty Assistant offers a Truecaller feature that allows users to retrieve information about Indian phone numbers available on the Truecaller platform.

5. **Credit-based System**: The assistant employs a credit-based system, where users are initially provided with 5 credits. Each feature usage deducts 1 credit. Users can check their remaining credits and refill them using promo codes.

6. **Admin Postback**: Chatty Assistant includes an admin postback feature that redirects users to Ankit's portfolio, showcasing his work as an admin.

## Getting Started

To get started with Chatty Assistant, follow these steps:

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies by running `npm install`.
3. Set up the necessary environment variables, such as `OpenAi_Api` for the OpenAI API key.
4. Ensure you have a MongoDB instance set up and provide the MongoDB connection URL as an environment variable.
5. Run the application using `npm start` or your preferred method.

## Usage

Once the application is up and running, users can interact with Chatty Assistant through Facebook Messenger. The following endpoints are available:

- `GET /webhook`: Handles the verification of the webhook.
- `POST /webhook`: Receives incoming messages and payloads from users.

Make requests to the appropriate endpoints to engage with the assistant.

## Dependencies

The following dependencies are used in this project:

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling tool.
- `openai`: Package for interacting with the OpenAI API.

Make sure to install these dependencies by running `npm install` before starting the application.

## Contributions

Contributions to Chatty Assistant are welcome! If you find any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue on the GitHub repository.

## Contact

For any inquiries or questions, please reach out to [Ankit](mailto:connecttoankit1@gmail.com).

---