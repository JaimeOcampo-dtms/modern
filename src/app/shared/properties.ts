import { createProperty, orProperty, property } from "@angular/forms/signals";

export const CITY = createProperty<boolean>();

export const CITY2 = orProperty();