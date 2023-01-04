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

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from 'primeng/components/datatable/datatable';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { RatingModule } from 'primeng/rating';
import { PaginatorModule } from 'primeng/paginator';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { ModalComponent } from './directive/modal/modal.component';
import { ModalService } from './directive/modal/modal.service';
import { ModalModule, BsModalService, BsModalRef, PopoverModule, BsDatepickerModule, BsDropdownModule } from 'ngx-bootstrap';
import { MenubarModule } from 'primeng/menubar';
import { SearchPipe } from './search.pipe';
import { DateFormatPipe } from './pipes/date-format/date-format.pipe';
import { TimeFormatPipe } from './pipes/time-format/time-format.pipe';
import { UniqueArrayFormatPipe } from './pipes/unique-array/unique-array';
import { RupeeFormatPipe } from './pipes/rupee-format/rupee-format.pipe';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { WorkingScheduleComponent } from './component/working-schedule/working-schedule.component';
import { NGBWorkingScheduleComponent } from './component/working-schedule-ngb/working-schedule-ngb.component';
import { RatingComponent } from './component/rating/rating.component';
import { DatepickerComponent } from './component/datepicker/datepicker.component';
import { TextareaComponent } from './component/textarea/textarea.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FileHandleComponent } from './directive/fileHandle/fileHandle.component';
import { BookAppoinmentComponent } from './component/book-appoinment/book-appoinment.component';
import { PrivacyContentComponent } from './component/privacy-content/privacy-content.component';
import { TermsContentComponent } from './component/terms-content/terms-content.component';

