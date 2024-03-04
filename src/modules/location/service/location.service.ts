import { Injectable } from '@nestjs/common';
import { LocationDto, StateDto } from '../dto/location.dto';
import { locationData } from '../location.data';

@Injectable()
export class LocationService {
  getLocationData(): LocationDto[] {
    // You can perform any additional logic or data processing here
    return locationData;
  }
}
