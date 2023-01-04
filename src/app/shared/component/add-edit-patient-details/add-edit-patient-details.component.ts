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

import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, FormGroupDirective } from "@angular/forms";
import { IndividualService } from '../../../modules/individual/individual.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { SBISConstants } from "../../../SBISConstants";

@Component({
  selector: 'app-add-edit-patient-details',
  templateUrl: './add-edit-patient-details.component.html',
  styleUrls: ['./add-edit-patient-details.component.css'],
  providers: [FormGroupDirective]
  
})
export class AddEditPatientDetailsComponent implements OnInit {

  @Input() patientRefNo: any; 
  @Input() screenFlag: any;
  @Input() patientDetailsList:any;//app#1183

  diseaseForm: FormGroup;
  currentUser: any;
	form: FormGroup;
	procedureListToView: any[] = [];
	diseaseListToView: any[] = [];
	diseases: any[];
	allergyType = [
		"Food allergy",
		"Cold allergy",
		"Dust allergy"
	];

	buttonEnableobj: any = {
		edit: false,
		add: false
	};
	diseaseAddBtnFlag: boolean = false;
	userRefNo:any;
	allFetchData: boolean;
	excerciseFrb: any;
	occupationFrb: any;
	userProfileData: any;
	allergyAddDisableFlag: boolean;
	oldItems: any[] = [];
	allergyHistoryList: any;
	procedureHistory: any[] = [];
	procedure: any = {
		procedureName: '',
		procedureYear: '',
		procedures: []
	}
	disease: any = {
		diseaseName: '',
		diseaseYear: '',
		cured: false,
		diseases: []
	}
	isEditProcedure: any = false;
	isEditDisease: any = false;
	maxDate: any;
	minDate: any;
	familyHistories: any;
	relationList: any[] = [];
	familyHistory: any = {
		diseaseName: '',
		relation: '',
		diseaseYear: '',
		curedFlag: false,
		familyHistories: [],
		oldFamilyHistory: {}
	}
	isEditFamily: boolean = false;

	currentMedicine: any = {
		medicineName: '',
		startDate: '',
		currentMedicinesArr: [],
		oldCurrentMedicine: {}
	}
	isEditCurrentMedicine: boolean = false;
	results: any[];
	resultsToDisplay: any[] = [];
	selectedMedicine: any = {};
	brandName: any;
	isEditAutoComplete: boolean = false;
	isShowDeleteBtn: boolean = true; //app#1183
  // eventValueName: string;
  
  htmlElements={'recentMedicationSection':false,'allergySection':false,'procedureHistorySection':false,'familyHistorySection':false,'diseasesHistorySection':false,'medicalTestReportSection':false,}

	constructor(private frb: FormBuilder, private individualService: IndividualService, private toastService: ToastService) {
		this.initialFormGroup();//to build form
	}//end of constructor

	ngOnInit(): void {
		this.currentUser = JSON.parse(localStorage.getItem('user')); //app#1183
    	this.showCurrentUpdationSection();
		if(this.patientRefNo==null)
			document.body.classList.add('prescription-screen');//to hide header n card css from this page
		this.maxDate = new Date();
		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate();
		this.minDate = new Date(year - 100, month, day);
		//new add

			
		this.loadAllMasterData();
		this.loadAllMasterRelation();

		if(this.patientDetailsList.length==0 && this.patientRefNo!=null){
			this.getProcedureHistory();
			this.getDiseaseHistory();
			this.getAllergyProcedureDiseaseHistory();
			this.retrieveAllFamilyHistory();
			this.retrieveCurrentMedicine();
		}
		/* else{
			this.showCurrentUpdationSection();
		} */
		
		this.userRefNo = this.patientRefNo;//set patient reference number as userRefNo to fetch the API
      //app#1183
		if (this.currentUser.roleName == "INDIVIDUAL") {
			this.isShowDeleteBtn = true;
	    
		  }
	  
		  else if (this.currentUser.roleName == "DOCTOR" || this.currentUser.roleName == "ASSISTANT" || this.currentUser.roleName == "ADMIN") {
			 this.isShowDeleteBtn = false;
	  
		  }
		  
	

		
		
	}//end of on init

