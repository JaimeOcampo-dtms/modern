import { Component, input } from '@angular/core';
import { Field, FieldTree } from '@angular/forms/signals';
import { initPrice, Price } from 'src/app/model/price';
import { ValidationErrorsComponent } from 'src/app/shared/validation-errors/validation-errors.component';

@Component({
  selector: 'app-prices',
  imports: [Field, ValidationErrorsComponent],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css',
})
export class PricesComponent {
  prices = input.required<FieldTree<Price[]>>();

  addPrice(): void {
    const pricesForms = this.prices();
    pricesForms().value.update((prices) => [...prices, { ...initPrice }]);
  }
}
