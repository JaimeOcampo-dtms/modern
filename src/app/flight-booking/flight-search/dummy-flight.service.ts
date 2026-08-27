import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Flight } from '../../model/flight';
import { FlightService } from './flight.service';

@Injectable()
export class DummyFlightService extends FlightService {
  override find(from: string, to: string): Observable<Flight[]> {
    const date = new Date().toISOString();

    return of([
      { id: 7, from, to, date, delayed: false, delay: 0 },
      { id: 8, from, to, date, delayed: false, delay: 0 },
      { id: 9, from, to, date, delayed: false, delay: 0 },
    ]);
  }
}