	onSelectDateProcedure(event, procedure){
		procedure.procedureYear=event;
	}

	onSelectDateDiseas(event, familyHistory){
		familyHistory.diseaseYear=event;
	}

	onSelectDateFamily(event, familyHistory){
		familyHistory.diseaseYear=event;
	}

	loadAllMasterData() {
		this.individualService.getMasterDataAllergy({ q: SBISConstants.MASTER_DATA.ALLERGY }).subscribe(data => {
			if (data.status === 2000) {
				this.allergyType = data.data;
			}
		});
	}

	loadAllMasterRelation() {
		this.individualService.getMasterDataRelation({ q: SBISConstants.MASTER_DATA.RELATION }).subscribe((data) => {
			if (data.status === 2000) {
			   this.relationList = data.data;
			// data.data.forEach(element => {
			// 	if(element.displayValue != "Friend") {
			// 		this.relationList.push(element);
			// 	}
			// });
				this.relationList = data.data.filter(x => x.displayValue != "Friend");
				this.relationList = this.relationList.filter(x => x.displayValue != "Colleague");
			} else {
			  this.toastService.showI18nToast(data.message, 'success');
			}
		  }, (error) => {
			// show error
		});
	}

	getAllergyProcedureDiseaseHistory() {
		this.initialFormGroup();
		this.getAllergyHistory();
	}//end of methos
	//method to get allergy history
	getAllergyHistory() {
		this.individualService.getAllergyHistory(this.userRefNo).subscribe((result) => {
			if (result.status === 2000) {
				let allergyHistory = result.data;
				this.allergyHistoryList = result.data;
				allergyHistory.forEach(allergyEl => {
					let ctrl = <FormArray>this.form.controls.allergy;
					ctrl.push(this.frb.group({
						'userAllergyId': [allergyEl.userAllergyId],
						'userRefNo': [allergyEl.userRefNo],
						'allergyType': [allergyEl.allergyType, Validators.required],
						'causes': [allergyEl.causes, Validators.required],
						'isEdit': [false],
						'isSubmit': [false]
					}));
				});
				this.excerciseFrb = this.form.get('allergy') as FormArray;
			}
			this.allFetchData = true;
		});
	}//end of method

	addProcedure() {
		let procedure = {
			procedureName: '',
			procedureYear: '',
			isEdit: true,
			isSubmit: false
		}
		this.procedure.procedures.unshift(procedure);
		this.isEditProcedure = true;
	}

	cancelProcedure(procedure, index) {
		this.isEditProcedure = false;
		if(procedure.isSubmit == true) {
			this.procedure.procedures[index].isEdit = false;
		} else {
			this.procedure.procedures.splice(index, 1);
		}
	}

	saveProcedureHistory(procedure) {
		let query: any;
		if(procedure.isSubmit == false) {
			query = [{
				"userRefNo": this.userRefNo,
				"procedureName": procedure.procedureName,
				"procedureYear": procedure.procedureYear.getFullYear()
			}]
		} else {
			query = [{
				"id": procedure.id,
				"procedureName": procedure.procedureName,
				"procedureYear": procedure.procedureYear.getFullYear()
			}]
		}
		this.individualService.saveProcedure(query).subscribe((result) => {
			if (result.status == 2000) {
				this.getProcedureHistory();
        this.isEditProcedure = false;
        this.toastService.showI18nToast("Successful", "success");
			}
		});
	}

	getProcedureHistory() {
		this.individualService.getProcedure(this.userRefNo).subscribe((resp) => {
			if (resp.status == 2000) {
				this.procedure.procedures = [];
				let procedureHistory = resp.data;
				// this.procedure.procedures = resp.data;
				procedureHistory.forEach(procedureEl => {
					this.procedure.procedures.push({
						'id': procedureEl.id,
						'procedureName': procedureEl.procedureName,
						'procedureYear': new Date(parseInt(procedureEl.procedureYear), 1),
						'isEdit': false,
						'isSubmit': false
					});
				});
			}
		});
	}

