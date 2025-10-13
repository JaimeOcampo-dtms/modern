import { createProperty, orProperty } from "@angular/forms/signals";

//
//  Property
//
export const CITY = createProperty<boolean>();


//
//  AggregateProperty
//
export const CITY2 = orProperty();