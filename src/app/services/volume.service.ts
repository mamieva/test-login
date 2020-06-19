import { Injectable } from '@angular/core';
import { HttpProxy } from './util/http.proxy';

@Injectable()
export class VolumeService {
    constructor(private http: HttpProxy) { }

    private getOfficeLogged() {
        return JSON.parse(localStorage.getItem('currentOffice')).id;
    }
    getVolume(operartorId: any) {
        return this.http.getJson(`secure/volume/${operartorId}`);
    }
    getVolumeType(operartorId: any) {
        return this.http.getJson(`secure/officeHasVolumeType/${operartorId}`);
    }
    putVolumeType(model: any) {
        return this.http.putJson(`secure/officeHasVolumeType`,model);
    }
    createVolume(model: any) {
        return this.http.postJSON(`secure/volume`, model);
    }
    updateVolume(model: any) {
        return this.http.putJson(`secure/volume/` + model.id, model);
    }
    searchVolume(model: any) {
        return this.http.getJson(`secure/volume?search=` + model);
    }
    printPdf(id: any) {
        return this.http.getJson(`secure/volume/${id}/print`);
    }
    closeVolume(model: any) {
        return this.http.putJson(`secure/volume/${model.id}/close`,model);
    }
    getVolumesTypes(){
        return this.http.getJson(`secure/volumetype`);
    }
}
