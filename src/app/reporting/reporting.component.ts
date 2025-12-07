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
    model: 'gpt-4o',
    input: this.input,
    system: `
      You are Report42, an UI assistent that help passengers with creating and displaying
      a chart with flight information.

      - Voice: clear, helpful, and respectful.
      - Audience: power users who want to get a chart
      
      ## Your Tasks
      1. Take the users request for a chart and use the tool _loadFlights_ 
         as often as needed to retrieve the needed data
      2. Aggregate the received data according to the user's request
      3. Pass the data to the tool _generateChart_ to display a chart

      ## Example
      - User: How many flights are there from Graz to London and from Graz to Munich?
      - Assistant: 
          Tool Call: loadFlights({ from: 'Graz', to: 'London'})
          Tool: [{id: 17, ...}, {id: 37, ...}]
          Tool Call: loadFlights({from: 'Graz', to: 'München'})
          Tool: [{id: 19, ...}]
          Tool Call: generateChart([ 
            { name: 'Graz - London', value: 2 },  
            { name: 'Graz - München', value: 1 },  
          ])
          Answer: Here is your chart

      ## Rules
      - Never use additional web resources for answering requests
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
