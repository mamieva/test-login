import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { isArray, isPlainObject } from 'lodash';
import { AppSettings } from '../../app.settings';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from './loading.service';
import { HttpClient, HttpClientModule, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/first';

export interface HttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

@Injectable()
export class HttpProxy extends HttpClient {
    token: any;
    tokenInfo: any;
    officeChange: any;

    constructor(
        private loadingService: LoadingService,
        private router: Router,
        handler: HttpHandler
    ) {
        super(handler);
        if (!this.officeChange) {
            this.officeChange = JSON.parse(localStorage.getItem('currentOffice')) ? JSON.parse(localStorage.getItem('currentOffice')).id : null;

        }
        // else if (this.officeChange != this.getOfficeLogged()) {
        //     location.reload();
        // }
        this.token = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')).authToken.token : null;
    }
    //
    private getOfficeLogged() {
        // debugger
        // if (this.officeChange != JSON.parse(localStorage.getItem('currentOffice')).id) {
        //     location.reload();
        // }
        return JSON.parse(localStorage.getItem('currentOffice')).id;
    }
    private checkChangeOffice() {
        if (this.officeChange != JSON.parse(localStorage.getItem('currentOffice')).id) {
            this.router.navigateByUrl('');
            location.reload();
        }
    }

    /**    --------------------------------
     *          Standard HTTP requests
     *     --------------------------------
     */
    public getJson<T>(uri: string, options?: any): Observable<T> {
        this.checkChangeOffice();
        this.loadingService.enableShowSpinner();
        if (!options || (!options.secure && !options.office)) {
            let url = uri.replace('secure/', `secure/office/${this.getOfficeLogged()}/`)
            return super.get<T>(this.getUrl(url), <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                this.loadingService.disableShowSpinner();
            })
        }
        else if (options) {
            if (options.office) {
                return super.get<T>(this.getUrl(uri), <HttpOptions>this.getOptions()).finally(() => {
                    this.loadingService.disableShowSpinner();
                })
            }
            else if (options.secure) {
                return super.get<T>(this.getUrl(uri), <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                    this.loadingService.disableShowSpinner();
                })
            }
        }
    }
    public get<T>(uri: string, options?: any): Observable<T> {
        this.checkChangeOffice();
        this.loadingService.enableShowSpinner();
        if (!options || (!options.secure && !options.office)) {
            let url = uri.replace('secure/', `secure/office/${this.getOfficeLogged()}/`)
            return super.get<T>(this.getUrl(url), <HttpOptions>this.getOptionsNotSecureNotJSON()).finally(() => {
                this.loadingService.disableShowSpinner();
            })
        }
        else if (options) {
            if (options.office) {
                return super.get<T>(this.getUrl(uri), <HttpOptions>this.getOptionsNotJSON()).finally(() => {
                    this.loadingService.disableShowSpinner();
                })
            }
            else if (options.secure) {
                return super.get<T>(this.getUrl(uri), <HttpOptions>this.getOptionsNotSecureNotJSON()).finally(() => {
                    this.loadingService.disableShowSpinner();
                })
            }
        }
    }

    public postJSON<T>(uri: string, data: Object, options?: any): Observable<T> {
        this.checkChangeOffice();
        this.loadingService.enableShowSpinner();
        if (!options || (!options.secure && !options.office)) {
            let url = uri.replace('secure/', `secure/office/${this.getOfficeLogged()}/`)
            return super.post<T>(this.getUrl(url), data, <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                this.loadingService.disableShowSpinner();
            });

        }
        else if (options) {
            if (options.office) {
                return super.post<T>(this.getUrl(uri), data, <HttpOptions>this.getOptions()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
            else if (options.secure) {
                return super.post<T>(this.getUrl(uri), data, <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
        }
    }

    public putJson<T>(uri: string, data: Object, options?: any): Observable<T> {
        this.checkChangeOffice();
        this.loadingService.enableShowSpinner();
        if (!options || (!options.secure && !options.office)) {
            let url = uri.replace('secure/', `secure/office/${this.getOfficeLogged()}/`)
            return super.put<T>(this.getUrl(url), data, <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                this.loadingService.disableShowSpinner();
            });
        }
        else if (options) {
            if (options.office) {
                return super.put<T>(this.getUrl(uri), data, <HttpOptions>this.getOptions()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
            else if (options.secure) {
                return super.put<T>(this.getUrl(uri), data, <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
        }
    }

    public patchJson<T>(uri: string, data: any, options?: any): Observable<T> {
        this.checkChangeOffice();
        this.loadingService.enableShowSpinner();
        if (!options || (!options.secure && !options.office)) {
            let url = uri.replace('secure/', `secure/office/${this.getOfficeLogged()}/`)
            return super.patch<T>(this.getUrl(url), data, <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                this.loadingService.disableShowSpinner();
            });
        }
        else if (options) {
            if (options.office) {
                return super.patch<T>(this.getUrl(uri), data, <HttpOptions>this.getOptions()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
            else if (options.secure) {
                return super.patch<T>(this.getUrl(uri), data, <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
        }
    }

    public headJson<T>(uri: string, options?: any): Observable<T> {
        this.checkChangeOffice();
        this.loadingService.enableShowSpinner();
        if (!options || (!options.secure && !options.office)) {
            let url = uri.replace('secure/', `secure/office/${this.getOfficeLogged()}/`)
            return super.head<T>(this.getUrl(url), <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                this.loadingService.disableShowSpinner();
            });

        }
        else if (options) {
            if (options.office) {
                return super.head<T>(this.getUrl(uri), <HttpOptions>this.getOptions()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
            else if (options.secure) {
                return super.head<T>(this.getUrl(uri), <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
        }
    }

    public deleteJson<T>(uri: string, options?: any): Observable<T> {
        this.checkChangeOffice();
        this.loadingService.enableShowSpinner();
        if (!options || (!options.secure && !options.office)) {
            let url = uri.replace('secure/', `secure/office/${this.getOfficeLogged()}/`)
            return super.delete<T>(this.getUrl(url), <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                this.loadingService.disableShowSpinner();
            });

        }
        else if (options) {
            if (options.office) {
                return super.delete<T>(this.getUrl(uri), <HttpOptions>this.getOptions()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
            else if (options.secure) {
                return super.delete<T>(this.getUrl(uri), <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
        }
    }

    public optionsJson<T>(uri: string, options?: any): Observable<T> {
        this.checkChangeOffice();
        this.loadingService.enableShowSpinner();
        if (!options || (!options.secure && !options.office)) {

            let url = uri.replace('secure/', `secure/office/${this.getOfficeLogged()}/`)
            return super.options<T>(this.getUrl(url), <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                this.loadingService.disableShowSpinner();
            });

        }
        else if (options) {
            if (options.office) {

                return super.options<T>(this.getUrl(uri), <HttpOptions>this.getOptions()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
            else if (options.secure) {
                return super.options<T>(this.getUrl(uri), <HttpOptions>this.getOptionsNotSecure()).finally(() => {
                    this.loadingService.disableShowSpinner();
                });
            }
        }
    }

    /**    --------------------------------
     *          Custom HTTP requests
     *     --------------------------------
     */

    /**
     * Submit the token form and recover the auth
     *
     * @returns {Observable<UserInterface.User>}
     */
    public login(data?) {
        // -->Set: headers
        // let data: any;
        // let params = new HttpParams();
        // let params ;
        // params = params.append('username', data.username);
        // params = params.append('password', data.password);
        // params = params.append('userName', '1M');
        // params = params.append('password', '1234');
        let params = JSON.stringify({ "userName": data.user, "password": data.password });

        let headers = new HttpHeaders();
        // headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Cache-Control', 'no-cache');
        headers = headers.append('X-Requested-With', 'XMLHttpRequest');
        headers = headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        headers = headers.append('Access-Control-Allow-Origin', '*');

        const options = {
            headers: headers,
            params: {},
            observe: 'body',
            reportProgress: true,
            responseType: 'json',
            withCredentials: false,
        };

        return super.post(
            AppSettings.API_ENDPOINT + 'token/login',
            params,
            <HttpOptions>options
        )
            .map(token => {
                // -->Set: token
                this.token = token;

                // -->Is: ok?
                this.tokenInfo = {
                    hasToken: true
                };

                // -->Return: token
                return token;
            });
    }

    public refreshToken() {
        // let params = JSON.stringify({ "userName": data.user, "password": data.password });

        let headers = new HttpHeaders();
        // headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let refreshToken = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser'))[0].refreshToken.token : null;

        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Cache-Control', 'no-cache');
        headers = headers.append('X-Requested-With', 'XMLHttpRequest');
        headers = headers.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        headers = headers.append('Access-Control-Allow-Origin', '*');
        headers = headers.append('X-Authorization', refreshToken);

        const options = {
            headers: headers,
            params: {},
            observe: 'body',
            reportProgress: true,
            responseType: 'json',
            withCredentials: false,
        };

        return super.post(
            AppSettings.API_ENDPOINT + 'token/refresh/',
            <HttpOptions>options
        )
            .map(token => {
                // -->Set: token
                this.token = token;

                // -->Is: ok?
                this.tokenInfo = {
                    hasToken: true
                };

                // -->Return: token
                return token;
            });

    }

    /**
     * Prepare request url
     *
     * @param {string} uri
     * @returns {string}
     */
    private getUrl(uri: string): string {
        if (uri.indexOf('http://') == 0 || uri.indexOf('https://') == 0)
            return uri

        else
            return AppSettings.API_ENDPOINT + uri;
    }

    /**
     * Get the HTTP options for the requests
     *
     * @returns {HttpOptions}
     */
    private getOptions(data?) {
        let headers = new HttpHeaders();
        headers = headers.append('X-Authorization', `Bearer ${this.token}`);

        const options = {
            headers: headers,
            observe: 'body',
            params: (data) ? new HttpParams({
                fromObject: data
            }) : new HttpParams(),
            reportProgress: true,
            responseType: 'json',
            withCredentials: false
        };

        return options;
    }
    private getOptionsNotJSON(data?) {
        let headers = new HttpHeaders();
        headers = headers.append('X-Authorization', `Bearer ${this.token}`);

        const options = {
            headers: headers,
            observe: 'body',
            params: (data) ? new HttpParams({
                fromObject: data
            }) : new HttpParams(),
            reportProgress: true,
            responseType: 'html',
            withCredentials: false
        };

        return options;
    }
    private getOptionsNotSecureNotJSON(data?) {
        let headers = new HttpHeaders();
        // headers = headers.append('X-Authorization', `Bearer ${this.token}`);
        const options = {
            headers: headers,
            observe: 'body',
            params: (data) ? new HttpParams({
                fromObject: data
            }) : new HttpParams(),
            reportProgress: true,
            responseType: 'html',
            withCredentials: false
        };
        return options;
    }
    private getOptionsNotSecure(data?) {
        let headers = new HttpHeaders();
        // headers = headers.append('X-Authorization', `Bearer ${this.token}`);
        const options = {
            headers: headers,
            observe: 'body',
            params: (data) ? new HttpParams({
                fromObject: data
            }) : new HttpParams(),
            reportProgress: true,
            responseType: 'json',
            withCredentials: false
        };
        return options;
    }
}