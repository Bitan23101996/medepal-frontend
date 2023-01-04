import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class PayeeAccountDetailsService {

  constructor(private apiService: ApiService) { }

  getPayeeAccountDetails(query): Observable<any> {
    return this.apiService.GetPayeeAccountDetails.postByQuery(query);
  }

  deletePayeeAccountDetails(query): Observable<any> {
    return this.apiService.DeletePayeeAccountDetails.postByQuery(query);
  }

  savePayeeAccountDetails(query): Observable<any> {
    return this.apiService.SavePayeeAccountDetails.postByQuery(query);
  }

  fileDownload(query: any): Observable<any> {
    return this.apiService.FileDownload.postByQuery(query);
  }

}
