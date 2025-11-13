import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Flight } from '../model/flight';
import { initAircraft } from '../model/aircraft';
import { Price } from '../model/price';

@Injectable()
export class NextFlightsService {
  load(): Observable<Flight[]> {
    const date = new Date().toISOString();
    const aircraft = initAircraft;
    const prices: Price[] = [];
    
    return of([
      { id: 1, from: 'Paris', to: 'London', date, delayed: false, prices, aircraft, delay: 0 },
      { id: 2, from: 'London', to: 'Paris', date, delayed: false, prices, aircraft, delay: 0 },
      { id: 3, from: 'Paris', to: 'Berlin', date, delayed: false, prices, aircraft, delay: 0 },
    ]);
  }
}
