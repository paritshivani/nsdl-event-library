import { Component, OnInit, Input } from '@angular/core';
import { TimezoneCal } from '../../services/timezone/timezone.service';
import { EventService } from '../../services/event/event.service'
import { LibEventService } from '../../services/lib-event/lib-event.service';
import { SbToastService } from '../../services/iziToast/izitoast.service';
import * as _ from 'lodash-es';
@Component({
  selector: 'sb-join-event-button',
  templateUrl: './join-event-button.component.html',
  styleUrls: ['./join-event-button.component.scss']
})

export class JoinEventComponent implements OnInit {
  @Input() eventDetailItem: any;
  // @Input() userData: string;
  userData: any; //userId = userData by ankita
  eventConfig: any;
  @Input() canUnenroll: boolean = true;


  todayDateTime: any;
  isUserAbleToJoin: boolean = false;
  isEnrolled: boolean = false;
  today: any;
  todayDate: any;
  todayTime: any;
  startInMinutes: any;
  items: any;
  warningMessage: any;
  failedEnrollMentMsg: any;
  fullName :any;
  canEnroll: any;
  canJoin:any;
  toShowCounter: boolean = true;
  someDate:any;
  isStartDate2: boolean = false;
  isStartDate1: boolean = false;
  isDisabled: boolean = true;
  canRegister: boolean = false;
  eventRegistrationEndDate:any;
  registrationStarted:boolean=false;
  registrationStartDate:any;
  eventEnded:any
  muteUserPopUp: boolean = false;
  // muteUser: boolean = true;
  constructor(
    private eventService: EventService,
    private timezoneCal: TimezoneCal,
    private sbToastService: SbToastService,
    private libEventService: LibEventService
        ) {
  }

  ngOnInit() {
      this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
      this.userData = this.eventConfig.id;
      this.fullName = this.eventConfig.firstName+" "+this.eventConfig.lastName;

      if(this.eventDetailItem && this.userData)
      {

        let currentDate: Date = new Date();
        let eventStartDate: Date = new Date(this.eventDetailItem.startDate);
        let timeInMilisec: number = eventStartDate.getTime() - currentDate.getTime();
        let daysBetweenDates: number = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
        if(daysBetweenDates == 2){
          this.isStartDate2 = true;
        } else if(daysBetweenDates == 1)
        {
          this.isStartDate1 = true;
          this.isStartDate2 = false;
        }
        else
        {
          this.isStartDate1 = false;
          this.isStartDate2 = false;
        }
        this.isEnrollEvent();
        this.joinEvent();
      }
      this.someDate = new Date( Date.now() + (1 * 60) * 1000 );  
  }


  /**
   * For validate and show/hide join button
   */
  async joinEvent() {
    this.today = new Date();
    this.todayDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + this.today.getDate()).slice(-2);
    this.todayTime = this.today.getHours() + ":" + this.today.getMinutes();

    var todayDateTime = this.timezoneCal.calcTime(this.todayDate, this.todayTime);
    var startEventTime = await this.timezoneCal.calcTime(this.eventDetailItem.startDate, this.eventDetailItem.startTime);

    var startDifference = startEventTime.getTime() - todayDateTime.getTime();
    var startInMinutes = Math.round(startDifference / 60000);

    var endEventTime = this.timezoneCal.calcTime(this.eventDetailItem.endDate, this.eventDetailItem.endTime);

    var endDifference = todayDateTime.getTime() - endEventTime.getTime();
    var endInMinutes = Math.round(endDifference / 60000);

    // this.isUserAbleToJoin = true; // @TODO remove this commnet - (startInMinutes <= 10 && endInMinutes < 0) ? true : false;

    // To calculate days remaining for registration
    let registrationEndDate: Date = new Date(this.eventDetailItem.registrationEndDate);
    let timeInMilisec: number = registrationEndDate.getTime() - this.today.getTime();
    let RegistrationRemainingDays: number = Math.ceil(timeInMilisec / (1000 * 60 * 60 * 24));
    
    this.eventRegistrationEndDate =new Date(this.eventDetailItem.registrationEndDate);
    if(RegistrationRemainingDays >= -0){
      this.canRegister = true;
    } else
    {
      this.canRegister = false;
    }

    // To calculate days remaining to start for registration
    let registrationStartDate: Date = new Date(this.eventDetailItem.registrationStartDate);
    this.registrationStartDate =new Date(this.eventDetailItem.registrationStartDate);
    let timeInMilisecs: number = registrationStartDate.getTime() - this.today.getTime();
    let DaysToStartRegistration: number = Math.ceil(timeInMilisecs / (1000 * 60 * 60 * 24));

    // checking condition is pending
    if(DaysToStartRegistration <= -0){
      this.registrationStarted = true;
    } else
    {
      this.registrationStarted = false;
    }

