import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText } from 'ai';
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(express.json({ strict: false })); // Allow primitives (for analyze endpoint)
app.use(cors());

app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages } = req.body;
  const result = streamText({
    model: openai('gpt-5.2'),
    messages: await convertToModelMessages(messages),
  });

  result.pipeUIMessageStreamToResponse(res);
});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});
