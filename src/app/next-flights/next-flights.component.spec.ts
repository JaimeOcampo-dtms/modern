import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NextFlightsComponent } from './next-flights.component';
import { NextFlightsModule } from './next-flights.module';

describe('NextFlightsComponent', () => {
  let component: NextFlightsComponent;
  let fixture: ComponentFixture<NextFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NextFlightsModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NextFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
