export class LocationDto {
  country: string;
  states: StateDto[];
}

export class StateDto {
  name: string;
  cities: string[];
}
