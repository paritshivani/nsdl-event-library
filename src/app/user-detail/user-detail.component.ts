import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventDetailService } from './../../../projects/event-library/src/lib/events/services/event-detail/event-detail.service';
import { LibEventService } from './../../../projects/event-library/src/lib/events/services/lib-event/lib-event.service';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  eventItem: any;
  eventList: any;
  // userId: any = "999";
  userId: any;
  eventConfig: any;
  constructor(private eventDetailService: EventDetailService,
    private activatedRoute : ActivatedRoute,
    private libEventService: LibEventService
  
   ) { }

  ngOnInit() {
    this.showEventDetailPage();
    this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
    this.userId=this.eventConfig.id;
  }

 async showEventDetailPage() {
    await this.eventDetailService.getEvent('do_1132472335546777601366').subscribe((data: any) => {
      this.eventItem = data.result.event;
    },
      (err: any) => {
        console.log('err = ', err);
      });
  }

}
