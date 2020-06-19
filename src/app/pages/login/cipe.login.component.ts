import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthenticationService } from '../../services/authentication.service';
import { ISubscription } from "rxjs/Subscription";
import { LoadingService } from '../../services/util/loading.service';
import { WebsocketService } from '../../services/util/websocket.service';
import { AppService } from '../../services/app.service';

declare var $: any;
declare const swal: any;

declare var require: any;

const { version: appVersion } = require('../../../../package.json');

@Component({
    selector: 'app-login-cmp',
    templateUrl: './cipe.login.component.html'
})

export class CipeLoginComponent implements OnInit {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    private model: any = {};
    public withoutCIPE: boolean = false;
    public title: string = "INSERTE SU CIPE";
    lastSent: number;
    readingCIPE: boolean = false;
    private subscription: ISubscription;
    options: any[] = [];
    currentOption: string;
    attempts: number = -1;
    timer: any;
    appVersion: string;
    apiVersion: string;

    constructor(
        private element: ElementRef,
        // private authenticationService: AuthenticationService,
        private router: Router,
        private loadingService: LoadingService,
        private ws: WebsocketService,
        appService: AppService) {
        this.appVersion = appVersion;
        this.apiVersion = sessionStorage.getItem('apiVersion');
        if (!this.apiVersion) {
            // appService.getVersion().subscribe((response: any) => {
            //     this.apiVersion = response.appVersion;
            //     sessionStorage.setItem('apiVersion', this.apiVersion);
            // });
        }
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.initWS();
        let cmp: CipeLoginComponent = this;
        this.timer = setInterval(function () {
            if (!cmp.readingCIPE) {
                cmp.send('PING');
            }
        }, 1000);
    }

    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700);
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
            this.lastSent = null;
            // console.log(msg);
            if (msg == 'PONG') {
                clearInterval(this.timer);
                if (!this.readingCIPE) {
                    this.readingCIPE = true;
                    this.loadingService.enableShowSpinner();
                    this.send('GET_CERTIFICATES');
                }
            }
            else if (msg[0] == '[') {
                //debugger
                let list: any[] = JSON.parse(msg);

                let saludCert = list.find((elem:any)=>{
                    return elem.organizations.indexOf('Ministerio de Salud') > 0;
                });

                if (list.length == 0) {
                    this.router.navigateByUrl('pages/login');
                    return;
                }
                this.options = [];
                for (let l of list) {
                    this.options.push({ key: l.userName, value: l.name.split('(')[0] });
                }
                if(!saludCert){
                    if (list.length > 0) {
                        this.currentOption = list[0].name.split('(')[0];
                        this.model.userName = list[0].userName ? list[0].userName : null;
                        this.model.email = list[0].email ? list[0].email : null;
                    }
                }
                else{
                    this.currentOption = saludCert.name.split('(')[0];
                    this.model.userName = saludCert.userName ? saludCert.userName : null;
                    this.model.email = saludCert.email ? saludCert.email : null;
                }
                this.loadingService.disableShowSpinner();
            }
            else if (msg.startsWith('OK')) {
                this.model.serial = msg.replace('OK ', '');
                this.login();
            }
            else if (msg == 'CARDREADER_OFF') {
                this.loadingService.disableShowSpinner();
                this.dialog('No se detectó lector de CIPE');
                localStorage.setItem('cipe', JSON.stringify({ cipe: false }));
                this.router.navigateByUrl('pages/login');
            }
            else {
                // console.log('Response:' + msg);
                this.loadingService.disableShowSpinner();
                this.attempts = +msg.split("ATTEMPS ")[1];
                // console.log('attempts=' + this.attempts);
            }
        },
            (error: any) => {
                this.loadingService.disableShowSpinner();
                this.dialog('No se detectó lector de CIPE');
                localStorage.setItem('cipe', JSON.stringify({ cipe: false }));
                this.router.navigateByUrl('pages/login');
            },
            () => {
                this.loadingService.disableShowSpinner();
                this.dialog('No se detectó lector de CIPE');
                localStorage.setItem('cipe', JSON.stringify({ cipe: false }));
                this.router.navigateByUrl('pages/login');
            }
        );
        this.send('PING');
    }

    send(msg: string) {
        this.lastSent = +new Date();
        this.ws.websocket.next(msg);
    }

    // readAgain() {
    //     window.location.reload();
    // }

    changeOption(opt: any) {
        this.currentOption = opt.value;
        this.model.userName = opt.key;
    }

    goToLoginWithoutCIPE() {
        localStorage.setItem('cipe', JSON.stringify({ cipe: false }));
        this.router.navigateByUrl('pages/login');
    }

    validatePIN() {
        this.loadingService.enableShowSpinner();
        this.send('NEW_PIN' + this.model.password);
    }

    dialog(msg: string) {
        swal({
            title: 'Ups...',
            text: msg,
            type: 'error',
            animation: false,
            customClass: 'animated tada',
            confirmButtonColor: '#f44336'
        });
    }

    login() {
        let really = this;
        // this.authenticationService.login(this.model.userName, this.model.serial, this.model.email)
        //     .subscribe(
        //     data => {

        //         really.ws.close();
        //         really.subscription.unsubscribe();
        //         really.loadingService.disableShowSpinner();
        //         really.router.navigateByUrl('pages/access');
        //     },
        //     error => {
        //         // console.log(error);
        //         let err = JSON.parse(error._body);
        //         if (err.status == 400) {
        //             really.dialog(err.message);
        //         }
        //         else
        //             really.dialog('Contraseña incorrecta');
        //         really.loadingService.disableShowSpinner();
        //     }
        //     );
    }
}
