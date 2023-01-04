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
//sbis-poc/app/issues/603
import { TestBed } from '@angular/core/testing';

import { QueryFrameworkService } from './query-framework.service';

describe('QueryFrameworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryFrameworkService = TestBed.get(QueryFrameworkService);
    expect(service).toBeTruthy();
  });
});
