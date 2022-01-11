import { Component, OnInit } from '@angular/core';
import { EventCreateService } from '../../../projects/event-library/src/lib/events/services/event-create/event-create.service';
import { Router } from '@angular/router'
import { EventDetailService } from './../../../projects/event-library/src/lib/events/services/event-detail/event-detail.service';
import { LibEventService } from './../../../projects/event-library/src/lib/events/services/lib-event/lib-event.service';
import * as _ from 'lodash-es';
@Component({
  selector: 'app-user-fom',
  templateUrl: './user-fom.component.html',
  styleUrls: ['./user-fom.component.scss']
})
export class UserFomComponent implements OnInit {
  isDetail = false;
  eventItem : any;
  userId :any;
  formFieldProperties: any;
  eventConfig: any;

  constructor(private eventCreateService: EventCreateService,
    private eventDetailService: EventDetailService ,
    private router: Router,
    private libEventService: LibEventService) { 

    }

  ngOnInit() {
    this.showEventCreatePage();
    this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
    this.userId=this.eventConfig.id;
  }

  showEventCreatePage() {
    this.eventCreateService.getEventFormConfig().subscribe((data: any) => {
      this.formFieldProperties = data.result['form'].data.fields;
     })
  }
  
  cancel(){
    this.router.navigate(['/demo']);
  }

  navAfterSave(res){
    //  alert(res.result.identifier);
     this.eventDetailService.getEvent(res.result.identifier).subscribe((data: any) => {
      this.eventItem = data.result.event;
    this.isDetail = true;

    },
      (err: any) => {
        console.log('err = ', err);
      });
   // this.eventItem = res.result.event;
   // alert('hi');
  }

  getId(res)
  {
    this.router.navigate(['/form'], {
      queryParams: {
        identifier: res.identifier,
        versionKey:res.versionKey
      }
      
    });
    
    setTimeout(function(){
      this.window.location.reload();
    },2000);
  }



}
