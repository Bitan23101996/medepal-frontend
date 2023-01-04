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

import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class ServiceProviderUtil {
    private editedMember: BehaviorSubject<any> = new BehaviorSubject(null);
    public memberData = this.editedMember.asObservable();
  
    constructor(private apiService: ApiService, private fb: FormBuilder) { }
    
    createqualification(): FormGroup {
      return this.fb.group({
        doctorQualificationPk: [null],
        qualificationCode: '',
        yearProcured: [null],
        institute: [null],
        qualificationPk: '',
        status: 'NRM',
      });
    }

    createSpecialization(): FormGroup {
      return this.fb.group({
        doctorSpecializationPk: [null],
        specialization: '',
        subSpecialization: '',
        specializationPk: '',
        subSpecializationPk: '',
        status: 'NRM',
      });
    }

    createFees(): FormGroup {
      return this.fb.group({
        description: '',
        amount: '',
        doctorFeesPk: null
        // prepayAmount: ''
      });
    }
    
  }