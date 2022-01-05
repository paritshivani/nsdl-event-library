 export const urlConfig = {
    // endpoint configs...!
    // Live API's
    // create: "/event/v4/create",
    create: "https://staging-sunbird.nsdl.co.in/api/event/v4/create",

    // update: "/event/v4/update",
    update: "https://staging-sunbird.nsdl.co.in/api/event/v4/update",

    // detail :  "/event/v4/read/",
    detail: "https://staging-sunbird.nsdl.co.in/api/event/v4/read/",

    // publish:"/event/v4/publish",
    publish: "https://staging-sunbird.nsdl.co.in/api/event/v4/publish",

    // enrollApi: "/v1/event/enroll",
    enrollApi: "https://staging-sunbird.nsdl.co.in/learner/course/v1/enrol",

    // unenrollApi: "/v1/event/unenroll",
    unenrollApi: "https://staging-sunbird.nsdl.co.in/learner/course/v1/unenrol",

    // BBBGetUrlModerator: "/event/v4/join/moderator",
    BBBGetUrlModerator: "https://staging-sunbird.nsdl.co.in/api/event/v4/join/moderator",

    // BBBGetUrlAttendee:"/event/v4/join/attendee",
    BBBGetUrlAttendee: "https://staging-sunbird.nsdl.co.in/api/event/v4/join/attendee",

    // batchlist: "/v1/course/batch/search",
    batchlist: "https://staging-sunbird.nsdl.co.in/api/course/v1/batch/list",

    // createBatch: "/v1/course/batch/create",
    // createBatch: "https://staging-sunbird.nsdl.co.in/api/course/v1/batch/create",
    createBatch: "https://staging-sunbird.nsdl.co.in/learner/course/v1/batch/create",

    // search:"/v3/search",
    search: "https://staging-sunbird.nsdl.co.in/api/event/v1/search",

    // search for asset library.
    compositeSearch : "https://staging-sunbird.nsdl.co.in/action/composite/v3/search",

    // eventFormConfigApi: "/assets/api/event-create.json",
    eventFilterConfigApiSbForm: "/assets/api/event-filter-sbform.json",

    eventFormConfigApi : "https://staging-sunbird.nsdl.co.in/api/data/v1/form/read",
    eventFilterConfigApi : "https://staging-sunbird.nsdl.co.in/api/data/v1/form/read",

    // enrollUserEventList:"/v2/user/courses/list",
    enrollUserEventList: "https://staging-sunbird.nsdl.co.in/api/course/v2/user/enrollment/list?contentType=Event",

    // myEvents:"/v2/user/courses/list",
    myEvents: "https://staging-sunbird.nsdl.co.in/api/course/v2/user/enrollment/list?contentType=Event",

    participantsList: "assets/api/participants.json",
    // participantsList: "https://staging-sunbird.nsdl.co.in/api/course/v1/batch/participants/list",

     usersApi: "assets/api/usersLive.json",
    // usersApi: "https://staging-sunbird.nsdl.co.in/api/user/v1/search",

    // attendanceApi: "assets/api/attendance.json",
    attendanceApi: "https://staging-sunbird.nsdl.co.in/api/event/v1/attendance/read",

    // -------------------------------------------------------------------------------
    createImage: "https://staging-sunbird.nsdl.co.in/action/content/v3/create",
    uploadImage:"https://staging-sunbird.nsdl.co.in/action/content/v3/upload",

    eventListApi : "assets/api/eventlist.json",
    eventCreateApi: "https://jsonplaceholder.typicode.com/posts",
    enrollListApi : "assets/api/enrolled-events.json",
    // usersApi: "assets/api/users.json",
    list : "assets/api/eventlist.json",
    formConfig : "assets/api/event-create.json",
    enrolllist : "assets/api/enrolled-events.json",
    enroll: "https://igot-sunbird.idc.tarento.com/v1/event/enroll",
    retire : "https://igot-sunbird.idc.tarento.com/private/event/v4/retire",
    calenderevent:"assets/api/eventlist_new.json",
    ImageSearchApi :  "assets/api/search-images.json",
    EditModeApi :  "assets/api/editmode.json",
};
