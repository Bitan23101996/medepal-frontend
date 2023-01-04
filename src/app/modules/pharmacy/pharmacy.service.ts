import { Injectable } from '@angular/core';
import { ApiService } from './../../core/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getDocumentByRole(provider: any) : Observable<any> {
    return this.apiService.GetDocumentByRole.getByPath(provider);
  }

  getUser(userId: any) : Observable<any> {
    return this.apiService.ProviderUser.getByPath(userId);
  }

// Removed unused method saveFiles(total_form) - app#1214

  saveDocument(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
     // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
    //return this.apiService.UploadProfiePhoto.upload(formData);
  }

}
