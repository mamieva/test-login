import { Injectable } from '@angular/core';

import { HttpProxy } from './util/http.proxy';

@Injectable()
export class ConfigurationService {
    constructor(
        private http: HttpProxy
    ) { }

    private getOfficeLogged() {
        return JSON.parse(localStorage.getItem('currentOffice')).id;
    }
    getMarginTypes() {
        return this.http.getJson('secure/marginType');
    }
    getMarginType(id: any) {
        return this.http.getJson(`secure/marginType/${id}`);
    }
    getVolumes(volumeTypeId: any, statusVolume: any, yearVolume: any, numberVolume: any,numberBook:any) {
        return this.http.getJson(`secure/volume/search?certificateTypeId=${volumeTypeId}&statusVolume=${statusVolume}&yearVolume=${yearVolume}&numberVolume=${numberVolume}&numberBook=${numberBook}`);
    }
    getVolumesSearch(search:any) {
        return this.http.getJson(`secure/volume/${search}`);
    }
    getVolumesInbox() {
        return this.http.getJson(`secure/volume/inbox`);
    }
    putMarginType(id: any, model: any) {
        return this.http.postJSON(`secure/marginType/${id}/version`, model);
    }
    getPreview(id: any) {
        return this.http.getJson(`secure/marginType/${id}/preview`);
    }
    getVolumeConfig() {
        return this.http.getJson(`secure/officeHasVolumeType`);
    }
}
