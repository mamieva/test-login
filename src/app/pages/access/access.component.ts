import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthenticationService } from '../../services/authentication.service';
import { LoadingService } from '../../services/util/loading.service';
import { AppService } from '../../services/app.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

declare var $: any;
declare const swal: any;

declare var require: any;

const { version: appVersion } = require('../../../../package.json');

@Component({
    selector: 'access-cmp',
    templateUrl: './access.component.html'
})

export class AccessComponent implements OnInit {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    private model: any = {};
    public withoutCIPE: boolean = false;
    public title: string = "Seleccione Centro de Salud";
    list: any[] = [];
    appVersion: string;
    apiVersion: string;

    constructor(
        private element: ElementRef,
        // private authenticationService: AuthenticationService,
        private router: Router,
        private loadingService: LoadingService,
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
    }

    ngOnInit() {
        this.list = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.offices;
        if(this.list.length == 1){
            this.selectSection(this.list[0]);
            this.router.navigateByUrl('starter');
        }
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

    selectHealthCenter(idx: number) {
        let healthCenterHasOperator: any = this.list[idx];
        localStorage.setItem('healthCenterHasOperator', JSON.stringify(healthCenterHasOperator));
        // if (this.authenticationService.redirectUrl)
        //     this.router.navigateByUrl(this.authenticationService.redirectUrl);
        // else
        //     this.router.navigateByUrl('/');
    }

    login() {
        let obj = this;
        this.loadingService.enableShowSpinner();
        // this.authenticationService.login(this.model.email, this.model.password,this.model.email)
        //     .subscribe(
        //         data => {
        //             this.loadingService.disableShowSpinner();
        //             if (this.authenticationService.redirectUrl)
        //                 this.router.navigateByUrl(this.authenticationService.redirectUrl);
        //             else
        //                 this.router.navigateByUrl('/');
        //         },
        //         error => {
        //             this.loadingService.disableShowSpinner();
        //             swal({
        //                 title: 'Ups...',
        //                 text: 'Email y/o contraseña no válidos',
        //                 type: 'error',
        //                 animation: false,
        //                 customClass: 'animated tada',
        //                 confirmButtonColor: '#f44336'
        //               });
        //         }
        //     );
    }
    selectSection(section: any) {
        ////debugger
        // Setear currentSection en Localstorage
        localStorage.setItem('currentOffice', JSON.stringify(section));
        //
    }
}
