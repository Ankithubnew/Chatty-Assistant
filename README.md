# Chatty Assistant

Chatty Assistant is a Facebook Messenger AI assistant that performs various tasks and provides multiple features. It utilizes the OpenAI API, particularly the ChatGPT model, to generate responses and handle different user requests.

## Features

1. **Remember Previous Payload**: Chatty Assistant remembers the user's previous payload and utilizes it to provide personalized responses.

2. **Image Generation**: Chatty Assistant can generate images based on user prompts using the OpenAI API. Simply provide a prompt, and the assistant will create an image accordingly.

3. **YouTube Video Summarization**: Chatty Assistant can summarize YouTube videos by fetching their transcripts and using the ChatGPT model to generate concise summaries.

4. **Truecaller Integration**: Chatty Assistant offers a Truecaller feature that allows users to retrieve information about Indian phone numbers available on the Truecaller platform.

5. **Credit-based System**: The assistant employs a credit-based system, where users are initially provided with 5 credits. Each feature usage deducts 1 credit. Users can check their remaining credits and refill them using promo codes.

6. **Admin Postback**: Chatty Assistant includes an admin postback feature that redirects users to Ankit's portfolio, showcasing his work as an admin.

### Screenshots

#### 1. First-Time User Experience
*When a user interacts with the bot for the first time, they receive a welcome message explaining the bot's features and how it can assist them.*

![First-Time User Experience](https://github.com/Ankithubnew/Chatty-Assistant/assets/120358743/d85d9731-1ade-4f31-870b-6dc1c8c97761)


#### 2. Clicking on "Get Started"
*After clicking on the "Get Started" button, the bot responds with a greeting and an introduction to the features it offers.*

![Clicking on "Get Started](https://github.com/Ankithubnew/Chatty-Assistant/assets/120358743/0dd7a3f0-ef66-4b2d-b544-26c2693aae4a)


#### 3. Remembering Previous Payloads
*Chatty Assistant remembers the user's previous payload and provides personalized responses based on that context.*

![Remembering Previous Payloads](https://github.com/Ankithubnew/Chatty-Assistant/assets/120358743/1a5feb41-5105-4db0-84d6-8b2f73b465ba)


#### 4. Image Generation
*Users can prompt the bot to generate images using the OpenAI API. Here, the bot generates an image based on the user's input.*

![Image Generation](https://github.com/Ankithubnew/Chatty-Assistant/assets/120358743/cbd4e39c-65a3-4d28-b7f6-345adf15f287)


#### 5. YouTube Video Summarization
*Chatty Assistant fetches the transcript of a YouTube video and uses the ChatGPT model to summarize its content.*

![YouTube Video Summarization](https://github.com/Ankithubnew/Chatty-Assistant/assets/120358743/6e9e9a1b-498a-4594-8f3c-981182ca4099)


#### 6. Truecaller Integration
*Users can utilize the Truecaller feature to retrieve information about Indian phone numbers available on the Truecaller platform.*

![Truecaller Integration](https://github.com/Ankithubnew/Chatty-Assistant/assets/120358743/431e8a85-0177-44d6-8091-cf1a29ef42a9)


#### 7. Credit-based System
*Chatty Assistant employs a credit-based system, where users start with 5 credits. Each feature usage deducts 1 credit. Users can check their remaining credits and refill them using promo codes.*

![Credit-based System](https://github.com/Ankithubnew/Chatty-Assistant/assets/120358743/8ddc20ea-0324-4017-bd1d-ec059df11d6d)


#### 8. Admin Postback
*The admin postback feature redirects users to Ankit's portfolio, showcasing his work as an admin.*

![Admin Postback](https://github.com/Ankithubnew/Chatty-Assistant/assets/120358743/57d65749-f6de-40d9-953e-7b0e0d760284)


## Getting Started

To get started with Chatty Assistant, follow these steps:

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies by running `npm install`.
3. Set up the necessary environment variables, such as `OpenAi_Api` for the OpenAI API key.
4. Ensure you have a MongoDB instance set up and provide the MongoDB connection URL as an environment variable.
5. Run the application using `npm start` or your preferred method.

## Usage

Once the application is up and running, users can interact with Chatty Assistant through Facebook Messenger.
However, please note that Facebook imposes certain restrictions and verification processes for public access to Messenger bots.
Please be aware that until this Messenger bot successfully completes the review process and gets approved by Facebook, it may not be accessible to the public.

Demo: [Facebook Page](https://www.facebook.com/profile.php?id=100092560165020)

Make requests with the appropriate payload to engage with the assistant.

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
