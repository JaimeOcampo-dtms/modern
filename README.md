# Demo

## Trying out

1. Set the env variable `GOOGLE_API_KEY` or `OPENAI_API_KEY` to the API key you've got from your AI provider:
    ```bash
    export GOOGLE_API_KEY="<your-google-api-key>"

    # or
    export OPENAI_API_KEY="<your-openai-api-key>"
    ```
2. Start backend server:
    ```bash
    npm run start:backend
    ```

    This runs:
    ```bash
    npx tsx server-google.ts
    ```

    To use the OpenAI backend instead:
    ```bash
    npx tsx server-openai.ts
    
    ```
3. Define model to use in your `config.ts`
4. Start Angular frontend on port `4288`:
    ```bash
    npm run start:frontend
    ```

    This runs:
    ```bash
    ng serve --port 4288
    ```

## Troubleshooting

### Google Gemini: `400 Bad Request` after tool calls

If chat works for the first message but fails after a tool call, verify that:

1. You run through `server-google.ts` (this server includes a compatibility filter for replayed Gemini function-call parts without `thoughtSignature`).
2. Your tool handlers always return a structured result object.

Why this matters:

1. Some Gemini model/tool-call combinations can reject malformed replayed function-call parts.
2. Empty (`void`) tool results can cause repeated tool-call loops because the model does not receive a clear completion payload.

To prevent regressions, this project includes a tool-result guard helper in `src/app/ai-assistant/assistant-chat/tools/tool-result.guard.ts` and related tests in `src/app/ai-assistant/assistant-chat/tools/tool-result.guard.spec.ts`.