import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { TranslateService } from '@ngx-translate/core';
import { TimezoneCal } from '../../services/timezone/timezone.service';
import{ labelMessages } from './../labels';

import { EventService } from '../../services/event/event.service';
@Component({
  selector: 'sb-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})

export class EventListComponent implements OnInit {

  @Input() list: any;
  @Input() paginateLimit: number = 12;
  @Input() myEvents: any;
  @Input() redirection: any = 'event';
  @Input() toSort;
  @Input() layoutConfig;

  @Input() eventListCount: any;
  @Input() myEventsCount: any;


  @Output() eventDetailData = new EventEmitter();
  @Output() redirectToDetail = new EventEmitter();

  today: any;
  todayDate: any;
  todayTime: any;
  isUserAbleToJoin: boolean = false;
  p: any;
  public showCarousalLists = true;
  public showMyEvents = false;
  public myEventsLists = false;
  public viewAllButton = true;
  labelMessages = labelMessages;

  constructor(
    private router: Router,
    // public translate: TranslateService,
    private eventService: EventService,
    private timezoneCal: TimezoneCal
  ) {
    //translate.setDefaultLang('en');
  }
  ngOnInit(){}

  ngOnChanges() {
    console.log('myEvents - ', this.myEvents);
   // Get all events
    if (this.list)
    {
      this.getEventStatus(this.list);
    }

    // Get my events
    if (this.myEvents)
    {
      this.getEventStatus(this.myEvents);
    }
  }

  playContent(content){
    this.eventDetailData.emit(content);
  }


  /*onEventWrapper(identifier) {
    this.router.navigate([this.redirection], {
      queryParams: {
        identifier: identifier,
        view: 'detail'
      }
    });
  }*/

  slideConfig = { "slidesToShow": 3, "slidesToScroll": 3 };

  slickInit(event) { }

  openMyEventList() {
    this.showCarousalLists = false;
    this.showMyEvents      = true;
    this.myEventsLists     = true;
    this.viewAllButton     = false;
  }

  CloseList() {
    this.showCarousalLists = true;
    this.showMyEvents      = false;
    this.myEventsLists     = false;
    this.viewAllButton     = true;
  }

  /** Get event Status and show on list view
   * 1. Past
   * 2. Ongoing
   * 3. Upcoming
   * */
  getEventStatus(eventList) {
     eventList.forEach(async event => {
       this.eventService.getEventStatus(event);
     });
  }

  /*onEventWrapper(identifier) {
    this.router.navigate([this.redirection], {
      queryParams: {
        identifier: identifier,
        view: 'detail'
      }
    });
  }*/

  // slideConfig = {"slidesToShow": 3, "slidesToScroll": 3};

  navToEventDetail(res){
      this.eventDetailData.emit(res);
    }
}