	editProcedure(index, procedure) {
		this.isEditProcedure = true;
		this.procedure.procedures[index].isEdit = true;
		this.procedure.procedures[index].isSubmit = true;
	}

	updateProcedure(procedure, index) {
		let query = [{
			"id": procedure.id,
			"procedureName": procedure.procedureName,
			"procedureYear": procedure.procedureYear
		}]
		this.individualService.saveProcedure(query).subscribe((result) => {
			if (result.status == 2000) {
				this.procedure.procedures = [];
				this.getProcedureHistory();
        this.isEditProcedure = false;
        this.toastService.showI18nToast("Successful", "success");
			}
		});
	}

	deleteProcedureHistory(procedure) {
		if (confirm('are you sure you want to delete this procedure ?')) {
			this.individualService.deleteProcedure([procedure.id]).subscribe((resp) => {
				if (resp.status == 2000) {
					this.getProcedureHistory();
					//this.allergyAddDisableFlag = false;
				}
			});
		}
	}

	addDisease() {
		let disease = {
			diseaseName: '',
			diseaseYear: '',
			cured: false,
			isEdit: true,
			isSubmit: false
		}
		this.disease.diseases.unshift(disease);
		this.isEditDisease = true;
	}

	getDiseaseHistory() {
		this.individualService.getDisease(this.userRefNo).subscribe((result) => {
			if(result.status == 2000) {
				this.disease.diseases = [];
				let diseaseHistory = result.data;
				diseaseHistory.forEach(diseaseEL => {
					this.disease.diseases.push({
						'id': diseaseEL.id,
						'diseaseName': diseaseEL.diseaseName,
						'diseaseYear': new Date(parseInt(diseaseEL.diseaseYear), 1),
						'cured': diseaseEL.cured,
						'isEdit': false,
						'isSubmit': false
					});
				});
			}
		});
	}

	editDisease(index, disease) {
		this.isEditDisease = true;
		this.disease.diseases[index].isEdit = true;
		this.disease.diseases[index].isSubmit = true;
	}

	updateDiseaseHistory(disease) {

		let query: any;
		if(disease.isSubmit == false) {
			query = [{
				"userRefNo": this.userRefNo,
				"diseaseName": disease.diseaseName,
				"diseaseYear": disease.diseaseYear.getFullYear(),
				"cured": disease.cured
			}]
		} else {
			query = [{
				"id": disease.id,
				"diseaseName": disease.diseaseName,
				"diseaseYear": disease.diseaseYear.getFullYear(),
				"cured": disease.cured
			}]
		}
	if(disease != null){
		this.individualService.updateDisease(query).subscribe((result) => {
			if (result.status == 2000) {
				this.getDiseaseHistory();
        this.isEditDisease = false;
        this.toastService.showI18nToast("Successful", "success");
			}
		});
	}
	}

	deleteDiseaseHistory(disease) {
		if (confirm('are you sure you want to delete this disease ?')) {
			this.individualService.deleteDisease([disease.id]).subscribe((resp) => {
				if (resp.status == 2000) {
					this.getDiseaseHistory();
				}
			});
		}
	}

	cancelDisease(disease, index) {
		this.isEditDisease = false;
		if(disease.isSubmit == true) {
			this.disease.diseases[index].isEdit = false;
		} else {
			this.disease.diseases.splice(index, 1);
		}
	}

	initialFormGroup() {
		this.form = this.frb.group({
			allergy: this.frb.array([]),
			//   occupation: this.frb.array([])
		});
	}

	deleteAllergy(ctrl: any, index: number) {
		if (ctrl.value.userAllergyId < 1) {
			let arrayControl = this.form.get('allergy') as FormArray;
			arrayControl.removeAt(index);
			this.allergyAddDisableFlag = false;
			return;
		}
		if (confirm('are you sure you want to delete this allergy ?')) {
			let query = [ctrl.value.userAllergyId];

			this.individualService.deleteAllergy(query).subscribe(data => {
				if (data.status === 2000) {
					this.getAllergyProcedureDiseaseHistory();
					if (this.allergyAddDisableFlag) {
						this.allergyAddDisableFlag = false;
					}
				}
				// this.toastService.showToast(data.status, data.message);
			});
		} else {
			// do nothing
		}
	}//end of method

