# Backend Flow: OpenAI Model

This document describes the backend request flow when using the OpenAI provider in this branch.

## Scope

- Server file: server-openai.ts
- Endpoint: POST /api/chat
- Provider SDK: @hashbrownai/openai
- Runtime key: OPENAI_API_KEY
- Model source: incoming completion request from frontend

## Sequence

```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend Hashbrown Client
    participant API as Express Server OpenAI
    participant O as HashbrownOpenAI
    participant M as OpenAI Model

    FE->>API: POST api chat with completion params
    API->>API: Validate OPENAI API KEY exists
    API->>O: stream text with apiKey and request
    O->>M: Send request as provided
    M-->>O: Stream response chunks
    O-->>API: Async stream iterator
    API-->>FE: Write chunked octet stream response
```

## Processing Stages

1. Input parsing
- Express receives JSON body and treats it as Chat.Api.CompletionCreateParams.

2. Provider call
- The server calls HashbrownOpenAI.stream.text with apiKey and request.
- No backend request transformation is applied in this variant.

3. Streaming response
- The server sets content type to application/octet-stream.
- It forwards each provider chunk to the frontend stream as it arrives.

## Minimal flowchart

```mermaid
flowchart TD
    A["Frontend POST api chat"] --> B["Express server-openai.ts"]
    B --> C["HashbrownOpenAI stream text"]
    C --> D["OpenAI model"]
    D --> E["Stream chunks back"]
    E --> F["Express writes octet stream"]
    F --> G["Frontend incremental updates"]
```
