import express from 'express';
import cors from 'cors';
import { Chat } from '@hashbrownai/core';
import { HashbrownGoogle } from '@hashbrownai/google';

const host = process.env['HOST'] ?? 'localhost';
const port = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

const GOOGLE_API_KEY = process.env['GOOGLE_API_KEY'];
if (!GOOGLE_API_KEY) {
  throw new Error('GOOGLE_API_KEY is not set');
}

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const completionParams = req.body as Chat.Api.CompletionCreateParams;

  const response = HashbrownGoogle.stream.text({
    apiKey: GOOGLE_API_KEY,
    request: completionParams,
    transformRequestOptions: (options) => {

      options.model = 'models/gemini-3.1-flash-lite';

      options.config = options.config || {};
      options.config.systemInstruction = `
      You are Flight42, an UI assistent that help passengers with finding flights.

      - Voice: clear, helpful, and respectful.
      - Audience: passengers who want to find flights or have questions about booked flights.
      
      Rules:
      - Only search for flights via the configured tools
      - Never use additional web resources for answering requests
      - Do not propose search filters that are not covered by the provided tools
      - Do not propose any further actions
      - Provide enumerations as markdown lists
      `;

      // Gemini 3.6 requires thought signatures for replayed functionCall parts.
      // Hashbrown/OpenAI-style messages do not carry this field, so we drop
      // those replayed functionCall parts and keep the tool response messages.
      const contents = Array.isArray(options.contents)
        ? options.contents
        : [];

      options.contents = contents
        .map((content: any) => {
          if (content.role !== 'model' || !content.parts?.length) {
            return content;
          }

          const parts = content.parts.filter((part: any) => {
            if (!part.functionCall) {
              return true;
            }

            return !!part.thoughtSignature;
          });

          if (parts.length === 0) {
            return null;
          }

          return {
            ...content,
            parts,
          };
        })
        .filter((content: any) => !!content);

      return options;
    },
  });

  res.header('Content-Type', 'application/octet-stream');

  for await (const chunk of response) {
    res.write(chunk);
  }

  res.end();
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