	addAllergy() {
		let ctrl = <FormArray>this.form.controls.allergy;
		let formControl = this.frb.group({
			'userAllergyId': [0],
			'userRefNo': [this.userRefNo, Validators.required],
			'allergyType': [null, Validators.required],
			'causes': [null, Validators.required],
			'isEdit': [true],
			'isSubmit': [false]
		});

		let formGroupArray = this.frb.array([]);
		formGroupArray.push(formControl);
		let arrayControl = this.form.get('allergy') as FormArray;
		for (let i = 0; i < arrayControl.length; i++) {
			let item = arrayControl.at(i);
			formGroupArray.push(item);
		}
		this.form.setControl('allergy', formGroupArray);
		this.allergyAddDisableFlag = true;
	}//end of method

	cancelAllergy(ctrl, inx, iconType) {
		this.allergyAddDisableFlag = false;
		let arrayControl = this.form.get('allergy') as FormArray;
		arrayControl.removeAt(inx);
		if (iconType == 'edit') {
			let oldIm = this.oldItems.filter(x => x["userAllergyId"] == ctrl.value.userAllergyId)[0];
			let formControl = this.frb.group({
				'userAllergyId': oldIm.userAllergyId,
				'userRefNo': oldIm.userRefNo,
				'allergyType': oldIm.allergyType,
				'causes': oldIm.causes,
				'isEdit': [false],
				'isSubmit': [false]
			});
			arrayControl.insert(inx, formControl);
		}
		ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
	}//end of method

	saveAllergy(ctrl: any) {
		let allergyValues = ctrl.value;
		ctrl.patchValue({
			'isSubmit': true
		});
		if (ctrl.invalid) {
			return;
		}
		// console.log(allergyValues);
		if (this.allergyHistoryList.length > 0) {
			if (allergyValues.userAllergyId > 0 &&
				this.allergyHistoryList.filter(x => x["allergyType"] == allergyValues.allergyType &&
					x["userAllergyId"] != allergyValues.userAllergyId &&
					x["causes"] == allergyValues.causes).length > 0) {
				this.toastService.showI18nToast("This allergy is already exist", 'error');
				return;
			} else if (this.allergyHistoryList.filter(x => x["allergyType"] == allergyValues.allergyType &&
				x["causes"] == allergyValues.causes && x["userAllergyId"] != allergyValues.userAllergyId).length > 0) {
				this.toastService.showI18nToast("This allergy is already exist", 'error');
				return;
			} else if (allergyValues.userAllergyId < 1 && this.allergyHistoryList.filter(x => x["allergyType"] == allergyValues.allergyType &&
				x["causes"] == allergyValues.causes).length > 0) {
				this.toastService.showI18nToast("This allergy is already exist", 'error');
				return;
			}
		}
		let allergyDataObj = {
			'allergyType': allergyValues.allergyType,
			'causes': allergyValues.causes
		};
		allergyValues.userAllergyId > 0 ? allergyDataObj['userAllergyId'] = allergyValues.userAllergyId : allergyDataObj['userRefNo'] = allergyValues.userRefNo;
		// if (allergyValues.userAllergyId < 1) {
		//   delete allergyData["userAllergyId"];
		// }
		let allergyData: any[] = [];
		allergyData.push(allergyDataObj);
		this.individualService.saveAllergy(allergyData
		).subscribe((data) => {
			if (data.status === 2000) {
				this.getAllergyProcedureDiseaseHistory();
				this.allergyAddDisableFlag = false;
			}
			this.toastService.showI18nToast(data.message, 'success');
		});
		this.oldItems = [];
	}//end of method

	editAllergy(ctrl: any) {
		ctrl.patchValue({
			'isEdit': !ctrl.value.isEdit
		});
		this.allergyAddDisableFlag = true;
		this.oldItems.push(ctrl.value);
	}//end of method

