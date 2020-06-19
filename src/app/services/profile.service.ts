import { Injectable } from '@angular/core';
import { HttpProxy } from './util/http.proxy';

@Injectable()
export class ProfileService {
    constructor(private http: HttpProxy) { }
    
    private getOfficeLogged() {
        return JSON.parse(localStorage.getItem('currentOffice')).id;
    }
    getProfile(profileId: any) {
        return this.http.getJson(`secure/profile/${profileId}`);
    }
    createProfile(model: any) {
        return this.http.postJSON(`secure/profile`, model);
    }
    updateProfile(model: any) {
        return this.http.putJson(`secure/profile/` + model.id, model);
    }
    searchProfile(model: any) {
        return this.http.getJson(`secure/profiles?search=` + model);
    }
    searchActiveProfile() {
        return this.http.getJson(`secure/profiles?search=&typeSearch=onlyActive`);
    }
    getRoles() {
        return this.http.getJson(`secure/roles`);
    }
    postRol(profile: any, rolId: any) {
        return this.http.postJSON(`secure/profile/` + profile.id + `/rol/` + rolId, profile);
    }
    deleteRol(profile: any, rolId: any) {
        return this.http.deleteJson(`secure/profile/` + profile.id + `/rol/` + rolId);
    }
    activeProfile(profile: any) {
        return this.http.putJson('secure/profile/' + profile.id + '/active', {});
    }
    deleteProfile(profileId: any): any {
        return this.http.deleteJson(`secure/profile/${profileId}`);
    }
}
