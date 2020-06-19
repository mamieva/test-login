import { Injectable } from '@angular/core';

import { HttpProxy } from './util/http.proxy';

@Injectable()
export class lookupService {
    constructor(
        private http: HttpProxy
    ) { }

    private getOfficeLogged() {
        return JSON.parse(localStorage.getItem('currentOffice')).id;
    }
    getDocumentType() {
        return this.http.getJson('secure/lookup/documentType', { office: true });
    }
    getRelationship() {
        return this.http.getJson('secure/lookup/relationship', { office: true });
    }
    getRelationshipAdoption() {
        return this.http.getJson('secure/lookup/relationship/adoption', { office: true });
    }
    getRelationshipOpponents() {
        return this.http.getJson('secure/lookup/relationship/opponents', { office: true });
    }
    getModules(officeId: any) {
        return this.http.getJson(`secure/office/${officeId}/modules`, { office: true });
    }
    getCivilStatus() {
        return this.http.getJson(`secure/lookup/civilStatus`, { office: true });
    }
    getAgeType() {
        return this.http.getJson(`secure/lookup/ageType`, { office: true });
    }
    getCertificateTypesAll() {
        return this.http.getJson(`secure/certificatetype`);
    }
    getCertificateTypes(officeId: any) {
        return this.http.getJson(`secure/certificateType`);
    }
    getActorTypesByProcedureType(procedureTypeCode: any) {
        return this.http.getJson(`secure/proceduretype/${procedureTypeCode}/actorTypes`);
    }
    getActorTypesByCertificateType(certificateType: any) {
        return this.http.getJson(`secure/certificate/${certificateType}/actorTypes`, { office: true });
    }
    getOperatorsSign() {
        return this.http.getJson(`secure/civilRegistration/` + this.getOfficeLogged() + `/operator/sign?search=`, { office: true });
    }
    getCertificateById(certificateId: any) {
        return this.http.getJson(`secure/certificate/${certificateId}`);
    }
    getProcedureById(procedureId: any) {
        return this.http.getJson(`secure/procedure/${procedureId}`);
    }
    getProcedureTypes() {
        return this.http.getJson(`secure/proceduretype`);
    }
    getOffices() {
        return this.http.getJson(`secure/offices`, { office: true });
    }
    getAdoptionTypes() {
        return this.http.getJson(`secure/lookup/adoptionType`, { office: true });
    }
    getOppositionMotives() {
        return this.http.getJson(`secure/lookup/opposition/motives`, { office: true });
    }
    getProcedureStatus() {
        return this.http.getJson(`secure/lookup/procedureStatus`, { office: true });
    }
    getOfficeLoggedInfo() {
        return this.http.getJson(`secure/`);
    }
    getAttachmentType(procedureTypeCode: any) {
        return this.http.getJson(`secure/procedureType/${procedureTypeCode}/documentType`, { office: true });
    }
    getDocumentsByCertificate(certificateId: any) {
        return this.http.getJson(`secure/certificate/${certificateId}/document/approved/download`);
    }
    getDocumentsByCertificateBlocked(certificateId: any) {
        return this.http.getJson(`secure/certificate/${certificateId}/document/blocked/download`);
    }
    
}