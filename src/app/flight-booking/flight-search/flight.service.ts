import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Flight, initFlight } from '../../model/flight';
import { ConfigService } from '../../shared/config.service';
import {
  concatOp,
  httpMutation,
  HttpMutationOptions,
  rxMutation,
} from '@angular-architects/ngrx-toolkit';
import { FlightFilter } from '../flight-filter';

export type MutationSettings<Params, Result> = Omit<
  HttpMutationOptions<Params, Result>,
  'request'
>;

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  find(from: string, to: string): Observable<Flight[]> {
    const url = `${this.configService.config.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { from, to };

    return this.http.get<Flight[]>(url, { headers, params });
  }

  findById(id: string): Observable<Flight> {
    const url = `${this.configService.config.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { id };

    return this.http.get<Flight>(url, { headers, params });
  }

  findResourceById(id: Signal<number>) {
    return httpResource<Flight>(
      () =>
        !id()
          ? undefined
          : {
              url: 'https://demo.angulararchitects.io/api/flight',
              params: {
                id: id(),
              },
            },
      {
        defaultValue: initFlight,
      }
    );
  }

  // TODO: Create Resource
  findResource(filter: Signal<FlightFilter>) {
    return httpResource<Flight[]>(() => ({
      url: 'https://demo.angulararchitects.io/api/flight',
      params: {
        from: filter().from,
        to: filter().to,
      },
    }), { defaultValue: [] });
  }

  createSaveMutation(
    options: Partial<HttpMutationOptions<Flight, Flight>>
  ): any {
    return httpMutation({
      ...options,
      request: (flight: Flight) => ({
        url: 'https://demo.angulararchitects.io/api/flight/' + flight.id,
        method: 'PUT',
        body: flight,
      }),
    });
  }
}
