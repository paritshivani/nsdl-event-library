import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import{ labelMessages } from './../labels';
// import { TranslateService } from '@ngx-translate/core';
import { TimezoneCal } from '../../services/timezone/timezone.service';
import {EventListService} from '../../services/event-list/event-list.service';
import { SbToastService } from '../../services/iziToast/izitoast.service';
import { EventService } from '../../services/event/event.service';
import { LibEventService } from '../../services/lib-event/lib-event.service';
import { UsersService } from './../../services/users/users.service';
import { Router,ActivatedRoute } from '@angular/router';

import * as _ from 'lodash-es';

@Component({
  selector: 'sb-advance-event-detail',
  templateUrl: './advance-event-detail.component.html',
  styleUrls: ['./advance-event-detail.component.scss']
})
export class AdvanceEventDetailComponent implements OnInit {
  @Input() eventDetailItem: any;
  @Input() layoutConfig;
  @Output() eventDetailData = new EventEmitter();

  labelMessages= labelMessages;
  isTruncate : boolean = false;
  timezoneshort: string;
  Filterdata:any;
  query : any;
  similarEventList : any;
  eventConfig: any;
  userId:any;
  itemList : number[]=[];
  userName:any;
  attendanceList:any;
  isOpen = false;
  constructor(
    // public translate: TranslateService,
    private eventListService:EventListService,
    private sbToastService: SbToastService,
    private eventService: EventService,
    private libEventService: LibEventService,
    private usersService: UsersService,
    private router: Router,
    private timezoneCal: TimezoneCal) {
      this.timezoneshort = this.timezoneCal.timeZoneAbbreviated();

    }

  ngOnInit() {
    this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
    this.userId = this.eventConfig.id;
    this.userName = this.eventConfig.firstName + " " + this.eventConfig.lastName;
    console.log(this.eventConfig);
    this.similarEvents(this.eventDetailItem);
    this.getSpeakersList(this.userId);
    this.getAttendeeList(this.eventDetailItem.identifier);
    // this.getAttendeeList();
  }

  // development for scroller
  scrollToTop(el) {
    el.scrollTop = 0;
  }


  slideConfig = { "slidesToShow": 3, "slidesToScroll":2 };

  truncateData(truncate)
  {
    this.isTruncate = truncate;
  }

  switchLang(lang: string) {
    // this.translate.use(lang);
  }

  similarEvents(eventDetailItem)
  {

    this.Filterdata ={
      "status":["live"],
      "objectType": "Event",
      "subject": eventDetailItem.subject,
      "medium": eventDetailItem.medium,
      "board": eventDetailItem.board,
      "gradeLevel":[eventDetailItem.gradeLevel]
    };

    this.eventListService.getEventList(this.Filterdata,this.query).subscribe((data) => {
      if (data.responseCode == "OK")
        {
          this.similarEventList = data.result.Event;

          this.similarEventList.forEach((item, index) => {
              var array = JSON.parse("[" + item.venue + "]");
              this.similarEventList[index].venue = array[0].name;
          });

          this.similarEventList.forEach(async event => {

             this.eventService.getEventStatus(event);
           });
        }
      },
       (err) => {
        this.sbToastService.showIziToastMsg(err.error.result.messages[0], 'error');
      });
  }

  playContent(content){
    this.eventDetailData.emit(content);
  }

  navToEventDetail(res){
    // console.log("res",res.identifier);
    this.eventDetailData.emit(res);

    // this.router.navigate(['/play/event-detail'], {
    //   queryParams: {
    //     identifier: res.identifier
    //   }
    // });

  //   this.router.navigateByUrl('/play/event-detail', { skipLocationChange: true }).then(() => {
  //     this.router.navigate(['EventDetailComponent']);
  // });
}

  slickInit(event) { }

  getSpeakersList(id)
  {
    this.usersService.getUser(id).subscribe((data) => {
      });
  }

  // getAttendeeList()
  // {
  //   for(var i=0; i<100; i++){
  //     this.itemList.push(+i)
  //   }
  // }

  getAttendeeList(eventId)
  {
    let filters ={
      "courseId": eventId,
      "enrollmentType": "open"
   };

    this.eventService.getBatches(filters).subscribe((res) => {
      if (res.responseCode == "OK")
      {
        this.eventService.getAttendanceList(eventId,res.result.response.content[0]['batchId']).subscribe((data) => {
         this.attendanceList = data.result.content;
         console.log("attendanceList-",this.attendanceList);
        //  this.getEnrollEventUsersData(this.attendanceList);
       });
      }
    })
  }
}