	retrieveAllFamilyHistory() {
		this.individualService.userFamilyHistoryRetrieve(this.userRefNo).subscribe((familyHistory) => {
			if(familyHistory.status == 2000) {
				this.familyHistory.familyHistories = [];
				familyHistory.data.forEach(element => {
					this.familyHistory.familyHistories.push({
						'diseaseName': element.diseaseName,
						'diseaseYear': String(element.diseaseYear),
						'relation': element.relation,
						'curedFlag': element.curedFlag,
						'userFamilyHistoryRefno': element.userFamilyHistoryRefno,
						'isEdit': false,
						'isSubmit': false,
						'isEditRow': false
					});
				});
			}
		});
	}//end of method

	cancelFamilyHistory(familyHistory, index) {
		this.isEditFamily = false;
		if(familyHistory.isSubmit == true) {
			let editedFamilyHistory = this.familyHistory.familyHistories[index];
			editedFamilyHistory.isEdit = false;
			editedFamilyHistory.diseaseName = this.familyHistory.oldFamilyHistory.diseaseName;
			editedFamilyHistory.relation = this.familyHistory.oldFamilyHistory.relation;
			editedFamilyHistory.diseaseYear = this.familyHistory.oldFamilyHistory.diseaseYear;
			editedFamilyHistory.curedFlag = this.familyHistory.oldFamilyHistory.curedFlag;
			this.familyHistory.familyHistories.forEach(element => {
				element.isEditRow = false;
			});
		} else {
			this.familyHistory.familyHistories.splice(index, 1);
		}
	}//end of method

	editFamilyHistory(familyHistory, index) {
    console.log("familyHistory::",familyHistory);
   

		this.familyHistory.oldFamilyHistory = {
			'diseaseName': familyHistory.diseaseName,
			'relation': familyHistory.relation,
			'diseaseYear': familyHistory.diseaseYear,
			'curedFlag': familyHistory.curedFlag
		}
		this.familyHistory.diseaseYear = this.familyHistory.oldFamilyHistory.diseaseYear;
		this.isEditFamily = true;
		this.familyHistory.familyHistories[index].isEdit = true;
		this.familyHistory.familyHistories[index].isSubmit = true;
		let i = 0;
		for(let histories of this.familyHistory.familyHistories) {
			if(i == index) {
				this.familyHistory.familyHistories[i].isEditRow = false;
			} else {
				this.familyHistory.familyHistories[i].isEditRow = true;
			}
			i = i + 1;
    }
   
    
	}//end of method

	updateFamilyHistory(familyHistory) {

		if(!familyHistory.diseaseName || familyHistory.diseaseName == "") {
			//this.toastService.showI18nToast("Please enter disease name","warning");
			return;
		} else if (!familyHistory.relation || familyHistory.relation == "") {
			//this.toastService.showI18nToast("Please enter relation","warning");
			return;
		} else if (!familyHistory.diseaseYear || familyHistory.diseaseYear == "") {
			//this.toastService.showI18nToast("Please enter disease year","warning");
			return;
		}
		let query: any;
		if(familyHistory.isSubmit == false) {
			query = [{
				"userRefNo": this.userRefNo,
				"diseaseName": familyHistory.diseaseName,
				"diseaseYear": familyHistory.diseaseYear.getFullYear(),
				"curedFlag": familyHistory.curedFlag,
				"relation": familyHistory.relation
			}]
		} else {
			query = [{
				"userFamilyHistoryRefno": familyHistory.userFamilyHistoryRefno,
				"diseaseName": familyHistory.diseaseName,
				"diseaseYear": familyHistory.diseaseYear.getFullYear(),
				"curedFlag": familyHistory.curedFlag,
				"relation": familyHistory.relation
			}]
		}
		if(this.familyHistory !=null){
	        this.individualService.userFamilyHistorySave(query).subscribe((result) => {
			if (result.status == 2000) {
				this.retrieveAllFamilyHistory();
				this.isEditFamily = false;
				this.toastService.showI18nToast("Successful", "success");
			}
		});
	   }
	}//end of method

	deleteFamilyHistory(familyHistory) {
		if (confirm('are you sure you want to delete this family history ?')) {
			this.individualService.userFamilyHistoryDelete([{'userFamilyHistoryRefno': familyHistory.userFamilyHistoryRefno}]).subscribe((resp) => {
				if (resp.status == 2000) {
					this.retrieveAllFamilyHistory();
				}
			});
		}
	}//end of method

