import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { DatePipe, Location } from '@angular/common'
import { CsvDownloadService } from '../../services/download/csv-download.service';
import { EventService } from '../../services/event/event.service';
import { Router } from '@angular/router';

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
  finalUserEnrollEventDetails: any;
  p: any;
  showDownloadCodeBtn: boolean = true;
  arrayEnrollUsers: any = [];

  constructor(
    public datepipe: DatePipe,
    private router: Router,
    private csvDownloadService: CsvDownloadService,
    private eventService: EventService, 
    private location: Location) { }

  ngOnInit(): void {
    if(this.userEnrollEventDetails){
    console.log("userEnrollEventDetails",this.userEnrollEventDetails);
        this.finalUserEnrollEventDetails =  this.userEnrollEventDetails.joinedLeftHistory;
      }
  }
  getEnrollDataCsv(){
    this.userEnrollEventDetails.joinedLeftHistory.forEach(item => {
      var newArray: any = [];
      newArray.UserId = this.userEnrollEventDetails.userId;
      newArray.UserName = this.userEnrollEventDetails.fullName;
      newArray.Email = this.userEnrollEventDetails.email;
      newArray.ContentId = this.userEnrollEventDetails.contentId;
      newArray.BatchId = this.userEnrollEventDetails.batchId;
      newArray.Provider = this.userEnrollEventDetails.provider;
      newArray.JoinTime = item.joinedDateTime;
      newArray.LeaveTime = item.leftDateTime;
      newArray.Duration = item.duration;
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

}
