import { Injectable } from '@angular/core';
import { UserConfigService } from '../userConfig/user-config.service';
import { DataService } from '../data-request/data-request.service';

@Injectable({
  providedIn: 'root'
})
export class EventListService {

  constructor(
    private userConfigService: UserConfigService,
    private dataService: DataService) {
  }

    /**
   * For get event list
   */
     getEventList(filterValue,query?:any)
     {
        const requestBody = {
          "request": {
            "filters":filterValue,
            "query":query,
            }
          }

        const option = {
          url: this.userConfigService.getConfigUrl().search,
          data: requestBody,
          header: { 'Content-Type' : 'application/json'}
        };

        return this.dataService.post(option);
    }

   /**
   * For getting filter config
   */
    /**
   * For get event form config
   */
    //  getFilterFormConfig() {
    //   const req = {
    //     url: this.userConfigService.getConfigUrl().eventFilterConfigApi
    //   };
    //   return this.dataService.get(req);
    // }

    getFilterFormConfig() {

      const requestBody = {
        request: {
          "type": "content",
          "subtype": "event",
          "action": "filter",
          "component": "*",
          "framework": "*",
          "rootOrgId":"*"
        }
      };

      const req = {
        url: this.userConfigService.getConfigUrl().eventFilterConfigApi,
        data: requestBody,
        header: { 'Content-Type' : 'application/json'}
      };

      return this.dataService.post(req);
    }

    getMyEventsFilterFormConfig() {
      const requestBody = {
        request: {
          "type": "content",
          "subtype": "myevents",
          "action": "filter",
          "component": "*",
          "framework": "*",
          "rootOrgId":"*"
        }
      };
      const req = {
        url: this.userConfigService.getConfigUrl().myEventFilterConfigApi,
        data: requestBody,
        header: { 'Content-Type' : 'application/json'}
      };
      return this.dataService.post(req);
      // return this.dataService.get(req);
    }

  getMyEventList(userId) {
    const requestBody = {
      "request": {
        "userId": userId
      }
    }

    const BearerKey = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1S0xKdzBHRUd0M2VEMmlKNjJ1M05tRG1QY3Z6b0trWSJ9.6Av5aPfb_m22sCbbXdUKW3dQc8cRAt3tiIcCyGHjCzg";

    const option = {
      url: this.userConfigService.getConfigUrl().myEvents,
      data: requestBody,
      header: { 'Content-Type' : 'application/json', 'Authorization' : BearerKey}
    };

    return this.dataService.post(option);
  }

  // getEventFilters() {
     // return this.http.get<any>('assets/eventFilter.json');
  // }

  getCalenderlist() {
    const req = {
      url: this.userConfigService.getConfigUrl().calenderevent
    };

    return this.dataService.get(req);

  }

}
