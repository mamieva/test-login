import { ChangeDetectorRef, Component, NgZone, OnDestroy, ViewChild, HostListener, Directive, AfterViewInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
// import { MenuItems } from '../../../shared/menu-items/menu-items';
import { lookupService } from '../../../services/lookupService.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent {
  mobileQuery: MediaQueryList;
  currentUser: any = {};
  officeId: any = {};
  modules: any;
  itemSidebar: any[] = [];
  MENUITEMS: any[] = [
    { state: 'starter', name: 'Bandeja de Entrada', type: 'link', icon: 'view_list', badge: [] },
    { state: 'nac', name: 'Nacimiento', type: 'link', icon: 'person_add', badge: [] },
    { state: 'cambioG', name: 'Cambio de Genero', type: 'link', icon: 'wc', badge: [] },
    { state: 'def', name: 'Defunción', type: 'link', icon: 'person_outline', badge: [] },
    { state: 'inscripcionT', name: 'Inscripción Tardía', type: 'link', icon: 'av_timer', badge: [] },
    { state: 'adoption', name: 'Adopción', type: 'link', icon: 'group_add', badge: [] },
    { state: 'recForzoso', name: 'Reconocimiento Forzoso', type: 'link', icon: 'gavel', badge: [] },
    { state: 'impugnacionPat', name: 'Impugnación de Paternidad', type: 'link', icon: 'gavel', badge: [] },
    { state: 'supresionAp', name: 'Supresión de Apellido', type: 'link', icon: 'remove_circle_outline', badge: [] },
    { state: 'rec', name: 'Reconocimiento', type: 'link', icon: 'supervised_user_circle', badge: [] },
    { state: 'mat', name: 'Matrimonio', type: 'link', icon: 'people', badge: [] },
    { state: 'uni', name: 'Union Convivencial', type: 'link', icon: 'people', badge: [] },
    { state: 'history', name: 'Archivo Histórico', type: 'link', icon: 'group_add', badge: [] },
    { state: 'marginHistory', name: 'Marginales', type: 'link', icon: 'group_add', badge: [] },
    {
      state: 'configuration',
      name: 'Configuración',
      type: 'link',
      icon: 'settings',
      badge: [
        { state: 'marginConfig', name: 'Marginales', type: 'link', icon: 'dns' },
        { state: 'operatorConfig', name: 'Operadores', type: 'link', icon: 'assignment_ind' },
        { state: 'profileConfig', name: 'Perfiles', type: 'link', icon: 'assignment' },
        { state: 'volumeConfig', name: 'Tomos', type: 'link', icon: 'assignment_ind' }
      ]
    }];

  private _mobileQueryListener: () => void;


  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    // public menuItems: MenuItems,
    private lookupService: lookupService,
    private route: ActivatedRoute,
    private router: Router, ) {
    console.log(this.MENUITEMS);
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).person;
    this.officeId = JSON.parse(localStorage.getItem('currentOffice')).id;
    let really = this;
    this.lookupService.getModules(this.officeId).subscribe((response: any) => {
      really.modules = response;
      really.filterModules();
    });

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  filterModules() {
    let really = this;
    let items: any = this.MENUITEMS;
    console.log('items', items);
    items.forEach(element => {
      really.modules.forEach(module => {
        //debugger
        if (
          (element.name == 'Bandeja de Entrada' && module.code == 'INBOX_SHOW' && module.enabled) ||
          // (element.name == 'Solicitudes' && module.code == 'INBOX_SHOW') ||
          (element.name == 'Nacimiento' && module.code == 'NACIMIENTO' && module.enabled) ||
          (element.name == 'Cambio de Genero' && module.code == 'GENERO' && module.enabled) ||
          (element.name == 'Adopción' && module.code == 'SOLICITUD_FUERA_DE_TERMINO' && module.enabled) ||
          (element.name == 'Reconocimiento Forzoso' && module.code == 'SOLICITUD_RECONOCIMIENTO_FORZOSO' && module.enabled) ||
          (element.name == 'Impugnación de Paternidad' && module.code == 'SOLICITUD_IMPUGNACION_PATERNIDAD' && module.enabled) ||
          (element.name == 'Supresión de Apellido' && module.code == 'SOLICITUD_SUPRESION_APELLIDO' && module.enabled) ||
          (element.name == 'Marginales' && module.code == 'MARGIN' && module.enabled) ||
          (element.name == 'Inscripción Tardía' && module.code == 'SOLICITUD_FUERA_DE_TERMINO' && module.enabled) ||
          (element.name == 'Archivo Histórico' && module.code == 'ARCHIVO' && module.enabled) ||
          (element.name == 'Defunción' && module.code == 'DEFUNCION' && module.enabled) ||
          (element.name == 'Matrimonio' && module.code == 'MATRIMONIO' && module.enabled) ||
          (element.name == 'Reconocimiento' && module.code == 'RECONOCIMIENTO' && module.enabled) ||
          (element.name == 'Union Convivencial' && module.code == 'UNION_CONVIVENCIAL' && module.enabled) ||
          (element.name == 'Configuración' && module.code == 'CONFIGURATION' && module.enabled)
        ) {
          really.itemSidebar.push(element);
        }
      });
    });
    really.itemSidebar = really.itemSidebar.map(element => {
      if (element.badge && element.badge.length > 0) {
        let aux: any[] = [];
        element.badge.forEach(badge => {
          really.modules.forEach(module => {
            if (
              (badge.name == 'Marginales' && module.code == 'CONFIGURATION_MARGIN' && module.enabled) ||
              (badge.name == 'Perfiles' && module.code == 'CONFIGURATION_PROFILE' && module.enabled) ||
              (badge.name == 'Tomos' && module.code == 'CONFIGURATION_VOLUME' && module.enabled) ||
              (badge.name == 'Operadores' && module.code == 'CONFIGURATION_OPERATOR' && module.enabled)
            ) {
              aux.push(badge);
            }
          })
        });
        element.badge = aux;
      }
      return element;
    })
    this.itemSidebar.push(
      { state: 'logout', name: 'Cerrar Sesión', type: 'link', icon: 'exit_to_app', badge: [] })
  }
  goTo(url: any) {
    console.log(url);
    this.router.navigateByUrl('/starter', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/configuration/' + url]));
    // this.router.navigate(['/configuration/' + url], { relativeTo: this.route })
    // this.router.navigateByUrl('configuration/' + url);
  }
}
