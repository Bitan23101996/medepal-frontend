import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { DoctorService } from '../doctor.service';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-my-doctor-referral',
  templateUrl: './my-doctor-referral.component.html',
  styleUrls: ['./my-doctor-referral.component.css']
})
export class MyDoctorReferralComponent implements OnInit {

  user_refNo: string;
  referralDoctors: any = [];

  constructor(
    private broadcastService: BroadcastService,
    private doctorService: DoctorService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.broadcastService.setHeaderText('My Referral Doctor');
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_refNo = user.refNo;
    this.getReferralDoctorsDetails();
  }

  getReferralDoctorsDetails() {
    this.doctorService.retrieveDoctorReferral(this.user_refNo).subscribe((resp) => {
      if(resp.status == 2000) {
        resp.data.forEach(element => {
          element.referralDateTime = new Date(element.referralDateTime);
        });
        this.referralDoctors = resp.data;
      }
    });
  }

  resendReferralMail(referral) {
    this.doctorService.resendDoctorReferralMail({'referralRefNo': referral.referralRefNo}).subscribe((resp) => {
      if(resp.status == 2000) {
        this.toastService.showI18nToast('Referral Resend Successfully', 'success');
      }
    });
  }

}
