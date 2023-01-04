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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import 'fabric';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { DoctorService } from 'src/app/modules/doctor/doctor.service';
declare const fabric: any;

import { DomSanitizer } from '@angular/platform-browser';
import { SBISConstants } from 'src/app/SBISConstants';

@Component({
  selector: 'canvas-paint',
  templateUrl: './canvas-paint.component.html',
  styleUrls: ['./canvas-paint.component.css']
})

export class CanvasPaintComponent implements OnInit {

  @Input() canvasDetailsFromProcedure: any;
  @Input() prescriptionDetail: any;
  @Input() previousDrewImage: any;
  @Output() getCanvasData = new EventEmitter<any>();
  canvas: any = {};
  props: any = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  //canvas test
  colors = ["#0000FF", "#FF0000", '#000000'];;
  captures: Array<any> = [];
  brushSize: any[] = [{ size: 15 + 'px', bs: 5 }, { size: 20 + 'px', bs: 10 }];
  //canvas test

  //    textString: string;
  url: any = '';
  size: any = {
    width: 620,
    height: 400
  };

  json: any;
  globalEditor: boolean = false;
  textEditor: boolean = false;
  imageEditor: boolean = false;
  figureEditor: boolean = false;
  selected: any = {};
  doctorRefNo: string;
  groupByImageList: any[] = [];
  domSanitizer: any;

  constructor(private http: HttpClient, private _doctorService: DoctorService, private _domSanitizer: DomSanitizer) {
    this.domSanitizer = _domSanitizer;
    this.getMasterMedicalImageGroupMap();
  }

