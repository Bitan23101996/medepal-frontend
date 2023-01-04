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

import { Component, Input,OnInit} from '@angular/core';
/*import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl,ControlContainer,FormGroupDirective, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';*/
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-multiple-file',
  templateUrl: './multiple-file-upload.component.html',
  styleUrls: ['./multiple-file-upload.component.css']
})

export class MultifileuploadComponent implements OnInit{
  //procedureSelectFiles: any = [];//to store selected file
  fileSelected: boolean = false;
  @Input() procedureSelectFiles: any = [];

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



  fileSelectMulti(event) {//to store selected files
    let file = event.target.files;

    for(let i=0; i < file.length; i++ ){

      if (!this.validateFile(file[i].name)) {
        document.getElementById('validation').innerHTML = "Only pdf, jpg, png, wmv and mp4 files are allowed";
        this.procedureSelectFiles = [];
        return false;
      }else{
        document.getElementById('validation').innerHTML = "";
      }


      this.loadMime(file[i], (function(mime) {
        let notAccept = mime.indexOf("unknown");
         if(notAccept > -1){
           document.getElementById('validation').innerHTML = "The file is corrupted" ;
           this.procedureSelectFiles = [];
         }else{
           this.procedureSelectFiles.push({ filetype: "upload", file: file[i] });
           let filePath = event.target.value;
           let filename = event.target.value.substring(filePath.lastIndexOf('/')+1);
           if(filename){
             this.fileSelected = true;
           }
         }


       }).bind(this));
      }
    }


    onDrop(event) {
          event.preventDefault();



          let file = event.dataTransfer.files;


            for(let i=0; i < file.length; i++ ){


              let file1 = event.dataTransfer.files[i];
              let filenames = event.dataTransfer.files[i].name;



              if (!this.validateFile(file[i].name)) {
                document.getElementById('validation').innerHTML = "Only pdf, jpg, png, wmv and mp4 files are allowed";
                this.procedureSelectFiles = [];
                return ;
              }else{
                document.getElementById('validation').innerHTML = "";
              }


              this.loadMime(event.dataTransfer.files[i], (function(mime) {
                console.log(filenames);
                let notAccept = mime.indexOf("unknown");
                 if(notAccept > -1){
                   document.getElementById('validation').innerHTML = "The file is corrupted" ;
                   //document.getElementById('fileNames').innerHTML= "The file is corrupted";
                   this.procedureSelectFiles = [];
                   return ;

                 }else{
                   this.procedureSelectFiles.push({ filetype: "upload", file: file[i] });
                   if(filenames){
                     this.fileSelected = true;
                   }
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


      deleteFileMulti(index) {
        this.procedureSelectFiles.splice(index, 1);
      }




  ngOnInit(): void {

  }

  ngOnChanges(): void {
  }


}
