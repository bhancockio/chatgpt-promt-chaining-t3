# ChatGPT Prompt Chaining

ChatGPT Prompt Chaining is a web application that enables users to build a series of conversations in the form of prompts. With ChatGPT Prompt Chaining, you can conduct hundreds of conversations simultaneously and chain them together. This is achieved through the use of variable prompts, which allow you to substitute variables into your messages, enabling you to slightly tweak the messages that you send to the API.

## Get Started

To get started with ChatGPT Prompt Chaining, head over to https://chatgpt-promt-chaining-t3.vercel.app/.

## Key Terminology

- Conversation: A series of prompts
- Prompt: A message that will be sent to the ChatGPT API
- Context prompt: Sets the context for the entire conversation, such as telling ChatGPT it is a professional digital writer, etc.
- Normal prompt: Includes a message that will be sent to the API
- Variable prompt: Allows you to substitute variables into your messages

## Technologies

- NextJS
- Typescript
- Prisma
- React
- Tailwindcss
- Planetscale

## Future Todos

- Fix form issues where you have to click all fields.
- Incorporate responsiveness for mobile devices
- Incorporate hint boxes on user inputs to improve the user experience.
- Add a settings page so users can use their own OpenAI access tokens instead of mine.
- Add more loading spinners and feedback after a user finishes a new operation.
- Add the current conversation and prompt id to the URL so the user can navigate the website more easily.
- Add in unit and e2e testing w/ Cypress
- Conversation branching
- Run api/conversation elsewhere because of the Vercel 10 second execution duraiton cap.

## Support

- If you need help with Prompt Chaining, feel free to shoot me a DM https://twitter.com/bhancock_io or shoot me an email at brandon@brandonhancock.io
