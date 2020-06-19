import { Injectable } from '@angular/core';

import { HttpProxy } from './util/http.proxy';

@Injectable()
export class MarginalsService {
    constructor(
        private http: HttpProxy
    ) { }

    private getOfficeLogged() {
        return JSON.parse(localStorage.getItem('currentOffice')).id;
    }
    getMarginAttributes(procedureId: any, marginId: any) {
        return this.http.getJson(`secure/procedure/${procedureId}/margin/${marginId}/attributes`);
    }
    putMarginAttributes(procedureId: any, marginId: any, model: any) {
        return this.http.postJSON(`secure/procedure/${procedureId}/margin/${marginId}/attributes`, model);
    }
    postMarginProcedure(procedureId: any, model: any) {
        return this.http.postJSON(`secure/procedure/${procedureId}/margin`, model);
    }
    putMarginProcedure(procedureId: any, marginId: any, model: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/margin/${marginId}`, model);
    }
    getActorTypesMargin(procedureId: any, marginId: any) {
        return this.http.getJson(`secure/procedure/${procedureId}/margin/${marginId}/actorTypeToMargin`);
    }
    putActorTypesMargin(procedureId: any, marginId: any, model: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/margin/${marginId}/actorType`, model);
    }
    deleteActorType(procedureId:any,marginId:any,actorTypeCode:any,relationShipCode:any){
        return this.http.deleteJson(`secure/procedure/${procedureId}/margin/${marginId}/actorType?actorTypeCode=${actorTypeCode}&relationShipCode=${relationShipCode}`)
    }
}