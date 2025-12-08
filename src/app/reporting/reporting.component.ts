import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { createTool, structuredCompletionResource } from '@hashbrownai/angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { s } from '@hashbrownai/core';
import { FlightService } from '../flight-booking/flight-search/flight.service';
import { firstValueFrom } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-reporting',
  imports: [NgxChartsModule, FormsModule, JsonPipe],
  templateUrl: './reporting.component.html',
  styleUrl: './reporting.component.css',
})
export class ReportingComponent {
  data: { name: string; value: number }[] = [];

  message = signal('');
  input = signal<string | undefined>(undefined);

  generator = structuredCompletionResource({
    model: 'gpt-5-chat-latest',
    input: this.input,
    system: `
      You are Report42, an UI assistent that help passengers with creating and displaying
      a chart with flight information.

      - Voice: clear, helpful, and respectful.
      - Audience: power users who want to get a chart
      
      ## Your Tasks
      1. Take the users request for a chart 
      2. Think step by step and find out which tool calls with which parameters you need. You might need to call the same tool several times with different parameters. Make a plan about which tools to call.
      3. Execute your plan by calling the tools as often as needed to get the needed data
      4. Aggregate the received data according to the user's request
      5. Pass the data to the tool _generateChart_ to display a chart

      ## Example
      - User: How many flights are there from Graz to London and from Graz to Munich?
      - Assistant: 
          Tool Call 1: loadFlights({ from: 'Graz', to: 'London'})
          Tool Result 1: [{..., delay: 0, delayed: false}, {..., delay: 15, delayed: true }]
          Tool Call 2: loadFlights({from: 'Graz', to: 'Munich'})
          Tool Result 2: [{..., delay: 15, delayed: true }]
          Tool Call 3: generateChart([ 
            { name: 'Graz - London', value: 2 },  
            { name: 'Graz - Munich', value: 1 },  
          ])
          Answer: Here is your chart

      ## Rules
      - You MUST NOT call additional web resources for answering requests.
      - You MUST call loadFlights exactly once per route.
      - You MUST NOT combine multiple routes in a single tool call.
      - You MUST wait for each tool response before issuing the next tool call.
      - You MUST call generateChart as the last step.
    
      `,
    schema: s.object(`Whether request was successfull`, {
      type: s.enumeration(`Success or error?`, ['success', 'error']),
      message: s.string(`Addidional information for the user`),
    }),
    tools: [
      createTool({
        name: 'loadFlights',
        description: `
        Searches for flights and returns them.

        ## Rules
        - For the search parameters, airport codes are NOT used but the city name. First letter in upper case.
        - Only pass **one** object with search parameters!

        ## Example
        loadFlights({from: 'Graz', to: 'Munich' })

        ## Negative Example 
        Don't do this:

        loadFlights({from: 'Graz', to: 'Munich' }{from: 'Munich', to: 'Graz' })
        `,
        schema: s.object('search parameters for flights', {
          from: s.string('airport of departure'),
          to: s.string('airport of destination'),
        }),
        handler(input) {
          const flightService = inject(FlightService);
          const result = flightService.find(input.from, input.to);
          return firstValueFrom(result);
        },
      }),
      createTool({
        name: 'generateChart',
        description: `
          Erzeugt ein Chart
        `,
        schema: s.object(`Chart description`, {
          data: s.array(
            `name/value pairs to display in chart`,
            s.object(`a single name/value pair to display in the chart`, {
              name: s.string(`name`),
              value: s.number(`the value to display`),
            })
          ),
        }),
        handler: (input) => {
          this.data = input.data;
          return Promise.resolve('Chart wurde angezeigt!');
        },
      }),
    ],
  });

  submit(): void {
    this.input.set(this.message());
  }
}
