import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventCreateService } from '../../services/event-create/event-create.service';
import { EventDetailService } from '../../services/event-detail/event-detail.service';
import { EventService } from '../../services/event/event.service'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { SbToastService } from '../../services/iziToast/izitoast.service';
import { TimezoneCal } from '../../services/timezone/timezone.service';
// import { TranslateService } from '@ngx-translate/core';
import { UserConfigService } from '../../services/userConfig/user-config.service';
import { ImageSearchService } from '../../services/image-search/image-search.service';
import * as _ from 'lodash-es';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { LibEventService } from '../../services/lib-event/lib-event.service';
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';

@Component({
  selector: 'sb-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventCreateComponent implements OnInit {
  @Input('formFieldProperties') formFieldProperties: any;

  // @Input() userId: any;
  userId: any;
  eventConfig: any;
  initialFormFieldProperties: any;

  @Output() closeSaveForm = new EventEmitter();
  @Output() navAfterSave = new EventEmitter();

  today = new Date();
  todayDate = this.today.getFullYear() + '-' + ('0' + (this.today.getMonth() + 1)).slice(-2) + '-' + ('0' + this.today.getDate()).slice(-2);

  formValues: any;
  // startTime: any = (('0' + (this.today.getHours() + 1))).slice(-2) + ":" + ('0' + this.today.getMinutes()).slice(-2) + ":" + ('0' + this.today.getSeconds()).slice(-2);
  // endTime: any = (('0' + (this.today.getHours() + 2))).slice(-2) + ":" + ('0' + this.today.getMinutes()).slice(-2) + ":" + ('0' + this.today.getSeconds()).slice(-2);
  startTime: any = (('0' + (this.today.getHours() + 1))).slice(-2) + ":" + ('0' + this.today.getMinutes()).slice(-2);
  endTime: any = (('0' + (this.today.getHours() + 2))).slice(-2) + ":" + ('0' + this.today.getMinutes()).slice(-2);
  registrationStartDate: any = this.todayDate;
  registrationEndDate: any = this.todayDate;
  timeDiff: any;
  queryParams: any;
  eventDetailsForm: any;
  isSubmitted = false;
  formFieldData: any;
  FormData: any;
  isNew: boolean = true;
  timezoneshort: any;
  canPublish: boolean = false;
  offset = this.timezoneCal.getTimeOffset();
  constFormFieldProperties: any;
  flag: boolean = true;
  tempEventType = null;
  tempVisibility = null;
  tempRecuring: boolean = false;
  tempTypeRecuring = null;
  tempRepeatEveryRecurring = null;
  tempEndRecurring: boolean = false;
  tempEndRecVeriable: String;
  isDisabled: boolean = false;
  defaultTypeOfRecurring: String;
  weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  prefixes = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
  tempEndRecurringVar: String;
  eventValue :any;
  ImageConfig: any;
  // Ankita changes
  public showAppIcon = true;
  public appIconConfig = {
    code: "appIcon",
    dataType: "text",
    description: "appIcon of the content",
    editable: true,
    inputType: "appIcon",
    label: "Icon",
    name: "Icon",
    placeholder: "Icon",
    renderingHints: { class: "sb-g-col-lg-1 required" },
    required: true,
    visible: true
  }
  public appIcon : any;
  editmode: any;
  public showImagePicker = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventCreateService: EventCreateService,
    private eventDetailService: EventDetailService,
    private eventService: EventService,
    private router: Router,
    private location: Location,
    private sbToastService: SbToastService,
    private formBuilder: FormBuilder,
    private timezoneCal: TimezoneCal,
    // private translate: TranslateService,
    private userConfigService: UserConfigService,
    private imageSearchService: ImageSearchService,
    public libEventService: LibEventService) {

  }

  // Ankita changes
  setAppIconData() {
    const isRootNode = true;
    this.appIcon = this.queryParams?.appIcon;
    // this.appIcon = "";
    if (this.isReviewMode()) {
      this.appIconConfig = { ...this.appIconConfig, ... { isAppIconEditable: false } };
    } else {
      this.appIconConfig = { ...this.appIconConfig, ... { isAppIconEditable: true } };
    }
  }

  isReviewMode() {
    // this.imageSearchService.getEditMode().subscribe((data: any) => {
      this.editmode = 'edit';
    // });

    return _.includes(['review', 'read', 'sourcingreview'], this.editmode);
  }

  ngOnInit() {
    this.eventConfig = _.get(this.libEventService.eventConfig, 'context.user');
    this.userId=this.eventConfig.id;
    this.ImageConfig =  _.get(this.libEventService.eventConfig,'context');
    this.timezoneshort = this.timezoneCal.timeZoneAbbreviated();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams = params;
      if (this.queryParams?.identifier) {
        this.isNew = false;
      }
    });

    if (this.queryParams?.identifier) {
      this.eventCreateService.getEventFormConfig().subscribe((data: any) => {
        this.formFieldProperties = data.result['form'].data.fields;
      });

      this.eventDetailService.getEvent(this.queryParams?.identifier).subscribe((data: any) => {
        if(data.result.event.status == "Live")
        {
          this.isDisabled = true;
        }
        this.queryParams = data.result.event;
        setTimeout(() =>
          this.initializeFormFields(), 500);
          this.setAppIconData();
      },
        (err: any) => {
         
        });
    }

    if (!this.queryParams.identifier) {
      this.prepareFormConfiguration();
    }
    let group = {}
  }

  // Ankita changes
  ngOnChanges() {
    this.setAppIconData();
  }

  /**
   * For set event form config 
   */
  prepareFormConfiguration() {
    
    this.formFieldProperties.forEach(formField => {
      switch (formField.code) {
        case 'eventType':
          this.tempEventType = formField.default ? formField.default : null;
          this.setEventTypeDependentFields(formField.default);
          break;

        case 'visibility':
          this.tempVisibility = formField.default ? formField.default : null;
          this.setVisibilityDependentFields(formField.default);
          break;

        case 'registrationStartDate':
        case 'registrationEndDate':
        case 'startDate':
        case 'endDate':
          formField.default = this.todayDate;
          break;

        case 'startTime':
          formField.default = this.startTime;
          break;

        case 'endTime':
          formField.default = this.endTime;
          break;

        case 'recurring':
          this.tempRecuring = formField.default ? formField.default : null;
          this.setRecurringDependentFields(formField.default);
          break;

        case 'typeOfRecurring':
          this.tempTypeRecuring = formField.default ? formField.default : null;
          this.setTypeOfRecurringDependentFields(formField.default);
          break;

        case 'endRecurring':
          this.tempEndRecurring = formField.default ? formField.default : null;
          this.setEndRecurring(formField.default);
          break;
      }
    });
    this.onValueChangeUpdateFieldBehaviour();
  }

  /**
   * For setting event Dependent Fields 
   */
  setEventTypeDependentFields(value) {
    switch (value) {
      case 'Online':
        this.formFieldProperties[3].editable = false;
        this.formFieldProperties[5].editable = true;
        this.formFieldProperties[6].editable = true;
        break;

      case 'Offline':
        this.formFieldProperties[3].editable = true;
        this.formFieldProperties[5].editable = false;
        this.formFieldProperties[6].editable = false;
        break;

      case 'OnlineAndOffline':
        this.formFieldProperties[3].editable = true;
        this.formFieldProperties[5].editable = true;
        this.formFieldProperties[6].editable = true;
        break;

      default:
        this.formFieldProperties[3].editable = false;
        this.formFieldProperties[5].editable = false;
        this.formFieldProperties[6].editable = false;
        break;
    }
  }

  /**
   * For setting Visibility Dependent Fields 
   */
  setVisibilityDependentFields(value) {
    // Currrently in no use
    // switch (value) {
    //   case 'Parent':
    //     this.formFieldProperties[9].editable = true;
    //     this.formFieldProperties[8].editable = false;
    //     break;

    //   case 'Private':
    //     this.formFieldProperties[9].editable = false;
    //     this.formFieldProperties[8].editable = true;
    //     break;

    //   default:
    //     this.formFieldProperties[9].editable = false;
    //     this.formFieldProperties[8].editable = false;
    //     break;
    // }
  }

  output(event) {
  }

  onStatusChanges(event) {
  }

  initializeFormFields() {
    var editValues = {};
    var eventStart = (this.timezoneCal.calcTime(this.queryParams['startDate'], this.queryParams['startTime']));
    var eventEnd = (this.timezoneCal.calcTime(this.queryParams['endDate'], this.queryParams['endTime']));

    this.formFieldProperties.forEach(formField => {
      if (formField.code in this.queryParams) {
        if (formField.code == 'venue') {
          formField.default = this.queryParams[formField.code]['name'];
          editValues[formField.code] = this.queryParams[formField.code]['name'];
        }
        else if (formField.code == 'onlineProviderData') {
          formField.default = this.queryParams[formField.code]['meetingLink'];
          editValues[formField.code] = this.queryParams[formField.code]['meetingLink'];
        }
        else if (formField.code == 'eventType') {
          formField.default = this.queryParams[formField.code];
          editValues[formField.code] = this.queryParams[formField.code];
          this.setEventTypeDependentFields(formField.default);
        }
        else if (formField.code == 'startTime') {
          formField.default = (('0' + (eventStart.getHours()))).slice(-2) + ":" + ('0' + eventStart.getMinutes()).slice(-2) + ":" + ('0' + eventStart.getSeconds()).slice(-2),
            editValues[formField.code] = this.queryParams[formField.code];
        }
        else if (formField.code == 'endTime') {
          formField.default = (('0' + (eventEnd.getHours()))).slice(-2) + ":" + ('0' + eventEnd.getMinutes()).slice(-2) + ":" + ('0' + eventEnd.getSeconds()).slice(-2),
            editValues[formField.code] = this.queryParams[formField.code];
        } 
        else if (formField.code == 'visibility') {
          formField.default = this.queryParams[formField.code];
          editValues[formField.code] = this.queryParams[formField.code];
          this.setVisibilityDependentFields(formField.default);
        }
         else if (formField.code == 'recurring') {
          formField.default = this.queryParams[formField.code];
          editValues[formField.code] = this.queryParams[formField.code];
          this.setRecurringDependentFields_new(formField.default);
        } 
        else if (formField.code == 'typeOfRecurring') {
          formField.default = this.queryParams[formField.code];
          editValues[formField.code] = this.queryParams[formField.code];
          this.setTypeOfRecurringDependentFields(formField.default);
        } 
        else if (formField.code == 'endRecurring') {
          formField.default = this.queryParams[formField.code];
          editValues[formField.code] = this.queryParams[formField.code];
          this.setEndRecurring(formField.default);
        }
        else {
          formField.default = this.queryParams[formField.code];
          editValues[formField.code] = this.queryParams[formField.code];
        }
      }
    });

    this.formValues = editValues;
    this.formFieldData = this.formFieldProperties;
  }

  /**
   * For Changing values on event form
   */
  valueChanges(eventData) {
    if (eventData) {
      this.formValues = eventData;
      if (this.flag) {
        this.constFormFieldProperties = this.formFieldProperties;
        this.flag = false;
      }
      else {
        this.formFieldProperties = this.constFormFieldProperties;
        this.formFieldProperties.forEach(formField => {
          formField.default = eventData[formField.code];
        });
      }
    }

    let eventType;

    if (eventData.visibility != this.tempVisibility || eventData.eventType != this.tempEventType
      || eventData.typeOfRecurring != this.tempTypeRecuring || eventData.repeatEveryRecurring != this.tempRepeatEveryRecurring) {

      if (eventData.eventType != this.tempEventType) {
        this.tempEventType = eventData.eventType;
        this.setEventTypeDependentFields(eventData.eventType);
      }

      if (eventData.visibility != this.tempVisibility) {
        this.tempVisibility = eventData.visibility;
        this.setVisibilityDependentFields(eventData.visibility);
      }

      if (eventData.typeOfRecurring != this.tempTypeRecuring) {
        this.tempTypeRecuring = eventData.typeOfRecurring;
        this.setTypeOfRecurringDependentFields(eventData.typeOfRecurring);
      }

      if (eventData.repeatEveryRecurring != this.tempRepeatEveryRecurring) {
        this.tempRepeatEveryRecurring = eventData.repeatEveryRecurring;
        this.setRepeatEveryRecurringFields(eventData.repeatEveryRecurring);
      }

      this.onValueChangeUpdateFieldBehaviour();

    }

    if ((eventData.recurring == true && eventData.endRecurring != true) || (eventData.recurring == false && (this.tempRecuring == true || this.tempRecuring == false))) {
      this.tempRecuring = eventData.recurring;
      this.setRecurringDependentFields_new(eventData.recurring);
      this.onValueChangeUpdateFieldBehaviour();
    }

    if ((eventData.endRecurring == true && eventData.recurring != false) || (eventData.endRecurring == false && this.tempEndRecurring == true)) {
      this.tempEndRecurring = eventData.endRecurring;
      this.tempEndRecurringVar = String(eventData.endRecurring);
      this.setEndRecurring(eventData.endRecurring);
      this.onValueChangeUpdateFieldBehaviour();
    } else if (eventData.endRecurring == false && this.tempEndRecurringVar == "false") {
      this.setEndRecurring(eventData.endRecurring);
      this.onValueChangeUpdateFieldBehaviour();
    }
  }

  /**
   * For values change on form after change in checkbox, dropdown fields
   */
  onValueChangeUpdateFieldBehaviour() {
    const formFieldPropertiesConst = this.formFieldProperties;
    delete this.formFieldProperties;
    delete this.formFieldData;
    setTimeout(() => {
      this.formFieldProperties = formFieldPropertiesConst;
      this.formFieldData = formFieldPropertiesConst;
    }, 50);
  }

  /**
   * For validate data and call post form service
   */
  postData(canPublish) {
    this.isSubmitted = true;
    this.canPublish = canPublish;
    
    if (this.formValues == undefined) {
      this.sbToastService.showIziToastMsg("Please enter event name", 'warning');
    }
    else if (this.formValues.name == undefined || this.formValues.name.trim() == "") {
      this.sbToastService.showIziToastMsg("Please enter event name", 'warning');
    }
    else if (this.formValues.code == undefined) {
      this.sbToastService.showIziToastMsg("Please enter code", 'warning');
    }
    // else if ((this.formValues.startDate == undefined || this.formValues.startTime == undefined || !this.timeValidation(this.formValues.startDate, this.formValues.startTime)) && this.isNew) {
    //   this.sbToastService.showIziToastMsg("Please enter valid event start date and time", 'warning');
    // }
    // else if ((this.formValues.endDate == undefined || this.formValues.endTime == undefined || !this.timeValidation(this.formValues.endDate, this.formValues.endTime)) && this.isNew) {
    //   this.sbToastService.showIziToastMsg("Please enter valid event end date and time", 'warning');
    // }
    else if (this.formValues.registrationStartDate == undefined) {
      this.sbToastService.showIziToastMsg("Please enter valid event registration start date", 'warning');
    }
    else if (this.formValues.registrationEndDate == undefined) {
      this.sbToastService.showIziToastMsg("Please enter valid registration end date", 'warning');
    }
    else if (!this.dateValidation(this.formValues.startDate + " " + this.formValues.startTime, this.formValues.endDate + " " + this.formValues.endTime)) {
      this.sbToastService.showIziToastMsg("Event end date should be greater than start date", 'warning');
    }
    else if (!this.dateValidation(this.formValues.registrationStartDate, this.formValues.registrationEndDate)) {
      this.sbToastService.showIziToastMsg("Registration end date should be greater than registration start date", 'warning');
    }
    else if (!this.dateValidation(this.formValues.registrationStartDate + " 00:00:00", this.formValues.endDate)) {
      this.sbToastService.showIziToastMsg("Registration start date should be less than event end date", 'warning');
    }
    else if (!this.dateValidation(this.formValues.registrationEndDate + " 00:00:00", this.formValues.endDate)) {
      this.sbToastService.showIziToastMsg("Registration end date should be less than event end date", 'warning');
    }
    else {
      this.formValues = Object.assign(this.formValues)

      if (this.queryParams?.identifier) {
        this.formValues["identifier"] = this.queryParams.identifier;
      }
     

      this.formValues['onlineProviderData'] = (this.formValues['onlineProviderData'] != null) ? ({ "meetingLink": this.formValues['onlineProviderData'] }) : {};
      this.formValues['venue'] = { "name": this.formValues['venue'] };
      this.formValues['owner'] = this.userId;
      this.formValues['createdFor'] = this.eventConfig. organisationIds;
      // this.formValues['onlineProviderData'] = {};
      this.formValues['appIcon'] = this.appIcon;
      delete  this.formValues['recurring'];
      delete  this.formValues['typeOfRecurring'];
      delete  this.formValues['repeatEveryRecurring'];
      delete  this.formValues['countRepeatEveryRecurring'];
      delete  this.formValues['endRecurring'];
      
      // if (this.canPublish)
      // {
      //   this.formValues['status'] = 'Live';
      // }
     
      if (this.isNew) 
      {
        if (this.queryParams?.endTime != this.formValues.endTime) {
          this.formValues["endTime"] = this.formValues["endTime"] +":10"+ this.offset;
        }
  
        if (this.queryParams?.startTime != this.formValues.startTime) {
          this.formValues["startTime"] = this.formValues["startTime"] +":10"+ this.offset;
        }
        this.eventCreateService.createEvent(this.formValues).subscribe((data) => {
          if (data.responseCode == "OK") 
          {
            this.dataSubmitted(data, 'create');
          }
        }, (err: any) => {
          console.log( "Errr, " ,err);
          this.sbToastService.showIziToastMsg(err.message, 'error');
        });

      } 
      else 
      {
        if (this.queryParams?.endTime != this.formValues.endTime) {
          this.formValues["endTime"] = this.formValues["endTime"] + this.offset;
        }
  
        if (this.queryParams?.startTime != this.formValues.startTime) {
          this.formValues["startTime"] = this.formValues["startTime"]+ this.offset;
        }
        this.formValues['versionKey'] = this.queryParams.versionKey;
        this.eventCreateService.updateEvent(this.formValues).subscribe((data) => {
          if (data.responseCode == "OK") 
          {
            this.dataSubmitted(data, 'update');
          }
        }, (err) => {
          console.log({ err });
          // this.sbToastService.showIziToastMsg(err.error.result.messages[0], 'error');
        });
      }
    }

  }


   dataSubmitted(data, task) {
    if (this.canPublish) 
    {
      this.eventCreateService.publishEvent(data.result.identifier).subscribe((res) => {
        
        if (task == 'create')
        {
          this.sbToastService.showIziToastMsg("Event Created Successfully", 'success');
        }
        else
        {
          this.sbToastService.showIziToastMsg("Event updated Successfully", 'success');
        }

        // Only publish event can able to create batch
        this.createEventBatch(data);
        // this.createdBatch = this.createEventBatch(data);

        // this.createEventBatch(data).subscribe((res) => {
        //   this.createdBatch = res.result.batchId
        // });;

        
        this.navAfterSave.emit(data);
      });
    }
    else {

      if (task == 'create') {
        this.sbToastService.showIziToastMsg("Event Created Successfully", 'success');
      }
      else {
        this.sbToastService.showIziToastMsg("Event updated Successfully", 'success');
      }

      this.navAfterSave.emit(data);
    }
  }

  /**
   * NOTE: Once the event is created, the batch will be created automatically.
   * Right now the batch is not created after event creating, so we are implementing some temporary solution
   * 
   * Create event batch 
   * Here, confirm that one event have only one batch.
   * @param data array of created event id
   * @param formValue event form value
   */
    createEventBatch(data){
      // Check whether Event has batch or not
      // filter set for serch batch for selected event
      let filters ={
          "courseId": data.result.identifier,
          "enrollmentType": "open"
       };

      this.eventDetailService.getEvent(data.result.identifier).subscribe((response: any) => {
        this.eventValue = response.result.event;

        // request value for create batch for selected event
        let createBatchRequestValue = {
          "courseId": data.result.identifier,
          "name": "Batch for event - " + data.result.identifier,
          "description": "Batch for event - " + data.result.identifier,
          "enrollmentType": "open",
          "startDate": this.eventValue.startDate,
          "enddate": this.eventValue.endDate,
          "createdBy" : this.eventValue.owner
        }

        this.eventService.getBatches(filters).subscribe((res) => {
          if (res.responseCode == "OK") 
          {
              if (res.result.response.count == 0)
              {
                // If batch not created then create the batch for event
                 this.eventService.createBatch(createBatchRequestValue).subscribe((createRes) => {
                   //  return createRes;
                  //  return observableOf(createRes);
                  // if(createRes.result.batchId)
                  // {
                     var action="enroll";
                     this.eventService.enrollToEventPost(action,data.result.identifier,this.userId,createRes.result).subscribe((res) => {
                      });
                  // }
                },(err) => {
                  console.log({ err });
                  // this.sbToastService.showIziToastMsg(err.error.result.messages[0], 'error');
                });
              }
              else
              {
                return observableOf(res.result.response.content[0]);
                
              }
          }
        },(err) => {
          console.log({ err });
          // this.sbToastService.showIziToastMsg(err.error.result.messages[0], 'error');
        });
      });
  }

  cancel() {
    this.closeSaveForm.emit();
  }

  /**
   * For time validation
   * 
   * @param sdate Contains data
   * @param time Contains time
   * @returns Return true if event start time is greater current time
   */
  timeValidation(date, time) {
    var startEventTime = new Date(date + " " + time);
    var startDifference = startEventTime.getTime() - this.today.getTime();
    var timeDiff = Math.round(startDifference / 60000);

    return (timeDiff > 0) ? true : false;
  }

  /**
   * For date validation
   * 
   * @param sdate Contains start data
   * @param edate Contains end data
   * @returns 
   */
  dateValidation(sdate, edate) {
    var startEventDate = new Date(sdate);
    var endEventDate = new Date(edate);

    var startDifference = endEventDate.getTime() - startEventDate.getTime();
    var timeDiff = Math.round(startDifference / 60000);

    return (timeDiff >= 0) ? true : false;
  }
  
  // Currently Not In Use
  // changeDateForRecurrence(currentdate, currentdate1) {
  //   this.formFieldProperties[24].range[1] = "Weekly on " + this.weekday[new Date(this.formFieldProperties[21].value).getDay()];
  //   this.formFieldProperties[24].range[2] = "Monthly on the " + this.prefixes[Math.floor(new Date(this.formFieldProperties[21].value).getDate() / 7)] + " " + this.weekday[new Date(this.formFieldProperties[21].value).getDay()];

  //   this.onValueChangeUpdateFieldBehaviour();
  // }

  // Ankita
  appIconDataHandler(event) {
    this.appIcon = event.url;
  }

  /**
   * For setting Recurring Dependent Fields 
   */
  setRecurringDependentFields(value) {
    switch (value) {
      case true:
      case "Yes":
        this.formFieldProperties[24].editable = true;
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = true;
        break;

      default:
        this.formFieldProperties[24].editable = false;
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = false;
        this.formFieldProperties[28].editable = true;
        this.formFieldProperties[29].editable = true;
        break;
    }
  }

  /**
   * For setting Recurring Dependent Fields 
   */
  setRecurringDependentFields_new(value) {
    switch (value) {
      case true:
      case "Yes":
        this.formFieldProperties[24].editable = true;
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = false;
        this.formFieldProperties[28].editable = false;
        this.formFieldProperties[29].editable = false;
        var a = new Date();
        this.formFieldProperties[24].range[1] = "Weekly on " + this.weekday[a.getDay()];
        this.formFieldProperties[24].range[2] = "Monthly on the " + this.prefixes[Math.floor(this.today.getDate() / 7)] + " " + this.weekday[a.getDay()];

        break;

      case false:
      case "No":
        this.formFieldProperties[24].placeholder;
        this.formFieldProperties[24].editable = false;
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = false;
        this.formFieldProperties[28].editable = true;
        this.formFieldProperties[29].editable = true;
        break;
      default:
        this.formFieldProperties[24].editable = false;
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = false;
        this.formFieldProperties[28].editable = true;
        this.formFieldProperties[29].editable = true;
        break;
    }
  }

  /**
  * For setting Type of Recurring Dependent Fields 
  */
  setTypeOfRecurringDependentFields(value) {
    var a = new Date();
    switch (value) {
      case 'Daily':
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = true;
        this.formFieldProperties[28].editable = false;
        this.formFieldProperties[29].editable = false;
        break;

      case 'Weekly on ' + this.weekday[a.getDay()]:
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = true;
        this.formFieldProperties[28].editable = false;
        this.formFieldProperties[29].editable = false;
        break;

      case 'Monthly on the ' + this.prefixes[Math.floor(this.today.getDate() / 7)] + " " + this.weekday[a.getDay()]:
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = true;
        this.formFieldProperties[28].editable = false;
        this.formFieldProperties[29].editable = false;
        break;

      case 'Every Weekday':
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = true;
        this.formFieldProperties[28].editable = false;
        this.formFieldProperties[29].editable = false;
        break;

      case 'Custom':
        this.formFieldProperties[25].editable = true;
        this.formFieldProperties[26].editable = true;
        this.formFieldProperties[27].editable = true;
        this.formFieldProperties[28].editable = false;
        this.formFieldProperties[29].editable = false;
        break;

      default:
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = true;
        break;
    }
  }

  /**
  * For setting End Recurring Dependent Fields 
  */
  setEndRecurring(value) {
    switch (value) {
      case true:
      case "Yes":
        this.formFieldProperties[28].editable = true;
        this.formFieldProperties[29].editable = true;
        break;

      case "No":
      default:
        this.formFieldProperties[28].editable = false;
        this.formFieldProperties[29].editable = false;
        break;
    }
  }
  
  // Currently Not In Use
  // setVisibilityDependentFields_New(value) {
  //   this.formFieldProperties[9].editable = false;
  //   this.formFieldProperties[8].editable = false;
  //  value.forEach(element => {
  //     switch (element) {
  //       case 'Parent':
  //         this.formFieldProperties[9].editable = true;
  //         break;

  //       case 'Private':
  //         this.formFieldProperties[8].editable = true;
  //         break;

  //       case 'Default':

  //         break;

  //       default:
  //         this.formFieldProperties[9].editable = false;
  //         this.formFieldProperties[8].editable = false;
  //         break;
  //     }
  //   });
  // }

  /**
  * For setting Repeat Every Recurring Dependent Fields 
  */
  setRepeatEveryRecurringFields(value) {
    switch (value) {
      case 'Day':
      case 'Month ':
      case 'Week':
      case 'Year':        
        this.formFieldProperties[26].editable = true;
        this.formFieldProperties[27].editable = true;
        break;

      default:
        this.formFieldProperties[25].editable = false;
        this.formFieldProperties[26].editable = false;
        this.formFieldProperties[27].editable = true;
        break;
    }
  }
}
