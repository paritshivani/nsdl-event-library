import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe, Location } from '@angular/common'
import { CsvDownloadService } from '../../services/download/csv-download.service';
import { EventService } from '../../services/event/event.service';
import { Router } from '@angular/router';

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
  @Output() detailedReport = new EventEmitter<any>();
  
  p: any;
  showDownloadCodeBtn: boolean = true;
  arrayEnrollUsers: any = [];
  eventId: any;
  userId: any;

  constructor(
    public datepipe: DatePipe, 
    // public translate: TranslateService,
    private router: Router,
    private csvDownloadService: CsvDownloadService,
    private eventService: EventService, 
    private location: Location) { }

  ngOnInit(): void {
    if(this.eventDetailItem){
      this.eventId = this.eventDetailItem.identifier;
    }
   
  }

  getEnrollDataCsv(){
   
    this.enrollEventDetails.forEach(item => {
      var newArray: any = [];
      newArray.UserId = item.userId;
      newArray.UserName = item.fullName;
      newArray.Email = item.email;
      newArray.JoinTime = item.firstJoined;
      newArray.LeaveTime = item.lastLeft;
      newArray.Duration = item.duration;
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
    console.log("navToUserAttendanceDetail=====", event);
    this.detailedReport.emit (event);
  }
}
