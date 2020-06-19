import { Injectable } from '@angular/core';

import { HttpProxy } from './util/http.proxy';

@Injectable()
export class StateService {
    constructor(
        private http: HttpProxy
    ) { }

    getCountries() {
        return this.http.getJson('/secure/countries', { office: true });
    }
    getStatesByCountry(countryId: any) {
        return this.http.getJson(`secure/statesbycountry/${countryId}`, { office: true })
    }
    getDepartamentsByState(stateId: any) {
        return this.http.getJson(`secure/departamentsbystate/${stateId}`, { office: true })
    }
    getCitiesByState(departamentId: any) {
        return this.http.getJson(`secure/citiesbydepartament/${departamentId}`, { office: true })
    }
}