# Backend Flow Comparison: Google vs OpenAI

This document compares both backend provider paths implemented in this repository.

## Compared files

- server-google.ts
- server-openai.ts

## Side-by-side architecture

```mermaid
flowchart LR
    FE["Frontend Hashbrown Client"] --> API["Express POST api chat"]

    API --> G["Google Path server-google.ts"]
    API --> O["OpenAI Path server-openai.ts"]

    G --> G1["HashbrownGoogle stream text"]
    G1 --> G2["transformRequestOptions"]
    G2 --> G3["Force model models gemini 3 1 flash lite"]
    G2 --> G4["Drop replayed functionCall parts without thoughtSignature"]
    G3 --> GM["Gemini Model"]
    G4 --> GM
    GM --> GS["Chunk Stream"]

    O --> O1["HashbrownOpenAI stream text"]
    O1 --> OM["OpenAI Model"]
    OM --> OS["Chunk Stream"]

    GS --> R["Express writes application octet stream"]
    OS --> R
    R --> FEU["Frontend incremental chat updates"]
```

## Unified sequence with provider branch

```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend
    participant API as Express API
    participant P as Provider Adapter
    participant M as Model

    FE->>API: POST api chat completion params
    API->>API: Validate provider API key

    alt Google backend path
        API->>P: HashbrownGoogle stream text
        P->>P: transformRequestOptions
        P->>P: force gemini model
        P->>P: filter replayed functionCall parts without thoughtSignature
        P->>M: send transformed request
    else OpenAI backend path
        API->>P: HashbrownOpenAI stream text
        P->>M: send request as provided
    end

    M-->>P: stream response chunks
    P-->>API: async stream iterator
    API-->>FE: write application octet stream chunks
```

## Key differences

| Topic | Google path | OpenAI path |
|---|---|---|
| Server entry file | server-google.ts | server-openai.ts |
| Required env var | GOOGLE_API_KEY | OPENAI_API_KEY |
| Provider SDK | @hashbrownai/google | @hashbrownai/openai |
| Backend request transform | Yes | No |
| Model override in backend | Yes, models/gemini-3.1-flash-lite | No explicit override in server |
| Replay function-call compatibility filter | Yes | No |
| Response streaming to frontend | Yes | Yes |
| Response content type | application/octet-stream | application/octet-stream |

## Shared behavior

1. Both expose POST /api/chat in Express.
2. Both accept chat completion parameters from the frontend.
3. Both call provider stream.text and forward chunks incrementally.
4. Both return a streamed octet response for incremental UI updates.

## When to choose which path

1. Choose Google path when you need the Gemini-specific compatibility transform already implemented in this project.
2. Choose OpenAI path when you want a direct pass-through request flow without backend request mutation.
