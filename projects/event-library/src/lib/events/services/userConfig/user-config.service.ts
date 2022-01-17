import { Injectable } from '@angular/core';
import { EventLibraryService } from '../../../event-library.service';

@Injectable({
  providedIn: 'root'
})
export class UserConfigService {
  userId: string;
 
  constructor(
    private eventLibraryService: EventLibraryService
    ) 
    {
  }
  getConfigUrl() {
    return this.eventLibraryService.apiUrlConfig;
  }

}
