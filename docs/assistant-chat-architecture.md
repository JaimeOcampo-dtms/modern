# Assistant Chat Architecture

This document explains how the assistant chat works end-to-end in this project.

## 1) End-to-end sequence

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant UI as AssistantChatComponent Angular
    participant HB as Hashbrown Angular Client
    participant API as Express Backend API chat
    participant LLM as Model Provider Google or OpenAI
    participant T as Frontend Tools
    participant S as App Stores and Services
    participant W as UI Widgets

    U->>UI: Type message and submit
    UI->>HB: Send user message

    Note over UI,HB: uiChatResource configuration
    Note over UI,HB: model from src app config ts
    Note over UI,HB: tools from createTool list
    Note over UI,HB: components flightWidget and messageWidget

    HB->>API: POST api chat stream request
    API->>LLM: stream text request

    alt Model answers without tool call
        LLM-->>API: Stream assistant response
        API-->>HB: Stream chunks octet stream
        HB-->>UI: UiChatMessage updates
        UI->>W: Render messageWidget or text
    else Model requests tool calls
        LLM-->>API: Stream tool call intent
        API-->>HB: Stream tool call
        HB->>T: Invoke matching frontend tool handler

        alt Data or navigation tool
            T->>S: Read or update store route or domain service
            S-->>T: Return tool result object
        end

        T-->>HB: Return tool result payload
        HB->>API: Continue chat with tool result
        API->>LLM: Continue completion with tool result
        LLM-->>API: Final assistant response
        API-->>HB: Stream response chunks
        HB-->>UI: Message and tool status updates
        UI->>W: Render widgets
    end
```

## 2) Frontend architecture

```mermaid
flowchart LR
    A["User Input - assistant-chat.component.html"] --> B["AssistantChatComponent submit"]
    B --> C["uiChatResource"]

    C --> C1["System Prompt - systemExtended"]
    C --> C2["Model from src/app/config.ts"]
    C --> C3["Tool Definitions - createTool"]
    C --> C4["Widget Exposure - exposeComponent"]

    C --> D["Hashbrown Provider - src/main.ts"]
    D --> E["Backend Stream Endpoint /api/chat"]

    C --> F["Tool Execution in Browser"]
    F --> F1["FlightBookingStore"]
    F --> F2["FlightDetailStore"]
    F --> F3["Router Navigation"]
    F --> F4["FlightService to External Flight API"]
    F --> F5["NextFlightsService Mock Booked Flights"]

    C --> G["ChatMessages Component"]
    G --> H["hb-render-message"]
    G --> I["Tool Status Badges"]
    H --> J["messageWidget"]
    H --> K["flightWidget"]
```

## 3) Backend architecture

```mermaid
flowchart TD
    A["Frontend Hashbrown Client"] --> B["Express POST api chat"]
    B --> C{"Backend Variant"}

    C --> D["server-google.ts"]
    C --> E["server-openai.ts"]

    D --> D1["HashbrownGoogle stream text"]
    D --> D2["GOOGLE API KEY"]
    D --> D3["transformRequestOptions"]
    D3 --> D31["Force model models gemini 3 1 flash lite"]
    D3 --> D32["Filter replayed functionCall parts without thoughtSignature"]

    E --> E1["HashbrownOpenAI stream text"]
    E --> E2["OPENAI API KEY"]

    D1 --> F["Chunked Stream Response"]
    E1 --> F
    F --> G["Content Type application octet stream"]
    G --> H["Frontend Receives Incremental Updates"]
```

## 4) Tool definition layer

All assistant tools are defined on the frontend as Hashbrown tools and passed into uiChatResource.

Current active tool list in AssistantChatComponent:

1. findFlights
2. getLoadedFlights
3. toggleFlightSelection
4. getCurrentBasket
5. displayFlightDetail
6. getBookedFlights
7. updateFlight
8. getCurrentRoute
9. getCurrentFlight
10. loadFlightsForRoutes

Important behavior notes:

- Several tools use withToolResultGuard(...) to enforce non-null return values and prevent repeated tool-call loops.
- Some tools are state readers (for example getLoadedFlights, getCurrentRoute).
- Some tools mutate app state (for example toggleFlightSelection, updateFlight).
- Some tools trigger navigation (for example findFlights, displayFlightDetail).
- Some tools call domain services for data loading (for example loadFlightsForRoutes via FlightService).

## 5) Configuration and model usage

Configuration influences assistant behavior at multiple levels:

1. Frontend model selection:
- src/app/config.ts sets model used by uiChatResource.

2. Frontend chat transport:
- src/main.ts provideHashbrown sets chat baseUrl to http://localhost:3000/api/chat.
- emulateStructuredOutput is enabled.

3. Backend provider and keys:
- server-google.ts requires GOOGLE_API_KEY.
- server-openai.ts requires OPENAI_API_KEY.
- npm start:backend runs server-google.ts by default.

4. Domain API base URL for flight data:
- src/assets/config.json provides baseUrl for FlightService through ConfigService.

## 6) Practical runtime picture

At runtime, there are two independent but connected pipelines:

1. Chat pipeline:
- User prompt -> uiChatResource -> backend /api/chat -> LLM stream -> UI message rendering.

2. Domain action pipeline:
- LLM tool decision -> frontend tool handler -> store/service/router updates -> tool result -> LLM follow-up response -> widget rendering.

This split is why the assistant can both answer in natural language and actively operate the app (search, navigate, select, update) in one conversation.
