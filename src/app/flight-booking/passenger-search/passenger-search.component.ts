import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { required, Field } from '@angular/forms/signals';
import { compatForm } from '@angular/forms/signals/compat';

@Component({
  selector: 'app-passenger-search',
  imports: [Field, ReactiveFormsModule],
  templateUrl: './passenger-search.component.html',
  styleUrls: ['./passenger-search.component.css'],
})
export class PassengerSearchComponent {
  fb = inject(FormBuilder);

  address = this.fb.nonNullable.group({
    id: [0, Validators.required],
    street: ['', Validators.required],
    zipCode: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
  });

  passengerFormModel = signal({
    id: 1,
    name: 'Doe',
    firstName: 'John',
    bonusMiles: 13000,
    status: 'A',
    address: this.address,
  });

  passengerForm = compatForm(this.passengerFormModel, (path) => {
    required(path.id);
    required(path.name);
    required(path.firstName);
  });

  constructor() {
    this.passengerFormModel().address.valueChanges.subscribe(address => {
      console.log('address', address)
    });

    effect(() => {
      const passenger = this.passengerFormModel();
      console.log('passenger', passenger);
    });
  }
}
