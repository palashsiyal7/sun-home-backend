import { Controller, Get } from '@nestjs/common';
import { LocationService } from '../service/location.service';
import { LocationDto } from '../dto/location.dto';

@Controller()
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  getLocation(): LocationDto[] {
    return this.locationService.getLocationData();
  }
}