import { SortNumberPipe } from './pipes/sort-number/sort-number.pipe';
import { MatCardModule, MatNativeDateModule, MatGridListModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { WavesModule, ButtonsModule } from 'angular-bootstrap-md';//CarouselModule, 
import { CarouselModule } from 'primeng/carousel';
import { MatIconModule } from '@angular/material/icon';
import { AgmCoreModule } from '@agm/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ReportComponent } from './component/report/report.component';
import { ToastrModule } from 'ngx-toastr';
import { PrescriptionPreviewComponent } from './component/prescription-preview/prescription-preview.component';
import { RateDoctorComponent } from './component/rate-doctor/rate-doctor.component';
import { MultifileuploadComponent } from './component/multiple-file-upload/multiple-file-upload.component';
import { SinglefileuploadComponent } from './component/single-file-upload/single-file-upload.component';
import { FetchMedicineComponent } from './component/fetch-medicine/fetch-medicine.component';
import { NumberDirective } from './directive/numbers-only.directive';
import { ChartsComponent } from './component/charts/components/charts.component';
import { GoogleMApComponent } from './component/google-map/google-map.component';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { TwoDigitDecimaNumberDirective } from './directive/two-digit-decimal-directive';
import { TelephoneComponent } from './component/telephone/telephone.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DragDropModule } from 'primeng/dragdrop';

import { CanvasPaintComponent } from './component/canvas-paint/canvas-paint.component';//canvas-paint
import { NumberExcludeZeroDirective } from './directive/numbers-only-exclude-zero.directive.';
import { PrintComponent } from './component/print/print.component';
import {NgxPrintModule} from 'ngx-print';
import { PatientDetailsComponent } from './component/patient-details/patient-details.component';
import { TreatmentHistoryComponent } from './component/treatment-history/treatment-history.component';
import { prescribeMedicinePipe } from './pipes/prescription/prescribe-medicine.pipe';
import { MedicalTestResultComponent } from './component/medical-test-results/medical-test-results.component';
import { FloatExcludeZeroDirective } from './directive/float-numbers-exclude-zero.directive';
import { RegistrationWorkflowComponent } from './component/registration-workflow/registration-workflow.component';
import { SuccessCardComponent } from './component/success-card/success-card.component';
import { CommonPrescriptionComponent } from './component/common-prescription/common-prescription.component';
import { CommonPrescriptionNgbtComponent } from './component/common-prescription-ngbt/common-prescription-ngbt.component';
import { SidebarModule } from 'primeng/sidebar';
import { NameComponent } from './component/name/name.component';
import { ConfirmationPageComponent } from './component/confirmation-page/confirmation-page.component';
import { CustomToastComponent } from './component/custom-toast/custom-toast.component';
import { CreateAppointmentComponent } from './component/create-appointment/create-appointment.component';
import { InvoiceVoucherComponent } from './component/invoice-voucher/invoice-voucher.component';
import {DialogModule} from 'primeng/dialog';
import { ReportDownloadComponent } from './component/report-download/report-download.component';
import { AddEditPatientDetailsComponent } from './component/add-edit-patient-details/add-edit-patient-details.component';
import { ProcedureComponent } from './component/procedure/procedure.component';
import { CustomFormResponseComponent } from './component/custom-form-response/custom-form-response.component';
import { ProcedurePreviewComponent } from './component/procedure-preview/procedure-preview.component';
import { InpatientTreatmentHistoryComponent } from './component/inpatient-treatment-history/inpatient-treatment-history.component';
import { AdmittedPatientDetailsComponent } from './component/admitted-patient-details/admitted-patient-details.component';
import { CommonAddressCardComponent } from './component/common-address-card/common-address-card.component'
import { OtherTreatmentHistoryOfPatientComponent } from './component/other-treatment-history-of-patient/other-treatment-history-of-patient.component';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, environment.TRANSLATION_FILE_PATH, '.json');
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule, MenubarModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    DataTableModule,
    PopoverModule.forRoot(),
    InputTextModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    RatingModule,
    PaginatorModule,
    OverlayPanelModule,
    TableModule,
    AutoCompleteModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    CardModule,
    ChartModule,
    InternationalPhoneModule,
    NgxMaterialTimepickerModule.forRoot(),
    MatCardModule, MatNativeDateModule, MatGridListModule, MatInputModule,
    MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule,
    MatDividerModule,
    CarouselModule,
    WavesModule,
    ButtonsModule,
    MatDialogModule,
    MatIconModule,
    PanelModule,
    AccordionModule,
    RadioButtonModule,
    DialogModule,
    NgxPrintModule, //Working on app/issues/700
    DragDropModule,
    ToastrModule.forRoot({
      disableTimeOut: true,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      closeButton: true,
      maxOpened: 1,
      autoDismiss: true,
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_API_KEY//'AIzaSyBWVyk6Tdm6Hpl_nA_IssRZFoxGMXjM1dU'
    }),
    SidebarModule,
  ],
  declarations:
    [ModalComponent,
      SearchPipe,
      DateFormatPipe,
      TimeFormatPipe,
      UniqueArrayFormatPipe,
      RupeeFormatPipe,
      WorkingScheduleComponent,
      NGBWorkingScheduleComponent,
      RatingComponent,
	  PrivacyContentComponent,
	  TermsContentComponent,
      DatepickerComponent,
      TelephoneComponent,
      TextareaComponent,
      FileHandleComponent,
      SortNumberPipe,
      BookAppoinmentComponent,
      ReportComponent,
      PrescriptionPreviewComponent,
      RateDoctorComponent,
      MultifileuploadComponent,
      SinglefileuploadComponent,
      FetchMedicineComponent,
      NumberDirective,
      ChartsComponent,
      GoogleMApComponent,
      TwoDigitDecimaNumberDirective,
      CanvasPaintComponent,
      NumberExcludeZeroDirective, //Working on app/issues/655
      PrintComponent,  //Working on app/issues/700
      PatientDetailsComponent, TreatmentHistoryComponent, 
      prescribeMedicinePipe,
      MedicalTestResultComponent,//working on issue number #209, #210, #214 --WIP
      FloatExcludeZeroDirective,
      RegistrationWorkflowComponent,SuccessCardComponent,  //Working on app/issues/782
      CommonPrescriptionComponent,CommonPrescriptionNgbtComponent, NameComponent, // app#916
      ConfirmationPageComponent,
      CreateAppointmentComponent, //Working on app/issues/1066
      InvoiceVoucherComponent, ReportDownloadComponent, CustomToastComponent,AddEditPatientDetailsComponent, //Working on app/issues/1185
      ProcedureComponent, CustomFormResponseComponent, ProcedurePreviewComponent, //procedure
      AdmittedPatientDetailsComponent,InpatientTreatmentHistoryComponent, CommonAddressCardComponent, //app#1970
      OtherTreatmentHistoryOfPatientComponent 
    ],
  providers: [ModalService, DatePipe, BsModalService, BsModalRef],
  exports: [ToastrModule, CommonModule, ModalModule, MenubarModule, SearchPipe, HttpClientModule, FormsModule, ReactiveFormsModule, NgbModule,
    TranslateModule, ModalComponent, DataTableModule, PopoverModule, InputTextModule, ButtonModule, DropdownModule, CheckboxModule,
    CalendarModule, RatingModule, PaginatorModule, OverlayPanelModule, TableModule, AutoCompleteModule, DateFormatPipe, TimeFormatPipe,
    UniqueArrayFormatPipe, RupeeFormatPipe, BsDatepickerModule, BsDropdownModule, CardModule, ChartModule, InternationalPhoneModule,
    WorkingScheduleComponent,NGBWorkingScheduleComponent, RatingComponent,PrivacyContentComponent, TermsContentComponent, DatepickerComponent, TelephoneComponent, TextareaComponent,
    NgxMaterialTimepickerModule, FileHandleComponent, SortNumberPipe, BookAppoinmentComponent, MatCardModule, MatNativeDateModule,
    MatGridListModule, MatInputModule, PrescriptionPreviewComponent,
    MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule,
    MatDividerModule,
    CarouselModule,
    WavesModule,
    PanelModule,
    DragDropModule,
    AccordionModule,
    ButtonsModule,
    MatDialogModule,
    MatIconModule,
    RadioButtonModule,
    ReportComponent,
    RateDoctorComponent,
    MultifileuploadComponent,
    SinglefileuploadComponent,
    FetchMedicineComponent,
    ChartsComponent,
    CanvasPaintComponent,
    NumberDirective,
    TwoDigitDecimaNumberDirective,
    NumberExcludeZeroDirective, //Working on app/issues/655
    PrintComponent,  //Working on app/issues/700
    NgxPrintModule, //Working on app/issues/700
    PatientDetailsComponent, TreatmentHistoryComponent, 
    prescribeMedicinePipe,
    FloatExcludeZeroDirective,
    RegistrationWorkflowComponent,SuccessCardComponent,  //Working on app/issues/782
    CommonPrescriptionComponent, // app#916
    CommonPrescriptionNgbtComponent,
    MedicalTestResultComponent, //https://gitlab.com/sbis-poc/frontend/issues/214
    NameComponent,
    ConfirmationPageComponent,
    InvoiceVoucherComponent, //Working on app/issues/1185
    ReportDownloadComponent,
    CustomToastComponent,
    ProcedureComponent,//procedure
    CustomFormResponseComponent,
    ProcedurePreviewComponent,
    DialogModule,
    InpatientTreatmentHistoryComponent,
    CommonAddressCardComponent
  ],

  entryComponents: []
})
export class SharedModule { }
