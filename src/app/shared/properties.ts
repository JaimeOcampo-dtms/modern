import { createProperty, orProperty } from "@angular/forms/signals";

//
//  "regular" property
//
export const CITY = createProperty<boolean>();

//
//  aggregate property
//
export const CITY2 = orProperty();
