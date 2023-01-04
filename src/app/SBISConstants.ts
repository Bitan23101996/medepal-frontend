/*
 *  * |///////////////////////////////////////////////////////////////////////|
 *  * |                                                                       |
 *  * | Copyright (C) STELLABLUE INTERACTIVE SERVICES PVT. LTD.               |
 *  * | All Rights Reserved                                                   |
 *  * |                                                                       |
 *  * | This document is the sole property of StellaBlue Interactive          |
 *  * | Services Pvt. Ltd.                                                    |
 *  * | No part of this document may be reproduced in any form or             |
 *  * | by any means - electronic, mechanical, photocopying, recording        |
 *  * | or otherwise - without the prior written permission of                |
 *  * | StellaBlue Interactive Services Pvt. Ltd.                             |
 *  * |                                                                       |
 *  * |///////////////////////////////////////////////////////////////////////|
 *  */
export class SBISConstants {

    public static APPOINTMENT_BUTTON_CONST = {
        COMPLETED_BUTTON: "Completed",
        NO_SHOW_BUTTON: "No Show",
        START_VISIT_BUTTON: "Start",
        RESUME_BUTTON: "Resume",
        CONFIRM_APPOINTMENT_BUTTON: "Confirm",
    };

    public static APPOINTMENT_STATE = {
        COMPLETED : 'COM',
        REQUESTED : 'REQ',
        CANCELLED : 'CXL',
        REJECTED : 'REJ',
        CONFIRMED : 'CON',
        VIP: 'VIP',
        NO_SHOW: 'NSH' // Working on app/issue/2403
    };

    public static ENTITY_STATUS = {
        NORMAL : 'NRM',
        CANCELLED : 'CXL',
    };

    public static DOB = {
        DOB_NOT_AVAILABLE : 'DATE_OF_BIRTH_NOT_AVAILABLE'
    };
    
    public static HEADER_NAME_OBJ = {
        MY_ORDERS_HEADER_NAME: 'MY ORDERS',
        MY_DIAGNOSTICS_HEADER_NAME: 'MY DIAGNOSTICS'
    };

    //new add for dashboard constant
    public static DASHBOARD_WIDGET_CONST = {
        WIDGET_TYPE_TEXT: 'text',
        WIDGET_TYPE_TABLE: 'table',
        
    }

    public static MEDICAL_DETAILS_CONST = {
        BLOOD_PRESSURE_SHORT_NAME: 'BP',
        BLOOD_PRESSURE_LONG_NAME: 'Blood Pressure',
        BLOOD_PRESURE_DIA_SHORT_NAME: 'bp-dia',
        BLOOD_PRESSURE_DIA_LONG_NAME: 'Blood pressure - Diastolic',
        BLOOD_PRESURE_SYS_SHORT_NAME: 'bp-sys',
        BLOOD_PRESSURE_SYS_LONG_NAME: 'Blood pressure - Systolic',
        DEFAULT_SELECTED_SOURCE_FIELD: 'Lab Report'
    }

    public static SEARCH_CONST = {
        LOCATION_ZOOM_NUMBER_CONST: 15
    }

    public static DELIVERY_CONST = {
        OUTSTANDING: 'CONFIRMED',
        PACKED: 'PACKED',
        OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
        ATTEMPTED: 'ATTEMPTED',
        DELIVERED: 'DELIVERED'
    }
    public static DR_CONST = {
        DR_REG_VERIFICATION: 'DR_REG_VERIFICATION',
    }

    public static LAB_DELIVERY_CONST = {
        CONFIRMED: 'CONFIRMED',
        ASSIGN_COLLECTOR: 'ASSIGN_COLLECTOR',
        SAMPLE_COLLECTED: 'SAMPLE_COLLECTED',
        SAMPLE_RECEIVED_LAB: 'SAMPLE_RECEIVED_LAB',
        PROCESS_GEN_REPORT: 'PROCESS_GEN_REPORT',
        SEND_REPORT: 'SEND_REPORT'
    }

    public static DOCUMENT_TYPE_CONST = {
        PRESCRIPTION: 'PRESCRIPTION',
        TEST_REPORTS: 'TEST_REPORTS',
        INVOICE: 'INVOICE',
        BLANK_PRESCRIPTION: 'BLANK_PRESCRIPTION', //Working on app/issues/1292
    }

    // public static  orderState = {
    //     CANCELED: "Canceled" ,
    //     COMPLETED: "Completed" ,
    //     DELIVERED: "Delivered",
    //     ATTEMPTED: "Attempted", 
    //     OUT_FOR_DELIVERY: "Out for Delivery"
    //   }

    public static  ORDER_STATE = {
        Canceled: "Canceled" ,
        Completed: "Completed" ,
        Delivered: "Delivered",
        Attempted: "Attempted", 
    }
    public static  ORDER_STATE_OUT_FOR_DELIVERY = {
        OUT_FOR_DELIVERY : "Out for Delivery"
    } 

