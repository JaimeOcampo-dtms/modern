import { openai } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, Tool, generateObject } from 'ai';
import express, { Request, Response } from 'express';
import cors from 'cors';
import z from 'zod';

const getLoadedFlightsTool: Tool = {
  name: 'getLoadedFlightsTool',
  description: `
    Returns the currently loaded/ displayed flights.

    Remarks:
    - This tool is NOT displaying the list with these flights to the user
    - This list is useful to answer questions about the current working set
    - Use this tool when the user is asking for flights in general but not when they are asking for
      "booked flights", "tickets" or when they ask for checking in to a flight
    - The returned flights are **not** booked. 
      If displayed with the flightWidget, use status: 'other' (!)
  `,
  inputSchema: z.object({}),
};

const toggleFlightSelectionTool: Tool = {
  name: 'toggleFlightSelection',
  description: `
      Selects a flight or deselects it. Selected flights are added to the basket.
  `,
  inputSchema: z.object(
    {
      flightId: z.number({
        description: 'id of flight to select or deselect',
      }),
      selected: z.boolean({
        description: 'whether flight should be selected or deselected',
      }),
    },
    { description: 'search parameters for flights' }
  ),
};

const getBookedFlightsTool: Tool = {
  name: 'getBookedFlights',
  description: `
    Returns the booked flights (aka next flights) of the current user.
    Only use this when the user explicitly asks for booked flights, tickets or checking in to a flight.
    The returned flights are booked. 
    Hence, if displayed with the flightWidget, use status: 'booked' (!)
  `,
  inputSchema: z.object({}),
};

const findFlightsTool: Tool = {
  name: 'findFlights',
  description: `
  Searches for flights and redirects the user to the result page where the found flights are shown.
  
  Remarks:
  - For the search parameters, airport codes are NOT used but the city name. First letter in upper case.
  `,
  inputSchema: z.object(
    {
      from: z.string({ description: 'airport of departure' }),
      to: z.string({ description: 'airport of destination' }),
    },
    { description: 'search parameters for flights' }
  ),
};

export const FlightSchema = z.object(
  {
    id: z.number({ description: 'The flight id' }),
    from: z.string({
      description: 'Departure city. No code but the city name',
    }),
    to: z.string({ description: 'Arrival city. No code but the city name' }),
    date: z.string({ description: 'Departure date in ISO format' }),
    delay: z.number({
      description: 'If delayed, this represents the delay in minutes',
    }),
  },
  { description: 'Flight to be displayed' }
);

const displayFlightTool: Tool = {
  name: 'displayFlightTool',
  description: `
    Renders a flight list component.
    Do not repeat the information in text.  `,
  inputSchema: z.object(
    {
      flight: FlightSchema,
      status: z.enum(['booked', 'other'], {
        description: `Whether the flight is booked or not. 
      
        A flight has the status 'booked' **only**  when retrieved 
        via the tool 'getBookedFlights'.
        
        ## Example for infering a status 'booked'
        - User: Which flights did I book?
        - Assistant:
            - Tool: getBookedFlights()
            - UI: flightWidget({flightInfo: { id: 0, ..., status: 'booked' }})

        ## Example for infering a status 'other'
        - User: Which of the found flights is the earliest one?
        - Assistant:
            - Tool: getLoadedFlights()
            - UI: flightWidget({flightInfo: { id: 0, ..., status: 'other' }})
        `,
      }),
    },
    { description: 'search parameters for flights' }
  ),
  execute: () => {
    return '';
  },
};

const app = express();
app.use(express.json({ strict: false, limit: '5mb' })); // Allow primitives (for analyze endpoint)
app.use(cors());

app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages } = req.body;
  const result = streamText({
    model: openai('gpt-5.2'),
    messages: await convertToModelMessages(messages),
    tools: {
      getLoadedFlightsTool,
      toggleFlightSelectionTool,
      getBookedFlightsTool,
      findFlightsTool,
      displayFlightTool,
    },
  });

  result.pipeUIMessageStreamToResponse(res);
});

app.post('/api/passport', async (req: Request, res: Response) => {
  console.log('completion, req.body', req.body);
  const { messages } = req.body;

  let result;

  try {
   result = await generateObject({
    model: openai('gpt-4o'),
    messages,
    schema: z.object({
      firstName: z.string(),
      lastName: z.string(),
      bookingReference: z.string(),
      // passportExpirationDate: z.date(),
    })
  });

  res.send(result.object);
  }
  catch(e) {
    console.log('Error!')
    console.log('e' ,e);
    console.log('result', result)
  }

});

app.listen(3000, () => {
  console.log(`Example app listening on port ${3000}`);
});
