import { Injectable } from '@angular/core';

import { HttpProxy } from './util/http.proxy';

@Injectable()
export class PersonService {
    constructor(
        private http: HttpProxy
    ) { }

    getPersonByDocumentSex(dni: any, sex: any) {
        return this.http.getJson(`secure/person/data/${dni}/${sex}`, { office: true });
    }
    getPersonByDocumentSexReconocimiento(dni: any, sex: any) {
        return this.http.getJson(`secure/person/data/${dni}/${sex}?procedureOrigin=RECONOCIMIENTO`, { office: true });
    }
    postPerson(person: any) {
        return this.http.postJSON(`secure/person/`, person, { office: true });
    }
    putPerson(personId: any, person: any) {
        return this.http.putJson(`secure/person/${personId}`, person, { office: true });
    }
}
