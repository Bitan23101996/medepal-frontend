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
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalService } from '../../../../shared/directive/modal/modal.service';

@Component({
  selector: 'app-doctor-note',
  templateUrl: './doctor-note.component.html',
  styleUrls: ['./doctor-note.component.css', '../../prescription/prescription.component.css']
})
export class DoctorNoteComponent implements OnInit {

  @Input() noteForm:any;
  @Output() getFormData = new EventEmitter<FormGroup>();
  @ViewChild('doctorNoteModal') doctorNoteModal: TemplateRef<any>;
  noteData: any;
  modalRef: BsModalRef;
  doctorNoteForm: FormGroup;
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  submitted: boolean =false;

  constructor(private fb: FormBuilder, private bsModalService: BsModalService, private modalService: ModalService) { }

  ngOnInit() {
    if(this.noteForm==null){
      this.createForm();
    }
    else{
      this.editForm(this.noteForm);
    }

    /* ******** Auto save modification ******* */
    // If anything changed on Diagnosis Form
    this.doctorNoteForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorNoteForm.dirty){
        this.doctorNoteForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorNoteForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorNoteForm.value);
      
  })
  /* ******** End of Auto save modification ******* */

  }

  ngOnChanges() {
    if(this.noteForm==null){
      this.createForm();
    }
    else{
      this.editForm(this.noteForm);
    }
      /* ******** Auto save modification ******* */
    // If anything changed on Diagnosis Form
    this.doctorNoteForm.valueChanges.distinctUntilChanged().subscribe(formData => {
      // If changed set form control 'isModified' to true
      if(this.doctorNoteForm.dirty){
        this.doctorNoteForm.controls.isModified.patchValue(true, {emitEvent: false, onlySelf: false});
      }
      else{
        this.doctorNoteForm.controls.isModified.patchValue(false, {emitEvent: false, onlySelf: false});
      }
      // Emit with changed data list and 'isModified' status
      this.getFormData.emit(this.doctorNoteForm.value);
      
  })
  /* ******** End of Auto save modification ******* */
  }

  createForm(){
    this.doctorNoteForm = this.fb.group({
      note: [null],
      notePk: [],
      noteStatus: ["NRM"],
      createdDate: [],
      createdBy: [],
      modifiedDate: [],
      modifiedBy: [],
      isModified: [true]
   });
   this.noteData = this.doctorNoteForm.value;
  }

  editForm(res){
    this.doctorNoteForm = this.fb.group({
      note: [res.note],
      notePk: [res.notePk],
      noteStatus: [res.noteStatus],
      // createdDate: [res.createdDate],
      // createdBy: [res.createdBy],
      // modifiedDate: [res.modifiedDate],
      // modifiedBy: [res.modifiedBy],
      isModified: [false]
   });
   this.noteData = this.doctorNoteForm.value;
  }

  saveDoctorNote(){
    this.noteData = this.doctorNoteForm.value;
    this.getFormData.emit(this.doctorNoteForm.value);
    
    //this.modalService.close(id);
    this.modalRef.hide();
  }

  openNoteModal() {
    //this.modalService.open(id);
    this.modalRef = this.bsModalService.show(this.doctorNoteModal, this.config);
  }

  closeModal() {
    this.modalRef.hide();
  }

}
