import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from "./const"



@Injectable()
export class AppService {

  results: any;

  constructor(private http: HttpClient){

  }

  getData(){
    return new Promise((resolve, reject) => {
      this.http.get(API_URL).subscribe(
        data => {
          resolve(data);
        },
        error => {
          reject(error);
        }
      );
    })
  }

}