  ngOnInit() {
    // console.log("previousDrewImage:::::::canvas component", this.previousDrewImage);
    //setup front side canvas
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue'
    });

    this.canvas.on({
      'object:moving': (e) => { },
      'object:modified': (e) => { },
      'object:selected': (e) => {

        let selectedObject = e.target;
        this.selected = selectedObject
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        // selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {

          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFontStyle();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              console.log('image');
              break;
          }
        }
      },
      'selection:cleared': (e) => {
        this.selected = null;
        this.resetPanels();
      }
    });

    this.size.width = (this.canvasDetailsFromProcedure)? 900: 620;
    this.size.height = (this.canvasDetailsFromProcedure)? 500: 400;
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    // get references to the html canvas element & its context
    // this.canvas.on('mouse:down', (e) => {
    // let canvasElement: any = document.getElementById('canvas');
    // console.log(canvasElement)
    // });

    // this.canvas.backgroundColor = '#efefef';


    // document.getElementById('colorpicker').addEventListener('click', function (e) {
    //         console.log(e.target.value);
    //         this.canvas.freeDrawingBrush.color = e.target.value;
    //   });

    this.canvas.freeDrawingBrush.color = "#000000";
    this.canvas.freeDrawingBrush.width = 0;

    if (this.previousDrewImage) {
      this.addImageOnCanvas(this.previousDrewImage.url);
    }
    this.getDoctorRefNo();
    this.getRecentImages();//to get recent images
  }//end of oninit

  //method to get doctor ref no
  getDoctorRefNo() {
    this.doctorRefNo = (this.canvasDetailsFromProcedure) ? this.canvasDetailsFromProcedure.doctorRefNo : this.prescriptionDetail.controls['doctorRefNo'].value;
  }//end of method

  getMasterMedicalImageGroupMap() {
    this._doctorService.getMasterMedicalImageGroupMap().subscribe(response => {
      if (response.status == 2000) {
        this.groupByImageList = response.data;
        this.getGroupImageUrl();
      }
    });
  }//end of groupmimage call

  //method to get all group image urls
  getGroupImageUrl() {
    this.groupByImageList.forEach((groupImage, indexforGroupImage) => {
      let groupImageUrlList: any[] = [];
      groupImage.medicalImageRefNoList.forEach((medImgRefNo, index) => {
        let imageUrlsList = {};
        this._doctorService.downloadDocument({
          "downloadFor": "MEDICAL_IMAGE",
          "medicalImageRefNo": medImgRefNo
        }).subscribe((response) => {
          if (response.status == 2000) {
            imageUrlsList['key'] = medImgRefNo;
            imageUrlsList['imageUrl'] = "data:" + response.data.contentType + ";base64," + response.data.data;
            groupImageUrlList.push(imageUrlsList);
          }
        });
      });
      groupImage["groupImageUrlList"] = groupImageUrlList;
      groupImage["accordianFlag"] = false;
    });
  }//end of method
  accordianflagForRecentImage: boolean = false;
  accordianHeaderClick(clickedFrom: string, selectedImageGroup: any, selectedGroupImgIndex?: number) {
    if (clickedFrom == "recentImg") {
      this.accordianflagForRecentImage = this.accordianflagForRecentImage ? this.accordianflagForRecentImage = false : this.accordianflagForRecentImage = true;
    } else {
      this.groupByImageList.forEach((groupimg, index) => {
        if (selectedGroupImgIndex != index) {
          // groupimg.accordianFlag = false; //--currently closed because of some issue
        } else {
          selectedImageGroup.accordianFlag = selectedImageGroup.accordianFlag ? groupimg.accordianFlag = false : groupimg.accordianFlag = true;
        }
      });
    }
  }


  pencil(brushSize) {
    // this.canvas.freeDrawingCursor='url(assets/image/edit.svg), auto'; //= 'url(assets/image/edit.svg) 1 1,auto';//'pointer';
    this.canvas.isDrawingMode = 1;
    this.canvas.freeDrawingBrush.width = brushSize;
    this.setDefaultBrushColor();
    this.canvas.renderAll();
  }

  undoPencil() {
    this.canvas.isDrawingMode = 0;
    this.canvas.freeDrawingBrush.width = 0;
    this.setDefaultBrushColor();//to set dafult brush color if it is white
  }

  setDefaultBrushColor() {
    if (this.canvas.freeDrawingBrush.color == "#ffffff") {
      this.canvas.freeDrawingBrush.color = "#000000";
    }
  }
  /*------------------------Block elements------------------------*/

  //Block "Size"

  changeSize(event: any) {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
  }

  //Block "Add text"

  addText() {
    this.undoPencil();
    let textString = "Enter Text";//this.textString;
    let text = new fabric.IText(textString, {
      left: 10,
      top: 10,
      fontFamily: 'helvetica',
      angle: 0,
      fill: 'grey',
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      hasRotatingPoint: true
    });
    this.extend(text, this.randomId());
    this.canvas.add(text);
    // this.selectItemAfterAdded(text);
    // this.textString = '';
    this.canvas.on("text:editing:entered", this.clearText);
    this.canvas.add(text);
  }


  clearText(e) {
    if (e.target.type === "i-text") {
      if (e.target.text === "Enter Text") {
        e.target.text = "";
        e.fill = "black";
        this.canvas.renderAll();
      };
    }
  }

  recentImagesList: any[] = [];

  downloadImage(res) {
    this.recentImagesList = [];
    this.accordianflagForRecentImage = true;
    res.forEach(element => {
      this._doctorService.downloadDocument({
        "downloadFor": "MEDICAL_IMAGE",
        "medicalImageRefNo": element.medicalImageRefno
      }).subscribe((response) => {
        if (response.status == 2000) {
          let recentImage: any = {};
          recentImage['imageUrl'] = "data:" + response.data.contentType + ";base64," + response.data.data;
          this.recentImagesList.push(recentImage);
        }
      });
    });
  }//end of method

  getRecentImages() {
    this._doctorService.retrieveDrRecentImages({ 'doctorRefNo': this.doctorRefNo }).subscribe((res) => {
      if (res.status == 2000) {
        this.downloadImage(res.data);
      }
    });
  }

  saveRecentImage(imageURlList) {
    this._doctorService.postDrRecentImages({ 'medicalImageRefno': imageURlList.key, 'doctorRefNo': this.doctorRefNo }).subscribe((res) => {
      if (res.status == 2000)
        this.getRecentImages();
    });
  }
  //Block "Add images"

  getImgPolaroid(event: any, imageURlList) {
    let el = event.target;

    this.saveRecentImage(imageURlList);
    fabric.Image.fromURL(el.src, (image) => {
      image.set({
        left: 10,
        top: 10,
        angle: 0,
        padding: 10,
        cornersize: 10,
        hasRotatingPoint: true,
        peloas: 12
      });
      //   image.width = 150;
      //   image.height = 150;
      image.scaleToHeight(200);
      image.scaleToWidth(200);
      this.extend(image, this.randomId());
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
    });
    this.undoPencil();
  }

  //Block "Upload Image"

  addImageOnCanvas(url) {
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornersize: 10,
          // height:100,
          // width:100,///////
          hasRotatingPoint: true
        });
        image.scaleToHeight(this.canvas.height);
        image.scaleToWidth(this.canvas.width);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event) => {
        this.url = event.target['result'];
      }
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  };

  //Block "Add figure"

  addFigure(figure) {
    this.undoPencil();
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0,
          fill: null, stroke: this.canvas.freeDrawingBrush.color,
          strokeWidth: 3
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0,
          fill: null, stroke: this.canvas.freeDrawingBrush.color,
          strokeWidth: 3
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10,
          fill: null, stroke: this.canvas.freeDrawingBrush.color,
          strokeWidth: 3
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50, left: 10, top: 10,
          fill: null, stroke: this.canvas.freeDrawingBrush.color,
          strokeWidth: 3
        });
        break;

      case 'arrow':
        add = this.generateArrow(100, 100, 150, 150);
        break;
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  /*Canvas*/

  //   cleanSelect() {
  //     this.canvas.deactivateAllWithDispatch().renderAll();
  //   }

  generateArrow(fromx, fromy, tox, toy): any {
    var angle = Math.atan2(toy - fromy, tox - fromx);

    var headlen = 7;  // arrow head size

    // bring the line end back some to account for arrow head.
    tox = tox - (headlen) * Math.cos(angle);
    toy = toy - (headlen) * Math.sin(angle);
    var points = [
      {
        x: fromx,  // start point
        y: fromy
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle - Math.PI / 2),
        y: fromy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      }, {
        x: tox - (headlen / 4) * Math.cos(angle - Math.PI / 2),
        y: toy - (headlen / 4) * Math.sin(angle - Math.PI / 2)
      }, {
        x: tox - (headlen) * Math.cos(angle - Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle - Math.PI / 2)
      }, {
        x: tox + (headlen) * Math.cos(angle),  // tip
        y: toy + (headlen) * Math.sin(angle)
      }, {
        x: tox - (headlen) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen) * Math.sin(angle + Math.PI / 2)
      }, {
        x: tox - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: toy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      }, {
        x: fromx - (headlen / 4) * Math.cos(angle + Math.PI / 2),
        y: fromy - (headlen / 4) * Math.sin(angle + Math.PI / 2)
      }, {
        x: fromx,
        y: fromy
      }
    ];
    let add = new fabric.Polyline(points, {
      fill: 'black', stroke: this.canvas.freeDrawingBrush.color,
      strokeWidth: 1,
      opacity: 1,
      originX: 'left',
      originY: 'top',
      selectable: true
    });
    return add;
  }

  selectItemAfterAdded(obj) {
    // this.canvas.deactivateAllWithDispatch().renderAll();
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    let self = this;
    if (this.props.canvasImage) {
      this.canvas.setBackgroundColor({ source: this.props.canvasImage, repeat: 'repeat' }, function () {
        // self.props.canvasFill = '';
        self.canvas.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return '';

    return (object.getSelectionStyles && object.isEditing)
      ? (object.getSelectionStyles()[styleName] || '')
      : (object[styleName] || '');
  }


  setActiveStyle(styleName, value, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return;

    if (object.setSelectionStyles && object.isEditing) {
      var style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    }
    else {
      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }


  getActiveProp(name) {
    var object = this.canvas.getActiveObject();
    if (!object) return '';

    return object[name] || '';
  }

  setActiveProp(name, value) {
    var object = this.canvas.getActiveObject();
    if (!object) return;
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }

  setId() {
    let val = this.props.id;
    let complete = this.canvas.getActiveObject().toObject();
    console.log(complete);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  getFontStyle() {
    this.props.fontStyle = this.getActiveStyle('fontStyle', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    this.setActiveStyle('fontStyle', this.props.fontStyle ? 'italic' : '', null);
  }


  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, "g"), "");
    } else {
      iclass += ` ${value}`
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }


  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /*System*/


  removeSelected() {
    this.canvas.getActiveObject() == null ? this.canvas.getActiveGroup() : this.canvas.getActiveObject();
    let activeObject = this.canvas.getActiveObject();
    // let  activeGroup = this.canvas.getActiveGroup();
    if (activeObject) {
      this.canvas.remove(activeObject);
      // this.textString = '';
    }
    // else if (activeGroup) {
    //   let objectsInGroup = activeGroup.getObjects();
    //   this.canvas.discardActiveGroup();
    //   let self = this;
    //   objectsInGroup.forEach(function (object) {
    //     self.canvas.remove(object);
    //   });
    // }
  }

  confirmClear() {

    this.canvas.clear();
  }

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }

  onClickColor(selectedColor) {
    this.canvas.freeDrawingBrush.color = selectedColor;
  }//end of method

  eraser() {
    this.canvas.freeDrawingBrush.color = "#ffffff";
    this.canvas.freeDrawingBrush.width = 10;
    this.canvas.isDrawingMode = 1;
    this.canvas.hoverCursor = "pointer";
    this.canvas.renderAll();
  }

  save() {
    this.captures.push(this.canvas.toDataURL("image/png"));
    // console.log("canvas pictures::",this.captures);
    this.saveImage();//to save document
  }//end of method

  //to save canvas 
  saveDocument(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {
      // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
    //return this.apiService.UploadProfiePhoto.upload(formData);
  }
  //save image
  saveImage() {
    if (this.prescriptionDetail) {
      let prescriptionForm = this.prescriptionDetail.value;
      if (prescriptionForm.prescriptionRefNo) {
        //call the method to save drew image
        this.uploadImageByPrescriptionReferenceNo(prescriptionForm.prescriptionRefNo);
      } else {
        //call the method to generate prescription and save the drew image
        this.generatePrescription(prescriptionForm);
      }
      document.getElementById('paint').classList.add('disableLinks');
    } else {
      this.imageUploadByProcedure();
    }
  }//end of method

  //method to generate prescription
  generatePrescription(prescriptionForm) {
    let createPrescriptionBody = {
      "appointmentRefNo": prescriptionForm.appointmentRefNo,
      "doctorRefNo": prescriptionForm.doctorRefNo,
      "userRefNo": prescriptionForm.userRefNo,
      "isDraft": "Y"
    }
    let prescriptionRefNo: string;
    // console.log("createPrescriptionBody", createPrescriptionBody);
    this._doctorService.autoSavePrescription(createPrescriptionBody).subscribe(data => {
      console.log(data);
      // alert(data['data'].prescriptionPk);
      if (data['status'] == '2000') {
        //this.pk = data['data'].prescriptionPk;
        prescriptionRefNo = data['data'].prescriptionRefNo;
        this.uploadImageByPrescriptionReferenceNo(prescriptionRefNo);//call the method to upload drew image by prescription reference number          
      }//end of status check 2000
    });//end of prescription service call
  }//end of method

  //method to upload document by prescription reference number
  uploadImageByPrescriptionReferenceNo(prescriptionRefNo: string) {
    //base64 image to blob    
    var myFile: File = this.dataURItoBlob(this.captures[0]);
    //end of base64 image to blob
    let formdata = new FormData();
    let prescriptionFileUpload = JSON.stringify({
      "originalFileName": prescriptionRefNo + ".img",
      "prescriptionRefNo": prescriptionRefNo,
      "fileUploadFor": SBISConstants.IMAGE_UPLOAD_CONST.DOCTOR_PRESCRIPTION_DRAW,//"DOCTOR_PRESCRIPTION_DRAW",
      "documentType": 'image/jpg'
    });

    formdata.append('file', myFile);
    formdata.append('document', prescriptionFileUpload);
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status == 2000) {
          let canvasSuccessJson: any = {
            "prescriptionRefNo": prescriptionRefNo,
            "saved": true
          }
          this.prescriptionDetail.value.prescriptionRefNo = prescriptionRefNo;
          this.getCanvasData.emit(canvasSuccessJson);
          console.log("uploaded");
        } else {

        }
      }
    });//end of save document
  }//end of method

  //method to upload image by procedure
  imageUploadByProcedure() {
    let imagesFromCanvas: any = {
    "canvasImg" : this.captures[0]
  };
    this.getCanvasData.emit(imagesFromCanvas);
  }//end of method

  //base64 to blob
  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return <File>(new Blob([new Uint8Array(array)]));
  }//end of method


}//end of class
