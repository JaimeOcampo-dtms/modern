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
