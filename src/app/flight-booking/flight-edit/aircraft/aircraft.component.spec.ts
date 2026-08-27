import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AircraftComponent } from './aircraft.component';

describe('AircraftComponent', () => {
  let component: AircraftComponent;
  let fixture: ComponentFixture<AircraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AircraftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AircraftComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
