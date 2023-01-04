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

import { Component, Input,OnInit,Output,EventEmitter} from '@angular/core';
/*import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl,ControlContainer,FormGroupDirective, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';*/
import { environment } from '../../../../environments/environment';
import { FormGroup} from '@angular/forms';


@Component({
  selector: 'app-single-file',
  templateUrl: './single-file-upload.component.html',
  styleUrls: ['./single-file-upload.component.css']
})

export class SinglefileuploadComponent implements OnInit{
  @Input() uploadForm: FormGroup;


  check(bytes, mime) {
      for (var i = 0, l = mime.mask.length; i < l; ++i) {
          if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
              return false;
          }
      }
      return true;
  };


  loadMime(file, callback) {
    let mimes = [
        {
            mime: 'image/jpeg',
            pattern: [0xFF, 0xD8, 0xFF],
            mask: [0xFF, 0xFF, 0xFF],
        },
        {
            mime: 'image/png',
            pattern: [0x89, 0x50, 0x4E, 0x47],
            mask: [0xFF, 0xFF, 0xFF, 0xFF],
        },
        {
            mime: 'application/pdf',
            pattern: [0x25, 0x50, 0x44, 0x46],
            mask: [0xFF, 0xFF, 0xFF, 0xFF],
        }
        // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
    ];



    let blob = file.slice(0, 4); //read the first 4 bytes of the file
    let reader = new FileReader();

    //console.log(reader);

    reader.onloadend = (event: Event) => {
        let target: any = event.target;

        if (target.readyState === FileReader.DONE) {
            let bytes = new Uint8Array(target.result);

            for (let i=0, l = mimes.length; i<l; ++i) {
              if (this.check(bytes, mimes[i])){
                return callback("Mime: " + mimes[i].mime + " <br> Browser:" + file.type);
              }
              //if (this.check(bytes, mimes[i])) return true;
            }

            //return callback("Mime: unknown <br> Browser:" + file.type);
            return callback("Mime: unknown <br> Browser:" + file.type);

        }
    };

    reader.readAsArrayBuffer(blob);

 }



  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'pdf' || ext.toLowerCase() == 'jpg' || ext.toLowerCase() == 'jpeg' || ext.toLowerCase() == 'wmv' || ext.toLowerCase() == 'mp4') {
        return true;
    }
    else {
        return false;
    }
  }



  fileSelected(event) {

    if(document.getElementById('fileNmae') != null){
      document.getElementById('fileNmae').innerHTML = "";
    }

    if (!this.validateFile(event.target.files[0].name)) {
      document.getElementById('fileNames').insertAdjacentHTML("afterend", "<div class='col-12 validation-error text-center' id='fileNmae'>" + "Only pdf, jpg, png, wmv and mp4 files are allowed" + "</div>");
      return false;
    }else{
      document.getElementById('fileNames').innerHTML = "";
    }




    this.loadMime(event.target.files[0], (function(mime) {
      let notAccept = mime.indexOf("unknown");
       if(notAccept > -1){
         document.getElementById('fileNames').insertAdjacentHTML("afterend", "<div class='col-12 validation-error text-center' id='fileNmae'>" + "The file is corrupted" + "</div>");
       }else{
         this.uploadForm.patchValue({
           file: event.target.files[0]
         });

         document.getElementById('fileNames').insertAdjacentHTML("afterend", "<div class='col-12 text-center' id='fileNmae'>" + event.target.files[0].name + "</div>");
       }


    }).bind(this));


   }


   onDrop(event) {
         event.preventDefault();
         if(document.getElementById('fileNmae') != null){
           document.getElementById('fileNmae').innerHTML = "";
         }


         //let files = event.dataTransfer.files;
         let file1 = event.dataTransfer.files[0];
         let filenames = event.dataTransfer.files[0].name;
         if(event.dataTransfer.files.length > 1){
           document.getElementById('fileNames').insertAdjacentHTML("afterend", "<div class='col-12 validation-error text-center' id='fileNmae'>" + "Multiple file not allowed" + "</div>");
           return false;
         }else{

           if (!this.validateFile(event.dataTransfer.files[0].name)) {
             document.getElementById('fileNames').insertAdjacentHTML("afterend", "<div class='col-12 validation-error text-center' id='fileNmae'>" + "Only pdf, jpg, png, wmv and mp4 files are allowed" + "</div>");
             return false;
           }else{
             document.getElementById('fileNames').innerHTML = "";
           }

           if(document.getElementById('fileNmae') != null){
             document.getElementById('fileNmae').innerHTML = "";
           }


           this.loadMime(event.dataTransfer.files[0], (function(mime) {
             console.log(filenames);
             let notAccept = mime.indexOf("unknown");
              if(notAccept > -1){
                document.getElementById('fileNames').insertAdjacentHTML("afterend", "<div class='col-12 validation-error text-center' id='fileNmae'>" + "The file is corrupted" + "</div>");
                //document.getElementById('fileNames').innerHTML= "The file is corrupted";
                return false;
              }else{
                this.uploadForm.patchValue({
                  file: file1
                });
                document.getElementById('fileNames').insertAdjacentHTML("afterend", "<div class='col-12 text-center' id='fileNmae'>" + filenames + "</div>");
              }


           }).bind(this));



         }




     }


     onDragOver(event) {
         event.stopPropagation();
         event.preventDefault();
     }

     onDragLeave(event) {
         event.stopPropagation();
         event.preventDefault();
     }







  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.uploadForm.statusChanges.subscribe((status) => {
      setTimeout(() => {
        //if(status == "INVALID"){
          let submitBtn = document.getElementsByTagName("button");
          for(let i=0;i<submitBtn.length;i++){
            //console.log(submitBtn[i].classList.contains("clicked"));
            //console.log(submitBtn[i].classList.value);
            if(submitBtn[i].classList.contains("clicked")){
              console.log(submitBtn[i].classList);
              submitBtn[i].disabled = false;
              submitBtn[i].classList.remove("clicked");
            }
          }
        //}
      },1);

     });// -- perform save function here
  }


}
