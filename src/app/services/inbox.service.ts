import { Injectable } from '@angular/core';

import { HttpProxy } from './util/http.proxy';

@Injectable()
export class InboxService {
    currentOffice: any;
    constructor(
        private http: HttpProxy
    ) {
        this.currentOffice = JSON.parse(localStorage.getItem('currentOffice')).id;
    }

    searchCertificateByPerson(doc_number: any, sex: any) {
        return this.http.getJson(`secure/certificate/search?docNumber=${doc_number}&sex=${sex}`);
    }
    searchCertificateMarginByPerson(doc_number: any, sex: any) {
        return this.http.getJson(`secure/certificate/searchToMargin?docNumber=${doc_number}&sex=${sex}`);
    }
    searchCertificateByActa(certificateNumber: any, year: any, officeId: any, certificateTypeCode: any) {
        return this.http.getJson(`secure/certificate/search?certificateNumber=${certificateNumber}&year=${year}&officeId=${officeId}&certificateTypeCode=${certificateTypeCode}`);
    }
    searchCertificateMarginByActa(certificateNumber: any, year: any, officeId: any, certificateTypeCode: any) {
        return this.http.getJson(`secure/certificate/searchToMargin?certificateNumber=${certificateNumber}&year=${year}&officeId=${officeId}&certificateTypeCode=${certificateTypeCode}`);
    }
    getCertificateById(certificateId: any) {
        return this.http.getJson(`secure/certificate/${certificateId}`);
    }
    rejectCertificate(certificateId: any) {
        return this.http.putJson(`secure/certificate/migrate/${certificateId}/reject`, null);
    }
    getProceduresByOperator() {
        return this.http.getJson(`secure/inbox`);
    }
    goToPage(link: any) {
        return this.http.getJson(link, { office: true });
    }
    getProcedureByPerson(doc_number: any, sex: any) {
        return this.http.getJson(`secure/procedure/searchByDocNumber?doc_number=${doc_number}&sex=${sex}`);
    }
    getProcedureFilter(dateFrom: any, dateTo: any, sectionCode: any, procedureTypeCode: any, taskId: any, taskStatusId: any, requestOriginCode: any, procedureStatus: any) {
        return this.http.getJson(`secure/procedure/search?dateFrom=${dateFrom}&dateTo=${dateTo}&sectionCode=${sectionCode}&procedureTypeCode=${procedureTypeCode}&status=${procedureStatus}&taskId=${taskId}&taskStatusId=${taskStatusId}&requestOriginCode=${requestOriginCode}`);
    }
    getProceduresSearch(stringSearch: any) {
        return this.http.getJson(`secure/procedure/${stringSearch}`);
    }
}