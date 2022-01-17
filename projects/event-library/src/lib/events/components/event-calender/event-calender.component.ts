import {
  Component, OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Input, EventEmitter, Output, NgZone, ChangeDetectorRef, ViewEncapsulation
} from '@angular/core';
//import {EventListService} from '../../../projects/event-library/src/lib/events/services/event-list/event-list.service';
import { DatePipe } from '@angular/common';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarEventTitleFormatter,
  CalendarMonthViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent,
  CalendarWeekViewBeforeRenderEvent
} from 'angular-calendar';
import { CustomEventTitleFormatter } from '../../services/event-title-formatter/custom-event-title-formatter.provider';
import { Router } from '@angular/router';
import * as _ from 'lodash-es';
import { LibEventService } from '../../services/lib-event/lib-event.service';

import { EventListService } from '../../../events/services/event-list/event-list.service';
import { List } from 'immutable';
//import { ConsoleLogger } from 'test-node_modules/@angular/compiler-cli/ngcc';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },

};

@Component({
  selector: 'lib-event-calender',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './event-calender.component.html',
  encapsulation: ViewEncapsulation.None,
  //  styleUrls: ['./event-calender.component.css'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
  ],
  styles: [
    `
      .bgpink {
        background-color: whitesmoke !important;
      }
    `,
  ],
})
export class EventCalenderComponent implements OnInit {

  eventCalender: any;
  eventItem: any;
  eventDetaildata: any;
  isOwner = false;
  @Input() eventDetailItem: any;
  @Input() userData: any;
  @Input() canUnenroll: boolean;
  @ViewChild('modalContent', { static: true, read: TemplateRef }) modalContent: TemplateRef<any>;
  tempV: any;
  @Input() events;
  eventConfig: any;
  userId: any;
  @Input() paginateLimit: number = 12;
  @Input() layoutConfig;
  @Input() todayDates;
  @Input() todayCalenderEvent;
  @Input() tempFlags;
  p: any;
  view: CalendarView = CalendarView.Month;
  @Output() eventDetailData = new EventEmitter();


  CalendarView = CalendarView;
  closeResult = '';
  viewDate: Date = new Date();

  list: any;
  cardDateDisplys: any;
  dates: any;
  min: any;
  max: any;
  Filterdata: any;
  query: any;
  eventList: any;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  //events : CalendarEvent[];
  activeDayIsOpen: boolean = true
  tempCardDataEmptyMsg: boolean;

  constructor(private modal: NgbModal, private router: Router, public datepipe: DatePipe, private libEventService: LibEventService
    , private eventListService: EventListService, private zone: NgZone, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    //this.showCalenderEvent();
    this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
    this.userId = this.eventConfig.id;
    var tempDate = new Date(this.todayDates);
    this.cardDateDisplys = tempDate.toLocaleString('default', { month: 'short' }) + " " + tempDate.getDate() + " " + tempDate.getFullYear();
    // var d = new Date(todayDate);
    // this.cardDateDisplys = d.toLocaleString('default', { month: 'short' }) + " " + d.getDate() + " " + d.getFullYear();
    // var date = new Date();
    // var todayDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.getDate())).slice(-2);
    // this.dates = {
    //   "min": todayDate
    // }
    // this.Filterdata = {
    //   "status": ["live"],
    //   "startDate": this.dates,
    //   //"identifier":idList,
    //   "objectType": "Event"
    // };
    // this.eventListService.getEventList(this.Filterdata, this.query).subscribe((data) => {
    //   if (data.responseCode == "OK") {
    //     this.list = data.result.Event;
    //     this.list.forEach((item, index) => {
    //       // if (item.eventType != 'Offline')
    //       {
    //         var array = JSON.parse("[" + item.venue + "]");
    //         this.list[index].venue = array[0].name;
    //       }
    //     });
    //     this.tempV = 'resolve';
    //   }
    // }, (err) => {
    // });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    // to be checked with loggin id
    this.isOwner = (this.modalData.event['owner'] == this.userId) ? true : false;

    this.modal.open(this.modalContent);
  }

  dayClicked(date) {
    this.tempFlags = 0;
    var todayDate = date.date.getFullYear() + '-' + ('0' + (date.date.getMonth() + 1)).slice(-2) + '-' + ('0' + (date.date.getDate())).slice(-2);
    var tempDate = new Date(todayDate);
    //var idList : Array<String>;
    var idList: any = [];
    var tempVariable: any;
    this.cardDateDisplys = tempDate.toLocaleString('default', { month: 'short' }) + " " + tempDate.getDate() + " " + tempDate.getFullYear();
    if (date.events.length > 0) {
      for (var k in date.events) {
        tempVariable = date.events[k].identifier;
        idList.push(tempVariable);
      }

      this.dates = {
        "min": todayDate
      }
      this.Filterdata = {
        "status": ["live"],
        //"startDate": this.dates,
        "identifier": idList,
        "objectType": "Event"
      };
      this.eventListService.getEventList(this.Filterdata, this.query).subscribe((data) => {
        if (data.responseCode == "OK") {
          // this.list = data.result.Event;

          // this.list.forEach((item, index) => {
          //   // if (item.eventType != 'Offline')
          //   {
          //     var array = JSON.parse("[" + item.venue + "]");
          //     this.list[index].venue = array[0].name;
          //   }
          // });
          this.todayCalenderEvent = data.result.Event;
          this.todayCalenderEvent.forEach((item, index) => {
            {
              var array = JSON.parse("[" + item.venue + "]");
              this.todayCalenderEvent[index].venue = array[0].name;
            }
          });
          this.cdRef.detectChanges();
        }
      }, (err) => {
      });
    } else {
      this.tempFlags = true;
      this.tempCardDataEmptyMsg = true;
    }
    // this.list = date.events;
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }



  navToEventDetail(res) {

    var obj = res;
    this.eventDetaildata = {}

    this.router.navigate(['/event-post'], {
      queryParams: {
        identifier: obj.identifier
      }
    });


  }

  playContent(content) {
    this.eventDetailData.emit(content);
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      const dayOfMonth = day.date;
      var todayDate = dayOfMonth.getFullYear() + '-' + ('0' + (dayOfMonth.getMonth() + 1)).slice(-2) + '-' + ('0' + (dayOfMonth.getDate())).slice(-2);
      const currentDay = new Date();
      if (dayOfMonth < currentDay && todayDate != this.todayDates) {
        day.cssClass = 'bgpink';
      }
    });
  }

}
