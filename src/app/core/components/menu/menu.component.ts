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
import { Component, OnInit,Input } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { MenuItemContent } from 'primeng/menu';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  menus:any;
   menuItems: MenuItem[] = [];
   subMenuLevel1: any;
   subMenuLevel2: any;
   subMenuItemLevel1: MenuItem[] = [];
   subMenuItemLevel2: MenuItem[] = [];


  @Input() roleName = 'Doctor';
  constructor( private apiService: ApiService) { }

  ngOnInit() {
    let menus =this.getMenus();
  }
  firstLabelMenu:any;
  fisrtLabelMenuforFirst:any;
  getMenus()
  {
      this.apiService.GetMenus.getByPath(this.roleName).subscribe(
        res => {
          //console.log(res)
          this.menus = res;
          for (let i = 0 ; i < this.menus.length; i++)
          {
            let mi0: MenuItem = {};
            mi0.label = this.menus[i].menuLabel;
            

            this.subMenuLevel1 = this.menus[i].subMenus;
            this.subMenuItemLevel1 = [];
            for (let j = 0 ; j < this.subMenuLevel1.length; j++)
            {
              let mi1: MenuItem = {};
              mi1.label = this.subMenuLevel1[j].menuLabel;

              this.subMenuLevel2 = this.subMenuLevel1[j].subMenus;
              this.subMenuItemLevel2 = [];
              if(this.subMenuLevel2.length == 0)
              {
                this.subMenuItemLevel2 = null;
              }
              for (let k = 0 ; k < this.subMenuLevel2.length; k++) {
                let mi2: MenuItem = {};
                mi2.label = this.subMenuLevel2[k].menuLabel;
                this.subMenuItemLevel2.push(mi2);
                mi2.routerLink = [this.subMenuLevel2[k].urlPath];
              }
              mi1.items = this.subMenuItemLevel2;
              this.subMenuItemLevel1.push(mi1);
            }
            mi0.items = this.subMenuItemLevel1;
            this.menuItems.push(mi0);
          }
          
        
          this.menus = [];
          this.menus = res;
          console.log(this.menus);
        }
      );
      
  }

}