    public static TRANSACTION_TYPE = {
        PHARMACY: 'PHARMACY',
        APPOINTMENT: 'APPOINTMENT',
        DIAGNOSTICS: 'DIAGNOSTICS'
    }

    public static CHAMBER = {
        HOME_VISIT_ENABLE: 'O',
        ONLINE_CONSULTANCY_ENABLE: 'L'
    }

    public static MASTER_DATA = {
        GENDER: 'GENDER',
        BLOOD_GROUP: 'BLOOD_GROUP',
        GUARDIAN_TYPE_MINOR: 'GUARDIAN_TYPE_MINOR',
        ALLERGY: 'ALLERGY',
        RELATION: 'RELATION',
        MEDICAL_DATA_SRC_TYPE: 'MEDICAL_DATA_SRC_TYPE',
        ASSISTANTS: 'ASSISTANT',
        FEES: 'FEES'
    }

    public static IMAGE_UPLOAD_CONST = {
        DOCTOR_PRESCRIPTION_DRAW: "DOCTOR_PRESCRIPTION_DRAW",
        PROCEDURE_IMAGE: "PROCEDURE_IMAGE",
        VACCINE_REPORT: "VACCINE_REPORT", //Working on app/issues/937
        TEST_REPORT : "TEST_REPORTS",
        PHARMACY_INVOICE: "PHARMACY_INVOICE"
    }

    // app/issues/843
    public static PRESCRIPTION_TEMPLATE_TYPE = {
        DOCTOR_OWN_PRESCRIPTION_TEMPLATE:"S",
        DOCTOR_OPD_PRESCRIPTION_TEMPLATE:"O"
    }
    // End app/issues/843
    
    // app/issues/894
    public static TOAST = {
        FADE_AWAY_TIME:"3000"
    }
    // End app/issues/894
    // https://gitlab.com/sbis-poc/frontend/issues/214
    public static FILE_TYPE = {
        "application/pdf": "application/pdf",
        "image/jpeg":"image/jpeg",
        "image/jpg":"image/jpg",
        "image/png":"image/png"
    }

    public static GROUP = {
        GROUP_INVITE_SENT: "INVITE_SENT",
        OWNER: "OWNER",
        ACCEPTED: "ACCEPTED",
        MEMBER: "MEMBER"
    }

    public static ROUTE_URL_JSON = {
        APPOINTMENT: "appoinment",
        PHARMACY: "/individual/my-order",
        DIAGNOSTICS: "/individual/my-diagnostics",
        FORGOT_PASS: "/auth/login",
        OPD_DOCTOR_LIST: "opd/opdDoctorList",
        ADD_USER_OPD: "opd/addUser/opd",
        ADD_USER_PHA: "opd/adduser/pha",
        ADD_ASSISTANT: "doctor/assistant"
    }

    public static ROUTE_RETRY_URL_JSON = {
        RAZOR_PAY: "/payment/razor-pay",
    }

    public static PAYMENT_FOR = {
        APPOINTMENT: "APPOINTMENT",
        PHARMACY: "PHARMACY",
        DIAGNOSTICS: "DIAGNOSTICS",
        FORGOT_PASS: "FORGOT_PASS",
        OPD_DOCTOR_LIST: "OPD_DOCTOR_LIST",
        ADD_USER_OPD: "ADD_USER_OPD",
        ADD_USER_PHA: "ADD_USER_PHA",
        ADD_ASSISTANT: "ADD_ASSISTANT"
    }

    public static ACTION_BUTTON_NAME = {
        APPOINTMENT: "Go to My Appointments",
        PHARMACY: "Go to My Orders",
        DIAGNOSTICS: "Go to My Diagnostics",
        FORGOT_PASS: "Login",
        OPD_DOCTOR_PAGE: "Go to Doctor List",
        USER_LIST: "Go to User List",
        ASSISTANT_LIST: "Go to Assistant List"
    }

    public static SECONDARY_ACTION_BUTTON_NAME = {
        RETRY: "Retry Payment",
        ADD_ANOTHER_USER: "Add Another User",
        ADD_ANOTHER_ASSISTANT: "Add Another Assistant"
    }
    // app/issues/1559
    public static ACTION_BUTTON_NAME_FOR_ROOM_CATEGORY = {
        UPDATE:'ROOM MASTER',
        SAVE:'ROOM MASTER'
    }
    //END app/issues/1559
    public static CONFIRMATION_CANCEL_STRING = {
        APPOINTMENT: "doctor appointment",
        PHARMACY: "medicine order",
        DIAGNOSTICS: "book diagnostics"
    }

    public static CONFIRMATION_HEADER_TEXT = {
        APPOINTMENT: "Appointment Confirmation",
        PHARMACY: "Order Confirmation",
        DIAGNOSTICS: "Diagnostics Confirmation",
        FORGOT_PASS: "Forget password confirmation",
        ROOM: "Room Category Confirmation",
        OPD_DOCTOR_ADD: "OPD Doctor Add Confirmation",
        ADD_USER: "Add User Confirmation",
        ADD_ASSISTANT: "Add Assistant Confirmation",
        ADDMISSION:"Admission record saved" // Working on app/issue/2232
    }

