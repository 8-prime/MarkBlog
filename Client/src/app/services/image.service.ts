import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { fromEventPattern } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  baseUrl: string = environment.IMAGE_API;

  constructor(private http: HttpClient) { }


  saveImage(imageFile: any){
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return this.http.post<any>(`${this.baseUrl}/save`, formData);
  }
}