	addFamilyHistory() {
		let familyHistory = {
			diseaseName: '',
			relation: '',
			diseaseYear: '',
			cured: false,
			isEdit: true,
			isSubmit: false
		}
		this.familyHistory.familyHistories.unshift(familyHistory);
		this.isEditFamily = true;
	} //end of method

	addCurrentMedicine() {
		let currentMedicine = {
			medicineName: '',
			startDate: '',
			isEdit: true,
			isSubmit: false
		}
		this.currentMedicine.currentMedicinesArr.unshift(currentMedicine);
		this.isEditCurrentMedicine = true;
		this.isEditAutoComplete = false;
	} //end of method

	onSelectDateMedicine(event, currentMedicine){
		currentMedicine.startDate = event;
	} //end of method

	cancelCurrentMedicine(currentMedicine, index) {
		this.isEditCurrentMedicine = false;
		if(currentMedicine.isSubmit == true) {
			let editedCurrentMedicine = this.currentMedicine.currentMedicinesArr[index];
			editedCurrentMedicine.isEdit = false;
			editedCurrentMedicine.medicineName = this.currentMedicine.oldCurrentMedicine.medicineName;
			editedCurrentMedicine.startDate = this.currentMedicine.oldCurrentMedicine.startDate;
			this.currentMedicine.currentMedicinesArr.forEach(element => {
				element.isEditRow = false;
			});
		} else {
			this.currentMedicine.currentMedicinesArr.splice(index, 1);
		}
	}//end of method

	editCurrentMedicine(currentMedicine, index) {
		this.isEditCurrentMedicine = true;
		this.isEditAutoComplete = true;
		this.currentMedicine.oldCurrentMedicine = {
			'medicineName': currentMedicine.medicineName,
			'startDate': currentMedicine.startDate
		}
		this.selectedMedicine['medicineId'] = currentMedicine.medicineId;
		this.selectedMedicine['medicineName'] = currentMedicine.medicineName;
		this.currentMedicine.medicineName = currentMedicine.medicineName;
		this.currentMedicine.currentMedicinesArr[index].isEdit = true;
		this.currentMedicine.currentMedicinesArr[index].isSubmit = true;
		let i = 0;
		for(let histories of this.currentMedicine.currentMedicinesArr) {
			if(i == index) {
				this.currentMedicine.currentMedicinesArr[i].isEditRow = false;
			} else {
				this.currentMedicine.currentMedicinesArr[i].isEditRow = true;
			}
			i = i + 1;
		}
	} //end of method

	updateCurrentMedicine(currentMedicine, index) {

		if(!this.selectedMedicine) {
			//this.toastService.showI18nToast("Please select your medicine","warning");
			return;
		} else if (!currentMedicine.startDate) {
			//this.toastService.showI18nToast("Please enter date","warning");
			return;
		}
		if(currentMedicine.startDate == "Invalid Date") {
			//this.toastService.showI18nToast("Please enter a valid date","warning");
			return;
		}
		let myMedicines = [];
		let i = 0;
		this.currentMedicine.currentMedicinesArr.forEach(element => {
			if(i != index) {
				myMedicines.push(element);
			}
			i = i + 1;
		});
		if(myMedicines.find(x => x.medicineId == this.selectedMedicine.medicineId)) {
			this.toastService.showI18nToast("This medicine is already added", "error");
			return;
		}
		let query = {};
		if(currentMedicine.isSubmit == false) {
			query = [{
				"userRefNo": this.userRefNo,
				"medicineName": this.selectedMedicine.brandName!=null?this.selectedMedicine.brandName:currentMedicine.medicineName,
				"startDate": currentMedicine.startDate,
				"medicineId": this.selectedMedicine.medicineId
			}]
		} else {
			query = [{
				"userCurrentMedicationRefNo": currentMedicine.userCurrentMedicationRefNo,
				"medicineName": this.selectedMedicine.brandName!=null?this.selectedMedicine.brandName:currentMedicine.medicineName,
				"startDate": currentMedicine.startDate,
				"medicineId": this.selectedMedicine.medicineId
			}]
    }

    
		this.individualService.currentMedicineSave(query).subscribe((resp) => {
			if(resp.status == 2000) {
				this.retrieveCurrentMedicine();
				this.isEditCurrentMedicine = false;
				this.toastService.showI18nToast("Successful", "success");
			}
		});
	} //end of method