    public static PAYMENT_STATE = {
        CONFIRM: 'CONFIRM',
        CANCEL: 'CANCEL'
    }
    
    public static MY_PRESCRIPTION_CONST = {
        GROUP: "Group",
        MINOR: "Minor",
        ASSOCIATE: "Associated User",
        OWN: "Own",
        OWN_LABEL: "Own",
        MINOR_LABEL: "Minor",
        ASSOCIATE_LABEL: "Associated User",
        GROUP_LABEL: "Group"
    }
    // Working on app/issues/1438
    public static IPD_SERVICE_RATE_TYPE={
        FIX: 'FIX',
        SLAB: 'SLAB'
    }
    public static IPD_SERVICE_CHARGED_BY={
        BOTH: 'BOTH',
        CLINIC: 'CLINIC'
    }
    public static IPD_SERVICE_CHARGE_PATTERN={
        UPTO: 'Upto',
        NEXT: 'Next',
        MORE_THAN:'More Than',
        FLAT:'Flat' // app/issues/1705
    }
    // End Working on app/issues/1438
    
    // Working on app/issues/1193
    public static SCREEN_TYPE={
        ADD_PHARMACY: 'ADD_PHARMACY'       
    }
  
    // End Working on app/issues/1193\

    public static PROCEDURE_CONST = {
        PROCEDURE_NOTE_CONST: "PRON",
        PROCEDURE_IPD_CONST: "IPDN"
    }

    public static YES_NO_CONST = {
        YES_ENUM : 'Y',
        NO_ENUM : 'N'
    }

    public static STATUS_NRM = 'NRM';

    public static CHAMBER_TYPE = {
        IPD : "ipd",
        OPD : "opd"
    }
    public static INPATIENT_SUMMARY = {
        VISIT_NOTE: "Visit Note",
        PROCEDURE_NOTE: "Procedure Record"
    }
    
    //Working on app/issues/1780
    public static OPTION_TYPE = {
        SHORT_TEXT: "ST",
        LONG_TEXT: "LT",
        DROPDOWN: "DD",
        RADIO: "RD",
        CHECKBOX: "CH",
    }

    public static GLOBAL_DATE_FORMAT_FOR_FILTER = "yyyy-MM-dd";
    public static GLOBAL_DATE_FORMAT_FOR_PERMISSION = "dd-MM-yyyy";

    // Working on app/issues/1823
    public static SERVICEE_PROVIDER_FILE_TYPE = {
        PRESCRIPTION_HEADER :"SERVICE_PROVIDER_PRESCRIPTION_HEADER",
        PRESCRIPTION_FOOTER :"SERVICE_PROVIDER_PRESCRIPTION_FOOTER"
    }
    // End Working on app/issues/1823

    public static ROLE_NAMES = {
        DOCTOR: "DOCTOR",
        INDIVIDUAL: "INDIVIDUAL",
        BOOKING_OPERATOR: "BOOKING_OPERATOR"
    }

    public static REGISTRATION = {
        REGISTRATION_FEES: "REGISTRATION FEES",
        IPD_REGISTRATION_FEES: "IPD REGISTRATION FEE",
        OPD_REGISTRATION_FEES: "OPD REGISTRATION FEES",
        OT_REGISTRATION_FEES: "OT REGISTRATION FEES",
        REGISTRATION_FEES_CONSTANT: "REGISTRATION_FEES"

    }

    public static IPD_SERVICE_TAB = {
        DIAGNOSTICS: "DIAGNOSTICS",
        REGISTRATION_FEES: "REGISTRATION FEES"
    }
    public static ACTION_BUTTON_NAME_FOR_INPATIENT_ADMISSION = { // Working on app/issue/2232
        SAVE_UPDATE:'PATIENT LIST',
       
    }

    // Working on app/issue/2403
    public static APPOINTMENT_STATE_STATUS = {
        COM:"Complete",
        REQ:"Request",
        CXL:"Cancel",
        REJ:"Reject",
        CON:"Confirm",
        VIP:"In Progress",
        NSH:"No Show"
    };
    // End Working on app/issue/2403

    //create a model for schedule
    public static DAYS_OF_WEEK_MODEL = [
         {
        'key': '1',
        'value': 'Mon',
        'day': 'Monday'
      },
      {
        'key': '2',
        'value': 'Tue',
        'day': 'Tuesday'
      },
      {
        'key': '3',
        'value': 'Wed',
        'day': 'Wednesday'
      },
      {
        'key': '4',
        'value': 'Thu',
        'day': 'Thursday'
      },
      {
        'key': '5',
        'value': 'Fri',
        'day': 'Friday'
      },
      {
        'key': '6',
        'value': 'Sat',
        'day': 'Saturday'
      },
      {
        'key': '7',
        'value': 'Sun',
        'day': 'Sunday'
      }
    ];

    
}//end of class