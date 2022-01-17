import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from './../../../projects/event-library/src/lib/events/services/event/event.service';
import { UsersService } from './../../../projects/event-library/src/lib/events/services/users/users.service';
import { EventDetailService } from './../../../projects/event-library/src/lib/events/services/event-detail/event-detail.service';

@Component({
  selector: 'app-enroll-users',
  templateUrl: './enroll-users.component.html',
  styleUrls: ['./enroll-users.component.scss']
})
export class EnrollUsersComponent implements OnInit {

  // eventIdentifier = "do_11322166143296307218"
  enrollData: any;
  queryParams:any;
  userData: any;
  attendanceList: any;
  eventUserEnrollData: any;
  eventItem: any;

  isLoading: boolean =  true;
  tab :string= "list";
  p: number = 1;

  constructor(
    private route: ActivatedRoute, 
    private eventService: EventService, 
    private router: Router, 
    private usersService: UsersService,
    private eventDetailService: EventDetailService
  ) { }

  ngOnInit() {
    // Get the url (query) params
    this.route.queryParams.subscribe((params) => {
      this.queryParams = params;
    });

    // Subsribe to the event detail service and get single event data
    this.eventDetailService.getEvent(this.queryParams.identifier)
        .subscribe((data: any) => {
          this.eventItem = data.result.event;
          this.isLoading = false;
    },(err: any) => {
      console.log('err = ', err);
    });

    // this.getEnrollEventUsersList();
    this.getAttendanceDetails();
  }
  
  getAttendanceDetails()
  {
    this.eventService.getAttendanceList(this.queryParams.identifier,this.queryParams.batchid).subscribe((data) => {
      this.attendanceList = data.result.response.content;
      this.getEnrollEventUsersData(this.attendanceList);
    });
  }

  getEnrollEventUsersData(list){
    this.attendanceList.forEach(item => {
      this.eventService.convertDate(item.enrolledDate);
    });

    this.eventUserEnrollData = this.attendanceList;
  }
  
  convert(event) {
    var date = new Date(event),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
    
    var datestr = [date.getFullYear(), mnth, day].join("/");

    return datestr;
  }
  
  Openview(view)
  {
    this.isLoading = true;

    if(view == 'list' )
    {
      this.router.navigate(['/demo'], { });
    }
    else if(view == 'detail')
    {
      this.tab = 'detail';
    }
    else if (view == 'enrollUsersList')
    {
      this.router.navigate(['/enroll-users'], {
        queryParams: {
          identifier: this.queryParams.identifier
        }
      });
    }
    else
    {
      this.router.navigate(['/form'], {
        queryParams: {
          // identifier: event.identifier
        }
      });
    }

    this.isLoading = false;
  }
}
