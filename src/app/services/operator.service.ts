import { Injectable } from '@angular/core';
import { HttpProxy } from './util/http.proxy';

@Injectable()
export class OperatorService {
    constructor(private http: HttpProxy) { }

    private getOfficeLogged() {
        return JSON.parse(localStorage.getItem('currentOffice')).id;
    }
    getOperator(operatorId: any) {
        return this.http.getJson(`secure/operator/${operatorId}`);
    }
    createOperator(model: any) {
        return this.http.postJSON(`secure/operator`, model);
    }
    updateOperator(model: any) {
        return this.http.putJson(`secure/operator/` + model.id, model);
    }
    searchOperator(model: any) {
        return this.http.getJson(`secure/operator?search=` + model);
    }
    getTask(operatorId: any) {
        return this.http.getJson(`secure/operator/${operatorId}/tasks`);
    }
    postTask(operatorId: any, taskId: any) {
        return this.http.postJSON(`secure/operator/${operatorId}/task/${taskId}`, {});
    }
    deleteTask(operatorId: any, taskId: any) {
        return this.http.deleteJson(`secure/operator/${operatorId}/task/${taskId}`);
    }
    activeOperator(operatorId: any, value: any) {
        if (value) {
            return this.http.putJson(`secure/operator/${operatorId}/enable`, {});
        } else {
            return this.http.putJson(`secure/operator/${operatorId}/disable`, {});
        }
    }
    deleteOperator(operatorId: any) {
        return this.http.deleteJson(`secure/operator/${operatorId}`);
    }
}
