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

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'customerFilter'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //alert(value);
    // alert(args);
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      console.log(val);
      let rVal = (val.groupName && val.groupName.toLocaleLowerCase().includes(args.toString().toLocaleLowerCase())) || (val.displayUserName && val.displayUserName.toLocaleLowerCase().includes(args.toString().toLocaleLowerCase())) || (val.totalMembers && val.totalMembers.toString().toLocaleLowerCase().includes(args.toString().toLocaleLowerCase()));
      console.log(rVal);
      console.log(args);

      return rVal;
    })
  }//end of method

  //method to search by field name
  searchByFieldName(filterArr: any, searchedFiledName: string, searchedext?: any): any {
    if (!searchedext) {
      return filterArr;
    }
    return filterArr.filter((filterArrEl) => {
      // console.log('filterArrEl::::',filterArrEl);
      // console.log("filterArrEl[searchedFiledName]",filterArrEl[searchedFiledName]);
      //resval returns boolean value from the condition
      let resVal = (filterArrEl[searchedFiledName].toLocaleLowerCase().includes(searchedext.toString().toLocaleLowerCase()));
      return resVal;
    })
  }//end of method


  //method to search by field name
  searchByFieldNameForNumber(filterArr: any, searchedFiledName: string, searchedext?: any): any {
    if (!searchedext) {
      return filterArr;
    }
    return filterArr.filter((filterArrEl) => {
      // console.log('filterArrEl::::',filterArrEl);
      // console.log("filterArrEl[searchedFiledName]",filterArrEl[searchedFiledName]);
      //resval returns boolean value from the condition
      let resVal = (filterArrEl[searchedFiledName] == searchedext);
      return resVal;
    })
  }//end of method

  //method to search by ,field ,name,
  searchByFieldNameWithInutArr(filterArr: any, searchedFiledName: string, searchedTextArr?: string[]): any {
    if (searchedTextArr.length == 0) {
      return true;
    }

    //let rex = /Ascoril+test/i  and search
    //let rex = /Ascoril | test/i  or search
    /* let rexParam = '';
     searchedTextArr.forEach( rexStr =>{
       if(rexStr.trim() )
       rexParam = rexParam +'|'+ rexStr.trim();
     });
 
     rexParam = rexParam.substr(1);
 
    
     var regex = new RegExp(rexParam, "i");
    // console.log('regex=============');
     //console.log(regex);*/
    //code for search by inputarr
    let foundCount = 0;
    let result = null;
    for (let rexStr of searchedTextArr) {
      result = filterArr.filter((filterArrEl) => {
        return filterArrEl[searchedFiledName].toLocaleLowerCase().includes(rexStr.toString().toLocaleLowerCase());
      });

      if ((result) && result.length > 0) {
        foundCount = foundCount + 1
      }
    }
    return (foundCount == searchedTextArr.length);
    //end of code for search by input

    /*return filterArr.filter((filterArrEl) => {
      foundCount = 0;
      for( let rexStr of searchedTextArr){
       
       result = filterArrEl[searchedFiledName].toLocaleLowerCase().includes(rexStr.toString().toLocaleLowerCase())
        if( result){
          foundCount = foundCount+1;                  
        }

      }
      console.log(foundCount);
      return (foundCount == searchedTextArr.length);
    });*/

  }//end of method

  searchText(filterArrEl: any, searchedFiledName: string, searchedTextArr?: string[]) {
    for (let rexStr of searchedTextArr) {
      let result = filterArrEl[searchedFiledName].includes()
    }

  }//end of method

  //new add for number array check  
  //method to search by ,field ,name,
  searchByFieldNameWithInputAnyTypeArr(filterArr: any, searchedTextArr?: any[]): any {
    if (searchedTextArr.length == 0) {
      return true;
    }
    let foundCount = 0;
    let result = null;
    for (let rexStr of searchedTextArr) {
      result = filterArr.filter((filterArrEl) => {
        return filterArrEl == (rexStr);
      });

      if ((result) && result.length > 0) {
        foundCount = foundCount + 1
      }
    }
    return (foundCount == searchedTextArr.length);
    //end of code for search by input  

  }//end of method
  //end of new add

  //method to search by day of week
  searchByFieldNameWithInputAnyTypeArrForDayofweek(filterArr: any, searchedTextArr?: any[]): any {
    if (searchedTextArr.length == 0) {
      return true;
    }
    let returnType = false;
    for(let element of searchedTextArr) {
      if(filterArr.includes(element.toString())) {
        //if any of the day includes the main array then return true & break the loop
        returnType = true;
        break;
      }
    }
    return returnType;
  }//end of method

}