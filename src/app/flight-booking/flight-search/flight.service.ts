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

  findResource(from: Signal<string>, to: Signal<string>) {
    return httpResource<Flight[]>(
      () => ({
        url: 'https://demo.angulararchitects.io/api/flight',
        params: {
          from: from(),
          to: to(),
        },
      }),
      { defaultValue: [] }
    );
  }

  createSaveFlightMuation(
    options: Partial<HttpMutationOptions<Flight, Flight>>
  ) {
    return httpMutation<Flight, Flight>({
      ...options,
      request: (flight) => ({
        url: 'https://demo.angulararchitects.io/api/flight/' + flight.id,
        method: 'PUT',
        body: flight,
      }),
      operator: concatOp,
    });
  }
}
