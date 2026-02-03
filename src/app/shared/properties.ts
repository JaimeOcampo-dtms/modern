import { createMetadataKey, MetadataReducer } from "@angular/forms/signals";

//
//  Property
//
export const CITY = createMetadataKey<boolean>();


//
//  AggregateProperty
//
export const CITY2 = createMetadataKey(MetadataReducer.or());