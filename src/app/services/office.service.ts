import { Injectable } from '@angular/core';

import { HttpProxy } from './util/http.proxy';

@Injectable()
export class OfficeService {
    constructor(
        private http: HttpProxy
    ) { }

    getOffices() {
        return this.http.getJson('secure/office', { office: true });
    }
    getOffice(officeId: any) {
        return this.http.getJson('secure/office/' + officeId, { office: true })
    }
}