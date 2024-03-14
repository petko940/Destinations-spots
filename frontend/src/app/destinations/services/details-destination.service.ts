import { Injectable } from '@angular/core';
import { Destination } from '../../types/destination';

@Injectable({
  providedIn: 'root'
})
export class DetailsDestinationService {
  destination!: Destination;
  destinationId!: number;

  constructor() { }
}
