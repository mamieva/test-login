import { Injectable } from '@angular/core';

import { HttpProxy } from './util/http.proxy';

@Injectable()
export class ProcedureService {
    constructor(
        private http: HttpProxy
    ) { }

    postProcedure(procedure: any) {
        return this.http.postJSON('secure/procedure', procedure);
    }
    postProcedureOpposition(procedureId: any, procedure: any) {
        return this.http.postJSON(`secure/procedure/${procedureId}/opposition`, procedure);
    }
    postProcedureMargin(procedure: any) {
        return this.http.postJSON('secure/procedureWithMargin', procedure);
    }
    putProcedure(procedure_id: any, procedure: any) {
        return this.http.putJson(`secure/procedure/${procedure_id}`, procedure);
    }
    putProcedureOpposition(procedure_id: any, procedure: any, oppositionId: any) {
        return this.http.putJson(`secure/procedure/${procedure_id}/opposition/${oppositionId}`, procedure);
    }
    putActorType(procedure_id: any, actorType: any) {
        return this.http.putJson(`secure/procedure/${procedure_id}/actorType`, actorType);
    }
    getProcedure(procedure_id: any) {
        return this.http.getJson(`secure/procedure/${procedure_id}`);
    }
    getProcedureOpposition(procedure_id: any, oppositionId) {
        return this.http.getJson(`secure/procedure/${procedure_id}/opposition/${oppositionId}`);
    }
    getValidationPDF(procedure_id: any) {
        return this.http.getJson(`secure/procedure/${procedure_id}/print`);
    }
    getRequestMarriedPDF(procedure_id: any) {
        return this.http.getJson(`secure/procedure/${procedure_id}/print/marriageRequest`);
    }
    getValidationPDFMargin(procedure_id: any) {
        return this.http.getJson(`secure/procedure/${procedure_id}/margin/print/preview`);
    }
    getCertificatePDFMargin(procedure_id: any) {
        return this.http.getJson(`secure/procedure/${procedure_id}/margin/print`);
    }
    getCertificatePDF(procedure_id: any) {
        return this.http.getJson(`secure/procedure/${procedure_id}/certificate/print`);
    }
    getCertificateOpoPDF(procedure_id: any, oppositionId: any) {
        return this.http.getJson(`secure/procedure/${procedure_id}/opposition/${oppositionId}/print`);
    }
    postCertificate(procedureId: any, procedure: any) {
        return this.http.postJSON(`secure/procedure/${procedureId}/certificate`, procedure);
    }
    postCertificateProcedure(procedureId: any, procedureTaskId: any, procedure: any) {
        return this.http.postJSON(`secure/procedure/${procedureId}/task/${procedureTaskId}/finished`, procedure);
    }
    uploadCertificate(file: any) {
        return this.http.postJSON(`secure/files/upload/encode`, file);
    }
    cancelMargin(procedureId: any, marginId: any) {
        return this.http.deleteJson(`secure/procedure/${procedureId}/margin/${marginId}`);
    }
    uploadAttachmentProcedure(file: any) {
        return this.http.postJSON(`secure/files/attachment/upload/encode`, file);
    }
    uploadAttachmentProcedureOpposition(file: any) {
        return this.http.postJSON(`secure/files/opposition/attachment/upload/encode`, file);
    }
    uploadAttachmentProcedureFile(file: any) {
        return this.http.postJSON(`secure/files/attachment/upload`, file);
    }
    uploadAttachmentProcedureFileOpposition(file: any) {
        return this.http.postJSON(`secure/files/opposition/attachment/upload`, file);
    }
    postInProcess(procedureId: any, procedureTaskId: any, procedure: any) {
        return this.http.postJSON(`secure/procedure/${procedureId}/task/${procedureTaskId}/inProcess`, procedure);
    }
    takeProcedure(procedureId: any, procedure: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/take`, procedure);
    }
    freeProcedure(procedureId: any, procedure: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/free`, procedure);
    }
    rejectTask(procedureId: any, procedureTaskId: any, task: any) {
        return this.http.postJSON(`secure/procedure/${procedureId}/task/${procedureTaskId}/reject`, task);
    }
    getProcedureByPerson(doc_number: any, sex: any) {
        return this.http.getJson(`secure/procedure/docnumberandsex/search?doc_number=${doc_number}&sex=${sex}`);
    }
    getDocument(documentId: any) {
        return this.http.getJson(`secure/files/download/document/${documentId}`);
    }
    getDocumentDownload(procedureId: any, documentId: any) {
        return this.http.get(`secure/procedure/${procedureId}/document/${documentId}/attachment/download/file`);
    }
    anularTrm(procedureId: any, model: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/invalidate`, model);
    }
    rechazarOpposition(procedureId: any, oppositionId: any, model: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/opposition/${oppositionId}/reject`, model);
    }
    desestimarOpposition(procedureId: any, oppositionId: any, model: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/opposition/${oppositionId}/disesteem`, model);
    }
    aprobarOpposition(procedureId: any, oppositionId: any, model: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/opposition/${oppositionId}/approve`, model);
    }
    suspendTrm(procedureId: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/suspend`, {});
    }
    approveActa(certificateId: any, certificate: any) {
        return this.http.putJson(`secure/certificate/${certificateId}/preApprove`, certificate)
    }
    approveMarginal(procedureId: any, marginId: any, margin: any) {
        return this.http.putJson(`secure/procedure/${procedureId}/margin/${marginId}/preApproved`, margin)
    }
    blockedActa(certificateId: any, certificate: any) {
        return this.http.putJson(`secure/certificate/${certificateId}/block`, certificate)
    }
    getDocumentsByProcedure(procedureId: any) {
        return this.http.getJson(`secure/procedure/${procedureId}/document`);
    }
    getDocumentTypeByProcedure(procedureId: any) {
        return this.http.getJson(`secure/procedure/${procedureId}/documentType`, { office: true });
    }
    getDocumentTypeByProcedureOpposition(procedureId: any, oppositionId: any) {
        return this.http.getJson(`secure/procedure/${procedureId}/opposition/${oppositionId}/documentType`);
    }
    deleteFiles(documentId: any) {
        return this.http.deleteJson(`secure/document/${documentId}/delete`)
    }
    generateCertificateNegative(model: any) {
        return this.http.postJSON(`secure/document/certificateNegative`, model, { office: true });
    }
    putProcedureFromRequest(model: any) {
        return this.http.putJson(`secure/procedure/${model.id}/procedureFromRequest`, model)
    }
    getDocumentMargin(procedureId: any) {
        return this.http.getJson(`secure/procedure/${procedureId}/margin/print`);
    }
    getAttributesProcedure(procedureId: any) {
        return this.http.getJson(`secure/procedure/${procedureId}/attributes`);
    }
    getAttributesProcedureByCode(code: any) {
        return this.http.getJson(`secure/procedureType/${code}/attributes`);
    }
    getAttributesOpposition(procedureId: any, oppositionId: any) {
        return this.http.getJson(`secure/procedure/${procedureId}/opposition/${oppositionId}/attributes`);
    }
    verificateSignOperator(operatorId: any, csn: any) {
        return this.http.postJSON(`secure/operator/${operatorId}/csn/${csn}`, {});
    }
}