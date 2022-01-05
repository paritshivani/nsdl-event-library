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
  @Output() detailedReport: EventEmitter<{ eventId: string, userId?: any }> = new EventEmitter();
  finalUserEnrollEventDetails: any;
  p: any;
  showDownloadCodeBtn: boolean = true;
  arrayEnrollUsers: any = [];
  eventId: any = "eventId";
  userId: any = "userId";

  constructor(
    public datepipe: DatePipe, 
    // public translate: TranslateService,
    private router: Router,
    private csvDownloadService: CsvDownloadService,
    private eventService: EventService, 
    private location: Location) { }

  ngOnInit(): void {
    this.userEnrollEventDetails.forEach(element => {
      console.log("====element", element);

      if (element.userId == "6f7c0d19-dbc3-42a5-883c-6d7ae4b249d7")
      {
        this.finalUserEnrollEventDetails = element.joinedLeftHistory;
        console.log("finalUserEnrollEventDetails", this.finalUserEnrollEventDetails);
      }
    });
  }
  getEnrollDataCsv(){
   
    this.userEnrollEventDetails.forEach(item => {
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

  navToUserAttendanceDetail(eventId, userId) {
    console.log("navToUserAttendanceDetail", eventId, "eventId, userId", userId);
    this.detailedReport.emit ({ eventId: eventId, userId: userId });
    // this.router.navigate(['/detailed-attendance'], {
    //   queryParams: {
    //     eventId: eventId,
    //     userId:userId
    //   }
    // });
  }
}