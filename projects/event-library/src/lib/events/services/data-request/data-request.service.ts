import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ServerResponse, RequestParam, HttpOptions } from '../../interfaces';
import * as _ from 'lodash-es';
// import { UUID } from 'angular2-uuid';
import { UserConfigService } from '../userConfig/user-config.service';
// import dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  /**
     * Contains base Url for api end points
     */
  // baseUrl = this.userConfigService.getConfigUrl().host;
  // appVersion: string;
  constructor(
    private userConfigService: UserConfigService,
    private http: HttpClient) {
      // this.http = http;
      // const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
      // this.appVersion = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
   
  }
 
  /**
 * for preparing headers
 */
  private getHeader(headers?: HttpOptions['headers']): HttpOptions['headers'] {
    // const _uuid = UUID.UUID();
    if (headers)
    {
      return headers;
    }
    else
    {
      const default_headers = {
        Accept: 'application/json',
        // Authorization: 'Bearer key',
        // 'Accept': 'application/json',
        // 'X-Consumer-ID': 'X-Consumer-ID',
        // 'X-Source': 'web',
        // 'ts': dayjs().format(),
        // 'X-msgid': _uuid,
        // 'X-Request-ID': _uuid,
        // 'X-App-Version': this.appVersion,
        // 'X-Session-ID': DataService.sessionId
      };

      return default_headers;
    }


    
  }

  /**
 * for making post api calls
 * @param RequestParam requestParam interface
 */
  post(requestParam: RequestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.post(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: any) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }


  /**
 * for making get api calls
 *
 * @param requestParam interface
 */
  get(requestParam: RequestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? requestParam.header : this.getHeader(),
      params: requestParam.param
    };
    return this.http.get(requestParam.url, httpOptions).pipe(
      mergeMap((data: any) => {

        return observableOf(data);
      }));
  }

  /**
* for making post api calls
* @param RequestParam requestParam interface
*/
  patch(requestParam: RequestParam): Observable<any> {
    const httpOptions: HttpOptions = {
      headers: requestParam.header ? this.getHeader(requestParam.header) : this.getHeader(),
      params: requestParam.param
    };
    return this.http.patch(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: any) => {
        if (data.responseCode !== 'OK') {
          return observableThrowError(data);
        }
        return observableOf(data);
      }));
  }

}


