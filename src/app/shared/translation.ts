import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
    providedIn: 'root'
})
export class JsonTranslation {

    constructor(private translate: TranslateService) {}

    translateJson(jsonkey: any): string {
        let returnMsg: string = "";
        let user = JSON.parse(localStorage.getItem('user'));
        if(user && user.lang && user.lang != ''){
          this.translate.setDefaultLang(user.lang);
        }else{
          this.translate.setDefaultLang('en');
        }
        this.translate.get(jsonkey).subscribe((res: string) => {
          returnMsg = res;
        });
        return returnMsg;
      }
}