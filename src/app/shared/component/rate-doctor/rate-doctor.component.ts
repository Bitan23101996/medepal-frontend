import { Component, OnInit, Output, OnChanges, EventEmitter, Input } from '@angular/core';
import { AppoinmentService } from '../../../modules/appoinment/appoinment.service';
import { ToastService } from '../../../core/services/toast.service';
import { GetSet } from '../../../core/utils/getSet';

@Component({
  selector: 'app-rate-doctor',
  templateUrl: './rate-doctor.component.html',
  styleUrls: ['./rate-doctor.component.css']
})
export class RateDoctorComponent implements OnInit, OnChanges {
  // @Input('id') popUpId: any ="";
  @Input() id: any;
  // @Input('data') appoinment: any;
  @Input() appointment: any;
  @Input() editRating: any;
  @Input() ratingList: any;
  @Output() onClose = new EventEmitter<any>();

  appointmentDetails: any = null;

  user_id: any;
  ratingReview: any="";
  reviewTitle : any="";
  user_refNo: any;
  user_rolePk: any;
  triggeringActionType: any;

  constructor(
    private appoinmentService: AppoinmentService,
    private toastService: ToastService
  ) { }

  ngOnChanges() {
    this.reviewTitle="";
    this.ratingReview="";
    if(this.editRating){
      if (typeof this.editRating.reviewTitle !== 'undefined') {
        this.reviewTitle=this.editRating.reviewTitle;
      }
      if (typeof this.editRating.review !== 'undefined') {
        this.ratingReview=this.editRating.review;
      }
    } 
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.user_rolePk = user.rolePk;
    this.triggeringActionType = GetSet.getTriggeringActionType();
    // this.loadRatingData();
  }

  saveRating() {
    // const appoinment = this.modalRef["appoinment"];
    // const editRating = this.modalRef["editRating"];
    const appoinment = this.appointment;
    const editRating = this.editRating;
    const query = {};
    if (editRating) {
      query["ratingPk"] = editRating.ratingPk;
    }
    if(this.triggeringActionType) {
      query["triggeringActionType"] = this.triggeringActionType;
      query["triggeringRefNo"] = this.appointment.appointmentRefNo;
    }
    if(GetSet.getRatingFor() == 'DOCTOR') {
      query['ratingForEntity'] = 'DOCTOR';
      query['ratingForEntityRefNo'] = appoinment.doctorRefNo;
    } else if(GetSet.getRatingFor() == 'PHARMACY') {
      query['ratingForEntity'] = 'PHARMACY';
      query['ratingForEntityRefNo'] = appoinment.pharmacyRefNo;
      query["triggeringActionType"] = 'PHARMACY';
      query["triggeringRefNo"] = appoinment.pharmacyOrderRefNo;
    } else if (GetSet.getRatingFor() == 'DIAGNOSTICS') {
      query['ratingForEntity'] = 'DIAGNOSTICS';
      query['ratingForEntityRefNo'] = appoinment.labRefNo;
      query["triggeringActionType"] = 'DIAGNOSTICS';
      query["triggeringRefNo"] = appoinment.orderRefNo;
    }
    // query["ratingByUserRefNo"] = this.user_refNo;
    // query['ratingByUserRolePk'] = this.user_rolePk;
    query["triggeringPk"] = appoinment.appointmentPk;
    query["ratingDetails"] = [];
    this.ratingList.forEach(item => {
      const params = {}
      params["ratingParameter"] = item.ratingParameterDTO;
      params["ratingParameterScore"] = item.ratingParameterScore;
      params["weigth"] = item.weight;

      query["ratingDetails"].push(params);
      query["review"] = this.ratingReview;
      query["reviewTitle"] = this.reviewTitle;
    })

    //review title validation 
    if ( query["review"].length>0 && query["reviewTitle"]=="" ) {
      this.toastService.showI18nToast('Review title is mandetory', 'warning');
      return;
    } else {
      this.appoinmentService.saveRatingV2(query).subscribe((data) => {
        if (data.status == 2000) {
          // this.modalRef.hide();
          this.id.visible = false;
          this.toastService.showI18nToast(data.message, 'success');
        } 
      });
    } 
  }

  backClicked() {
    // console.log(this.id);
    this.id.visible = false;
    // this.onClose.emit(this.popUpId);
    // console.log(this.editRating);
  }

  ngOnDestroy() {
    GetSet.setTriggeringActionType(null);
  }

}
