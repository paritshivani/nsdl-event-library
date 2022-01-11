import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import{ labelMessages } from './../labels'
import { ActivatedRoute } from '@angular/router';
import { EventDetailService} from '../../services/event-detail/event-detail.service';
import { LibEventService } from '../../services/lib-event/lib-event.service';
import * as _ from 'lodash-es';
@Component({
  selector: 'sb-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventDetailComponent implements OnInit {

  labelMessages = labelMessages;
  @Input() eventDetailItem: any;
  // @Input() userData: any;
  userData: any; //userId = userData by ankita
  eventConfig: any;
  @Input() canUnenroll: boolean;
  queryParams: any;
  isNew: boolean;
  eventCreateService: any;
  formFieldProperties: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventDetailService:EventDetailService,
    private libEventService: LibEventService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
    });

    if (this.queryParams.identifier) {
     
      this.eventDetailService.getEvent(this.queryParams.identifier).subscribe((data: any) => {
        this.eventDetailItem = data.result.event;
      },
        (err: any) => {
          console.log('err = ', err);
        });
    }

    this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
    this.userData=this.eventConfig.id;   
  }
 
}





