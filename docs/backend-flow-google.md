# Backend Flow: Google Model

This document describes the backend request flow when using the Google provider in this project.

## Scope

- Server file: server-google.ts
- Endpoint: POST /api/chat
- Provider SDK: @hashbrownai/google
- Runtime key: GOOGLE_API_KEY
- Effective model set in backend transform: models/gemini-3.1-flash-lite

## Sequence

```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend Hashbrown Client
    participant API as Express Server Google
    participant G as HashbrownGoogle
    participant M as Gemini Model

    FE->>API: POST api chat with completion params
    API->>API: Validate GOOGLE API KEY exists
    API->>G: stream text with apiKey and request
    G->>G: transformRequestOptions
    G->>G: Force model to models gemini 3 1 flash lite
    G->>G: Filter replayed model functionCall parts without thoughtSignature
    G->>M: Send transformed request
    M-->>G: Stream response chunks
    G-->>API: Async stream iterator
    API-->>FE: Write chunked octet stream response
```

## Processing Stages

1. Input parsing
- Express receives JSON body and treats it as Chat.Api.CompletionCreateParams.

2. Provider call
- The server calls HashbrownGoogle.stream.text with apiKey and request.

3. Request transformation
- transformRequestOptions is used to normalize outgoing options.
- The model is explicitly overridden in the backend to models/gemini-3.1-flash-lite.
- Model role contents are filtered so replayed functionCall parts without thoughtSignature are dropped.

4. Streaming response
- The server sets content type to application/octet-stream.
- It forwards each provider chunk to the frontend stream as it arrives.

## Why the Google-specific filter exists

The server removes replayed functionCall parts that do not include thoughtSignature to avoid Gemini validation failures during tool-call replay. Tool responses are still preserved and the conversation can continue.

## Minimal flowchart

```mermaid
flowchart TD
    A[Frontend POST api chat] --> B[Express server-google.ts]
    B --> C[HashbrownGoogle stream text]
    C --> D[transformRequestOptions]
    D --> E[Force model gemini 3 1 flash lite]
    D --> F[Drop replayed functionCall parts without thoughtSignature]
    E --> G[Gemini model]
    F --> G
    G --> H[Stream chunks back]
    H --> I[Express writes octet stream]
    I --> J[Frontend incremental updates]
```
