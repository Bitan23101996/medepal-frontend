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
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDiagnosisComponent } from './doctor-diagnosis.component';

describe('DoctorDiagnosisComponent', () => {
  let component: DoctorDiagnosisComponent;
  let fixture: ComponentFixture<DoctorDiagnosisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorDiagnosisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorDiagnosisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
