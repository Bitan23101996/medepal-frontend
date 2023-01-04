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

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CoreService } from 'src/app/core/core.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastService } from 'src/app/core/services/toast.service';


@Component({
    selector: 'app-system-search-user',
    templateUrl: './search-user.component.html',
    styleUrls: ['./search-user.component.css']
})

export class SearchUserComponent implements OnInit {//working on system admin issue[set password for a user]
    @ViewChild('resetPasswordModal') resetPasswordModal: TemplateRef<any>;
    modalRef: BsModalRef;
    userForm: FormGroup;//taking a formgroup to search user
    userDetails: any[] = [];
    newPassword: any;//taking a var to get typed password
    selectedRowData: any = {};
    isPaginator = false;
    showResult = false;
    noResultFound = false;
    constructor(private bsModalService: BsModalService,private toastService: ToastService,private coreService: CoreService) {
        this.buildForm();
    }//end of constructor

    ngOnInit(): void {

    }//end of oninit

    /*
    * method to build from
    */
    buildForm(){
        let userFormJson = {
            'mobile': new FormControl(),
            'email': new FormControl(),
            'name': new FormControl()
        }
        this.userForm = new FormGroup(userFormJson);
    }//end of method

    /* method to search user according to search panel */
    searchUser(){
        if(this.userForm.get('email').value || this.userForm.get('mobile').value || this.userForm.get('name').value){
            let query = {
                'email': this.userForm.get('email').value? this.userForm.get('email').value : null,
                'userName': this.userForm.get('name').value ? this.userForm.get('name').value: null,
                'contact': this.userForm.get('mobile').value ? this.userForm.get('mobile').value: null
            }
            this.coreService.getUSerDetailsBySearchData(query).subscribe(res=>{
                if(res.status == 2000){
                   this.userDetails =  res.data;
                    if (this.userDetails.length > 0) {
                        this.showResult = true;
                        this.noResultFound = false;;
                    } else {
                        this.showResult = false;
                        this.noResultFound = true;
                    }
                    
                    if (this.userDetails.length > 5) {
                    this.isPaginator = true;
                    } else {
                    this.isPaginator = false;
                    }
                }
            });

        }else{
            //show toast message
            this.toastService.showI18nToast("Please fill any data","warning");
        }
    }//end of method    

    //method to set reset data
    passwordSetReset(selectedRowValue, isReset: boolean){
        if(isReset){
            let query = {
                "password":"userPw",
                "userEaddress": selectedRowValue.email?selectedRowValue.email: selectedRowValue.contact ,
                "passwordResetFlag": isReset
            }
            this.submitPassword(query);
            this.selectedRowData = {};
        }else{ 
            this.selectedRowData = selectedRowValue;
            this.modalRef = this.bsModalService.show(this.resetPasswordModal, { class: 'modal-md' });
        }
    }//end of method

    //method to set or reset submit
    submitPassword(query){
        // console.log("query::",query);
        this.coreService.setPasswordBySysAdmin(query).subscribe(data=>{
            if(data.status == 2000){
                (!query.passwordResetFlag) ? this.modalRef.hide(): null;
                this.toastService.showI18nToast("Password has been updated","success");
            }
        });
    }//end of method

    setPassword (newPassword: any) {
        if(newPassword.length<6 || newPassword.length>20){
          this.toastService.showToast(-1,"Password must be 6 to 20 characters long");
          return false;
        }
        else{
            let query = {
                "password":newPassword,
                "userEaddress": this.selectedRowData.email? this.selectedRowData.email: this.selectedRowData.contact ,
                "passwordResetFlag": false
            };
            this.submitPassword(query);
            this.selectedRowData = {};
            this.newPassword = "";
        }
    }//end of method
}//end of class