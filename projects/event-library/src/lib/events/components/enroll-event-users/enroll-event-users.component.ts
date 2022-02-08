import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe, Location } from '@angular/common'
import { CsvDownloadService } from '../../services/download/csv-download.service';
import { EventService } from '../../services/event/event.service';
import { Router } from '@angular/router';
import { TimezoneCal } from '../../services/timezone/timezone.service';

@Component({
  selector: 'sb-enroll-event-users',
  templateUrl: './enroll-event-users.component.html',
  styleUrls: ['./enroll-event-users.component.css']
})
export class EnrollEventUsersComponent implements OnInit {

  @Input() enrollEventDetails: any;
  @Input() paginateLimit: number = 5;
  @Input() redirection: any = 'event';
  @Input() eventDetailItem: any;
  @Input() showCard : boolean;
  @Output() detailedReport = new EventEmitter<any>();
  isMenu : any;
  p: any;
  showDownloadCodeBtn: boolean = true;
  arrayEnrollUsers: any = [];
  eventId: any;
  userId: any;
  modifiedEventDetailItem: any;
  constructor(
    public datepipe: DatePipe,
    // public translate: TranslateService,
    private timezoneCal: TimezoneCal,
    private router: Router,
    private csvDownloadService: CsvDownloadService,
    private eventService: EventService, 
    private location: Location) { }

  ngOnInit(): void {
    if(this.eventDetailItem){
    //  this.modifiedEventDetailItem= this.eventService.getEventStatus(this.eventDetailItem);
    this.eventService.getEventStatus(this.eventDetailItem);
    this.eventId = this.eventDetailItem.identifier;
     //
    }
    
  }

  getEnrollDataCsv(){
  var timezoneshort = this.timezoneCal.timeZoneAbbreviated();
   this.arrayEnrollUsers = [];    
    this.enrollEventDetails.forEach(item => {
      var newArray: any = [];
      newArray.UserName = item.fullName?item.fullName:'-';
      newArray.Email = item.email?item.email:'-';
      // newArray.JoinTime = item.joinedDateTime? item.joinedDateTime:'-';
      // newArray.LeaveTime = item.leftDateTime?item.leftDateTime:'-';
      newArray.JoinTime = item.joinedDateTime? this.datepipe.transform(item.joinedDateTime, 'longDate') + ', ' + this.datepipe.transform(item.joinedDateTime, 'HH:mm') + '(' + timezoneshort + ')':'-';
      newArray.LeaveTime = item.leftDateTime? this.datepipe.transform(item.leftDateTime, 'HH:mm') + '(' + timezoneshort + ')':'-';
      newArray.Duration = item.duration?item.duration:'-';
      newArray.EnrollmentDate = this.eventService.convertDate(item.enrolledDate);

      if (item.status == 2)
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

  navToUserAttendanceDetail(event) {
    this.detailedReport.emit (event);
  }
}
