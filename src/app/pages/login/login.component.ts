import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ISubscription } from "rxjs/Subscription";
// import { AuthenticationService } from '../../services/authentication.service';
import { LoadingService } from '../../services/util/loading.service';
import { HttpProxy } from '../../services/util/http.proxy';
import { WebsocketService } from '../../services/util/websocket.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';


declare var $: any;
declare const swal: any;

declare var require: any;

const { version: appVersion } = require('../../../../package.json');

import { AppService } from '../../services/app.service';

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html',
    styleUrls: ['./pages.component.css']
})

export class LoginComponent implements OnInit {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    private model: any = {};
    public withoutCIPE: boolean = false;
    public title: string = "Inserte su CIPE";
    private subscription: ISubscription;
    lastSent: number;
    readingCIPE: boolean = false;
    timer: any;
    appVersion: string;
    apiVersion: string;

    constructor(
        private element: ElementRef,
        // private authenticationService: AuthenticationService,
        private http: HttpProxy,
        private router: Router,
        private loadingService: LoadingService,
        private ws: WebsocketService,
        private appService: AppService,
        public snackBar: MatSnackBar
    ) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        let cipe: any = localStorage.getItem('cipe');
        this.withoutCIPE = (cipe && !cipe.cipe);
        // if (!this.withoutCIPE) {
        //     this.initCIPE();
        // }
        // else {
        //     this.title = 'Ingrese sus Datos';
        // }
    }

    ngOnInit() {
        this.appVersion = appVersion;
        this.apiVersion = sessionStorage.getItem('apiVersion');
        if (!this.apiVersion) {
            // this.appService.getVersion().subscribe((response: any) => {
            //     this.apiVersion = response.appVersion;
            //     sessionStorage.setItem('apiVersion', this.apiVersion);
            // });
        }
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
    }

    initCIPE() {
        this.initWS();
        let cmp: LoginComponent = this;
        this.timer = setInterval(function () {
            if (localStorage.getItem('currentUser')) {
                clearInterval(this.timer);
            }
            else {
                if (cmp.lastSent && +new Date() - cmp.lastSent > 1000) {
                    cmp.lastSent = null;
                    cmp.initWS();
                }
                else {
                    cmp.lastSent = +new Date();
                    cmp.send('PING');
                }
            }
        }, 1000);
    }

    goToLoginWithoutCIPE() {
        this.withoutCIPE = true;
        this.title = 'Ingrese sus Datos';
        localStorage.setItem('cipe', JSON.stringify({ cipe: true }));
        clearInterval(this.timer);
    }

    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }

    initWS() {
        // console.log("initWS");
        this.ws.init();
        this.subscription = this.ws.websocket.subscribe((msg: string) => {
            if (msg == 'PONG' && !this.readingCIPE) {
                this.lastSent = null;
                this.readingCIPE = true;
                clearInterval(this.timer);
                this.ws.close();
                this.subscription.unsubscribe();
                localStorage.setItem('cipe', JSON.stringify({ cipe: true }));
                this.router.navigateByUrl('pages/cipelogin');
            }
        });
    }

    send(msg: string) {
        this.ws.websocket.next(msg);
    }

    goToCIPE() {
        this.withoutCIPE = false;
        this.title = 'Inserte su CIPE';
        this.initCIPE();
    }

    login() {
        let really = this;
        let userName: string = this.model.documentNumber + this.model.sex;
        this.loadingService.enableShowSpinner();
        this.http.login(this.model).subscribe((response: any) => {
            console.log('login', response);
            localStorage.setItem('currentUser', JSON.stringify(response));
            really.router.navigateByUrl('/pages/access')
        }
            , error => {
                really.snackBar.open(error.error.message, '', {
                    duration: 4000
                    , panelClass: ['blue-snackbar']
                });

            })
        // this.authenticationService.loginWithoutCipe(userName, this.model.password)
        //     .subscribe(
        //         data => {
        //             this.loadingService.disableShowSpinner();
        //             this.router.navigateByUrl('pages/access');
        //         },
        //         error => {
        //             this.loadingService.disableShowSpinner();
        //             let msg = JSON.parse(error._body).message;
        //             swal({
        //                 title: 'Ups...',
        //                 text: msg,
        //                 type: 'error',
        //                 animation: false,
        //                 customClass: 'animated tada',
        //                 confirmButtonColor: '#f44336'
        //               });
        //         }
        //     );
    }
}