    // // To calculate days remaining to event end
    // let eventEndDate: Date = new Date(this.eventDetailItem.endDate);
    // this.registrationStartDate =new Date(this.eventDetailItem.registrationStartDate);
    // let timeInMiliseconds: number = registrationStartDate.getTime() - this.today.getTime();
    // let DaysToStartRegistration: number = Math.ceil(timeInMiliseconds / (1000 * 60 * 60 * 24));

    // // checking condition is pending
    // if(DaysToStartRegistration <= -0){
    //   this.registrationStarted = true;
    // } else
    // {
    //   this.registrationStarted = false;
    // }
    this.isUserAbleToJoin = (startInMinutes <= 1 && endInMinutes < 0) ? true : false;
    this.eventEnded = (endInMinutes > 0) ? true : false;
    this.toShowCounter = (startInMinutes <= 0 && endInMinutes < 0) ? false : true;
  }

  /**
    * For check user is enrolled or not
    * @param courseId Event id
    * @param userId Log-in user Id 
    */
  isEnrollEvent() {
    this.eventService.getEnrollEvents(this.eventDetailItem.identifier, this.userData).subscribe((data) => {
      this.items = data.result.courses;

      this.items.find((o, i) => {
        if (o.courseId === this.eventDetailItem.identifier) {
          this.isEnrolled = true;
        }

      });
    });
  }

  /**
   * Enroll/Unenroll event
   * 
   * @param action enroll/unenroll 
   */
     enrollToEvent(action) {
       // Check whether Event has batch or not
      // filter set for serch batch for selected event
      let filters ={
          "courseId": this.eventDetailItem.identifier,
          "enrollmentType": "open"
       };

      this.eventService.getBatches(filters).subscribe((res) => {
          if (res.responseCode == "OK") 
          {
              if (res.result.response.count == 0)
              {
                // If batch not created then return the mssage
                this.warningMessage = 'Unable to enroll/de-enroll to this event. Batch is not created to that event OR event not publish yet.';
                this.failedEnrollMentMsg = 'Unable to enroll/de-enroll to this event.';
                
                this.sbToastService.showIziToastMsg(this.failedEnrollMentMsg, 'error');
                this.isEnrolled = false; 
              }
              else
              {
                let batchDetails = res.result.response.content[0];
                this.eventService.enrollToEventPost(action, 
                                                    this.eventDetailItem.identifier, 
                                                    this.userData, 
                                                    batchDetails).subscribe((res) => {
                  if (res.result.response == "SUCCESS")
                  {
                    if (action == "enroll")
                    {
                      this.isEnrolled = true;
                    }
                    else if (action == "unenroll")
                    {
                      this.isEnrolled = false;
                    } 
                  }

                });
              }
          }
      });
      
    }

  /**
   * For join event : check the online event Provider link for join
   */
    checkEventProvider()
    {
    if (this.eventDetailItem.onlineProviderData['meetingLink'])
     {
        // this.openProviderLink(this.eventDetailItem.onlineProviderData);
        this.openProviderLink(this.eventDetailItem.onlineProviderData['meetingLink']);
    } 
    else 
    {
        if (this.userData == this.eventDetailItem.owner)
        {
          this.muteUserPopUp = true;
        }
        else
        {
          // return attendeeMeetingLink
          this.eventService.getBBBURlAttendee(this.eventDetailItem.identifier,this.fullName,this.userData).subscribe((data) => {
            this.openProviderLink(data.result.event.attendeeMeetingLink);
          },(err: any) => {
            this.sbToastService.showIziToastMsg(err.error.params.errmsg, 'error');
          });
        }
        
      }
    }

    letModaratorJoinBBB(muted){
      console.log("letModaratorJoinBBB ====",muted  )
      this.muteUserPopUp = !this.muteUserPopUp
      // if(muted === 'true'){
        this.eventService.getBBBURlModerator(this.eventDetailItem.identifier,this.fullName,this.userData,muted).subscribe((data) => {
         console.log( data );
          this.openProviderLink(data.result.event.moderatorMeetingLink);
        },(err: any) => {
          this.sbToastService.showIziToastMsg(err.error.params.errmsg, 'error');
        });
      // }else(muted === 'false')
      // {
      //   this.eventService.getBBBURlModerator(this.eventDetailItem.identifier,this.fullName,this.userData,false).subscribe((data) => {
      //     this.openProviderLink(data.result.event.moderatorMeetingLink);
      //   },(err: any) => {
      //     this.sbToastService.showIziToastMsg(err.error.params.errmsg, 'error');
      //   });
      // }
    }
  /**
   * For join attain event
   * 
   * @param joinLink event join url
   */
  openProviderLink(joinLink) {
    window.open(joinLink, "_blank");
  }

  myTriggerFunction() {
    this.isDisabled= false;
    this.toShowCounter= false;
}
}
