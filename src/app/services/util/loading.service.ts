import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService {
    private showSpinner: boolean = true;

    constructor() {
    }

    mustShowSpinner() {
        return this.showSpinner;
    }

    public enableShowSpinner() {
        this.showSpinner = true;
    }

    public disableShowSpinner() {
        this.showSpinner = false;
    }
}