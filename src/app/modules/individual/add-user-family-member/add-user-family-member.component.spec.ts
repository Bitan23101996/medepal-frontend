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

import { AddUserFamilyMemberComponent } from './add-user-family-member.component';

describe('AddUserFamilyMemberComponent', () => {
  let component: AddUserFamilyMemberComponent;
  let fixture: ComponentFixture<AddUserFamilyMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserFamilyMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserFamilyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});