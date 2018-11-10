
import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }

    /*
    getFeedbacks(): Observable<Feedback[]> {
      return this.http.get<Feedback[]>(baseURL + 'feedback')
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }

    getFeedback(id: String): Observable<Feedback> {
      return this.http.get<Feedback>(baseURL + 'feedback/' + id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }
    */

    postFeedback(feedback: Feedback): Observable<Feedback> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };

      console.log(feedback);
      return this.http.post<Feedback>(baseURL + 'feedback', feedback, httpOptions).pipe(catchError(this.processHTTPMsgService.handleError));
    }

   
}
