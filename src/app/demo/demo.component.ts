import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import {EventListService} from '../../../projects/event-library/src/lib/events/services/event-list/event-list.service';
import { EventCreateService } from '../../../projects/event-library/src/lib/events/services/event-create/event-create.service';
import { EventDetailService } from './../../../projects/event-library/src/lib/events/services/event-detail/event-detail.service';
import { SbToastService } from '../../../projects/event-library/src/lib/events/services/iziToast/izitoast.service';
import { LibEventService } from './../../../projects/event-library/src/lib/events/services/lib-event/lib-event.service';
import * as _ from 'lodash-es';
import * as userEnrollEventDetailsMock from '../../assets/api/userEnrollEventDetails'
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarEventTitleFormatter
} from 'angular-calendar';
import { typeOf } from 'projects/event-library/node_modules/uri-js/dist/esnext/util';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  yellow: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
};


@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  eventList : any;
  eventItem: any;
  enrollUsers: any;
  tab :string= "user-detail";
  userEnrollEventDetails: any = userEnrollEventDetailsMock.userEnrollEventDetailsMock.result.content;
  paginateLimit: number = 12;
  eventDetailItem: any;
  // userId: any = "1001";
  userId: any;
  eventConfig: any;
  formFieldProperties: any;
  filterConfig: any;
  isLoading: boolean =  true;
  myEvents: any[];
  myEventsCount : any;
  p: number = 1;
  collection: any[];
  //event-calender parameter
  eventCalender: any;
  events: CalendarEvent[];
  eventIdentifier = "do_2133909787676262401550";
  eventBatchId = "013390979383066624107";
  Filterdata :any;
  query:any;
  calendarEvents :any;
  dates:any;
  min:any;
  max:any;
  eventListCount: any;
  today = new Date();
  todayDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate())).slice(-2);
  yesterdayDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate()-1)).slice(-2);
  tommorrowDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.today.getDate()+1)).slice(-2);

  constructor(
    private eventListService:EventListService,
    private eventCreateService: EventCreateService,
    private eventDetailService: EventDetailService,
    private router: Router,
    private sbToastService: SbToastService,
    private libEventService: LibEventService )
  { }

  ngOnInit() {
    this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
    this.userId = this.eventConfig.id;

    this.showEventListPage();
    this.showEventCreatePage();
    this.showFilters();
    this.showMyEventListPage();
    this.showCalenderEvent();
    // console.log('@TODO this.eventListCount ::', this.eventListCount);
  }

     /* For get List of events
   */
  showEventListPage()
  {
        this.Filterdata = {
        "status":["live"],
        "objectType": "Event"
        };

        this.eventListService.getEventList(this.Filterdata).subscribe((data:any)=>{
        this.eventList = data.result.Event;
        this.eventListCount = data.result.count;

        this.eventList.forEach((item, index) => {

            var array = JSON.parse("[" + item.venue + "]");
            this.eventList[index].venue = array[0].name;
        });




        // console.log('@TODO this.data ::', data);

        this.isLoading = false;
      })
  }

   /**
   * For get List of events
   */
    showMyEventListPage()
    {
      let eventIds = [];
      this.eventListService.getMyEventList(this.userId).subscribe((data:any)=>{

        let  eventsList=  data.result.courses;
        // console.log('eventsList - ', eventsList);
        Array.prototype.forEach.call(data.result.courses, child => {
          eventIds.push(child.courseId);
        });

        if (eventsList.length != 0)
        {
          this.Filterdata ={
            "status":["live"],
            "objectType": "Event",
            "identifier": eventIds
            // "owner":this.userId
          };

          this.eventListService.getEventList(this.Filterdata).subscribe((data) =>{
            if (data.responseCode == "OK")
              {
                this.myEvents = data.result.Event;
                this.myEvents.forEach((item, index) => {
                   var array = JSON.parse("[" + item.venue + "]");
                   this.myEvents[index].venue = array[0].name;
                });

                this.myEventsCount = data.result.count;
                // console.log('My Events this.myEvents : ', data.result);
              }
            }, (err) => {
              this.isLoading=false;
              this.sbToastService.showIziToastMsg(err.error.result.messages[0], 'error');
            });
        }
        else
        {
            this.myEvents = [];
            // console.log('My Events typeof : ', typeof this.myEvents);
            // console.log('My Events length : ', this.myEvents.length);
        }
      });
  }

  /**
   * For subscibe click action on event card
   */
   navToEventDetail(event){
    this.router.navigate(['/play/event-detail'], {
      queryParams: {
        identifier: event.identifier
      }
    });

    // console.log('Demo Component - ', event.identifier);
  }


  Openview(view) {
    this.isLoading = true;
    if (view == 'list') {
      this.tab = 'list';
    } else if (view == 'detail') {
      this.tab = 'detail';
    }  else if (view == 'user-detail') {
      this.tab = 'user-detail';
    }
    else if (view == 'enrollUsersList')
    {
      // this.tab = 'enrollUsersList';
      this.router.navigate(['/enroll-users'], {
        queryParams: {
          identifier: this.eventIdentifier,
          batchid: this.eventBatchId
        }
      });
    } else if (view == 'calender') {
      this.tab = 'calender';
      //this.router.navigate(['/calender']);
    }
    else {
      // this.tab = 'form';
      this.router.navigate(['/form'], {
        queryParams: {
          // identifier: event.identifier
        }
      });
    }
    this.isLoading = false;
  }

  showEventCreatePage() {
    this.eventCreateService.getEventFormConfig().subscribe((data: any) => {
      this.formFieldProperties = data.result['form'].data.fields;
      this.isLoading = false;

      // console.log('EventCreate = ',data.result['form'].data.fields);
    })
  }

  cancel(){
    this.router.navigate(['/home']);
  }

  navAfterSave(res){
     //alert(res.result.identifier);
     this.eventDetailService.getEvent(res.result.identifier).subscribe((data: any) => {
      this.eventItem = data.result.event;
      this.tab = 'detail';
      this.isLoading = false;


    },
      (err: any) => {
        console.log('err = ', err);
      });
   // this.eventItem = res.result.event;
   // alert('hi');
  }

  showCalenderEvent() {
    this.Filterdata ={
      "status":["live"],
      "objectType": "Event"
    };

    this.eventListService.getEventList(this.Filterdata).subscribe((data: any) => {
      //       this.date=new Date();
      //  let latest_date =this.datepipe.transform(this.date, 'yyyy-MM-dd');
      // console.log("data = ");
      this.eventCalender = data.result.Event;

      // console.log(this.eventCalender)
      this.events = this.eventCalender.map(obj => ({

        start: new Date(obj.startDate),
        title: obj.name,
        starttime: obj.startTime,
        end: new Date(obj.endDate),
        // color: colors.red,
        // cssClass: obj.color,
        status: obj.status,
        onlineProvider: obj.onlineProvider,
        onlineProviderData: obj.onlineProviderData,
        audience: obj.audience,
        owner: obj.owner,
        identifier: obj.identifier,

      }));

      // console.log("after =>", this.events);

    })
  }

  showFilters() {
    this.eventListService.getFilterFormConfig().subscribe((data: any) => {
      this.filterConfig = data.result['form'].data.fields;
      this.isLoading = false;
    },
    (err: any) => {
      console.log('err = ', err);
    });
  }

  getFilteredData(event)
  {
    if(event.search)
    {
      this.Filterdata ={
        "status":["live"],
        "objectType": "Event",
      };
      this.query=event.target.value;
    }
    else if((event.filtersSelected.eventTime) && (event.filtersSelected.eventType))
    {
      switch (event.filtersSelected.eventTime) {
        case "Past":
          this.dates={
            "max":this.yesterdayDate
          }
            break;
        case "Upcoming":
          this.dates={
            "min":this.tommorrowDate
          }
            break;
        default:
          this.dates={
            "min":this.todayDate,
            "max":this.todayDate
          }
              break;
      }
      this.Filterdata ={
        "status":["live"],
        "eventType" :event.filtersSelected.eventType,
        "startDate":this.dates,
        "objectType": "Event"
      };
    }
    else if(event.filtersSelected.eventType)
    {
        this.Filterdata ={
          "status":["live"],
          "eventType" :event.filtersSelected.eventType,
          "objectType": "Event"
        };
    }
    else if(event.filtersSelected.eventTime)
    {
        switch (event.filtersSelected.eventTime) {
          case "Past":
            this.dates={
              "max":this.yesterdayDate
            }
              break;
          case "Upcoming":
            this.dates={
              "min":this.tommorrowDate
            }
              break;
          default:
            this.dates={
              "min":this.todayDate,
              "max":this.todayDate
            }
          break;
        }
        this.Filterdata ={
          "status":["live"],
          "startDate" :this.dates,
          "objectType": "Event"
        };
    }
    else
    {
      this.Filterdata ={
        "status":["live"],
        "objectType": "Event"
      };
    }

    // Loader code
    this.tab == "list" ? this.isLoading = true : this.isLoading = false;

    this.eventListService.getEventList(this.Filterdata,this.query).subscribe((data) => {
      if (data.responseCode == "OK")
        {
          this.isLoading=false;
         delete this.eventList;
          this.eventList = data.result.Event;

          this.eventList.forEach((item, index) => {
            // if (item.eventType != 'Offline')
            {
              var array = JSON.parse("[" + item.venue + "]");
              // console.log('array- ', array, 'Index = ', index);
              this.eventList[index].venue = array[0].name;
            }
          });

          // For calendar events
          this.events = this.eventList.map(obj => ({
          start: new Date(obj.startDate),
          title: obj.name,
          starttime: obj.startTime,
          end: new Date(obj.endDate),
          color: colors.red,
          cssClass: obj.color,
          status: obj.status,
          onlineProvider: obj.onlineProvider,
          onlineProviderData: obj.onlineProviderData,
          audience: obj.audience,
          owner: obj.owner,
          identifier:obj.identifier,
          startDate:obj.startDate,
          endDate:obj.endDate,
          endTime:obj.endTime
          }));
        }
      }, (err) => {
        this.isLoading=false;
        this.sbToastService.showIziToastMsg(err.error.result.messages[0], 'error');
      });
  }
  navToUserAttendanceDetail(event){
    console.log('event ===== ', event);
    
  }
}
