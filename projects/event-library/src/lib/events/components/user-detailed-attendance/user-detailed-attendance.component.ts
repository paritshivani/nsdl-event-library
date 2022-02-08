import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { DatePipe, Location } from '@angular/common'
import { CsvDownloadService } from '../../services/download/csv-download.service';
import { EventService } from '../../services/event/event.service';
import { Router } from '@angular/router';
import { TimezoneCal } from '../../services/timezone/timezone.service';

@Component({
  selector: 'lib-user-detailed-attendance',
  templateUrl: './user-detailed-attendance.component.html',
  styleUrls: ['./user-detailed-attendance.component.css']
})
export class UserDetailedAttendanceComponent implements OnInit {
  @Input() userEnrollEventDetails: any;
  @Input() paginateLimit: number = 5;
  @Input() redirection: any = 'event';
  @Input() eventDetailItem: any;
  @Input() showCard : boolean;
  finalUserEnrollEventDetails: any;
  p: any;
  showDownloadCodeBtn: boolean = true;
  arrayEnrollUsers: any = [];
  isMenu: any;
  constructor(
    public datepipe: DatePipe,
    private router: Router,
    private timezoneCal: TimezoneCal,
    private csvDownloadService: CsvDownloadService,
    private eventService: EventService, 
    private location: Location) { }

  ngOnInit(): void {
    if(this.userEnrollEventDetails){
     
         this.finalUserEnrollEventDetails =  this.userEnrollEventDetails.joinedLeftHistory;
      }
  }
  getEnrollDataCsv(){
    var timezoneshort = this.timezoneCal.timeZoneAbbreviated();
    this.arrayEnrollUsers = []
    this.userEnrollEventDetails.joinedLeftHistory.forEach(item => {
      var newArray: any = [];
      newArray.EventName = this.eventDetailItem.name?this.eventDetailItem.name:'-';
      newArray.EventType = this.eventDetailItem.eventType?this.eventDetailItem.eventType:'-';
      newArray.UserName = this.userEnrollEventDetails.fullName?this.userEnrollEventDetails.fullName:'-';
      newArray.Email = this.userEnrollEventDetails.email?this.userEnrollEventDetails.email:'-';
      newArray.Provider = this.userEnrollEventDetails.provider?this.userEnrollEventDetails.provider:'-';
      // newArray.JoinTime = item.joinedDateTime?item.joinedDateTime:'-';
      // newArray.LeaveTime = item.leftDateTime?item.leftDateTime:'-';
      newArray.JoinTime = item.joinedDateTime? this.datepipe.transform(item.joinedDateTime, 'longDate') + ', ' + this.datepipe.transform(item.joinedDateTime, 'HH:mm') + '(' + timezoneshort + ')':'-';
      newArray.LeaveTime = item.leftDateTime? this.datepipe.transform(item.leftDateTime, 'HH:mm') + '(' + timezoneshort + ')':'-';
      newArray.Duration = item.duration?item.duration:'-';
      newArray.EnrollmentDate = this.eventService.convertDate(this.userEnrollEventDetails.enrolledDate);
      if (this.userEnrollEventDetails.status == 2)
      {
        newArray.AttendanceStatus = 'Present';
      }
      else
      {
        newArray.AttendanceStatus = 'Absent';
      }

      this.arrayEnrollUsers.push(newArray);
      
    });

    this.csvDownloadService.downloadFile(this.arrayEnrollUsers, 'event-report');
  }

  goBack(): void {
    this.location.back();
  }
  navToDashbord($event){
    
  }

}