	retrieveCurrentMedicine() {
		this.individualService.currentMedicineRetrieve(this.userRefNo).subscribe((currentMedicine) => {
			if(currentMedicine.status == 2000) {
				this.currentMedicine.currentMedicinesArr = [];
				currentMedicine.data.forEach(element => {
					this.currentMedicine.currentMedicinesArr.push({
						'medicineId': element.medicineId,
						'medicineName': element.medicineName,
						'startDate': new Date(element.startDate),
						'userCurrentMedicationRefNo': element.userCurrentMedicationRefNo,
						'isEdit': false,
						'isSubmit': false,
						'isEditRow': false
					});
				});
			}
		});
	} //end of method

	deleteCurrentMedicine(currentMedicine) {
		if (confirm('are you sure you want to delete this current medicine ?')) {
			this.individualService.currentMedicineDelete([{"userCurrentMedicationRefNo": currentMedicine.userCurrentMedicationRefNo}]).subscribe((result) => {
				if(result.status == 2000) {
					this.retrieveCurrentMedicine();
					this.toastService.showI18nToast("Deleted Successfully", "success");
				}
			});
		}
	} //end of method

	search(event) {
		if (event.query.length < 3) {
		  this.results = [];
		  return;
		}
		this.individualService.getMedicinesByNameList(event.query).subscribe((data) => {
			this.isEditAutoComplete = false;
		  this.resultsToDisplay = data.data;
		  this.results = this.resultsToDisplay.filter(el => el['ss'] == null);
		});
	} //end of search method

	onClickMedAddByMedSearchDrpDwn(resultEl) {
		this.isEditCurrentMedicine = false;
		this.isEditAutoComplete = false;
		this.selectedMedicine = resultEl;
		// this.currentMedicine.medicineName = this.selectedMedicine.brandName;
	} //end of method

	changeName(event, type, index) {
		if(type == 'familyHistoryDiseaseName') {
		  this.familyHistory.familyHistories[index].diseaseName = event;
		}
		if(type == 'procedureName') {
			this.procedure.procedures[index].procedureName = event;
		}
		if(type == 'diseaseName') {
			this.disease.diseases[index].diseaseName = event;
		}
  }
  
  showCurrentUpdationSection(){
	 
    switch(this.screenFlag){
          case "DH":
					  this.htmlElements.diseasesHistorySection=true;
					  this.disease.diseases=this.patientDetailsList;
                      break;
           case "AG":
					  this.htmlElements.allergySection=true;
					  this.allergyHistoryList =this.patientDetailsList;
					  this.patientDetailsList.forEach(allergyEl => {
						let ctrl = <FormArray>this.form.controls.allergy;
							ctrl.push(this.frb.group({
								'userAllergyId': [allergyEl.userAllergyId],
								'userRefNo': [allergyEl.userRefNo],
								'allergyType': [allergyEl.allergyType, Validators.required],
								'causes': [allergyEl.causes, Validators.required],
								'isEdit': [false],
								'isSubmit': [false]
							}));
					   });
					   this.allFetchData = true;
					   console.log(this.form);
					   
                      break;
          case "FH":
                      this.htmlElements.familyHistorySection=true;
                      this.familyHistory.familyHistories = this.patientDetailsList;
                      break;
          case "RM":
                      this.htmlElements.recentMedicationSection=true;
                      this.currentMedicine.currentMedicinesArr = this.patientDetailsList;
                      break;
          case "MT":
                      this.htmlElements.medicalTestReportSection=true;
                      break;
          case "PH":
                      this.htmlElements.procedureHistorySection=true;
                      this.procedure.procedures = this.patientDetailsList;
                      break; 
    }
  }


}
