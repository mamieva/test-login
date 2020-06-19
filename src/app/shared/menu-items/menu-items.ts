import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
  badge: any[];
}

const MENUITEMS = [
  { state: 'starter', name: 'Bandeja de Entrada', type: 'link', icon: 'view_list', badge: [] },
  { state: 'nac', name: 'Nacimiento', type: 'link', icon: 'person_add', badge: [] },
  { state: 'cambioG', name: 'Cambio de Genero', type: 'link', icon: 'wc', badge: [] },
  { state: 'inscripcionT', name: 'Inscripción Tardía', type: 'link', icon: 'av_timer', badge: [] },
  { state: 'adoption', name: 'Adopción', type: 'link', icon: 'group_add', badge: [] },
  { state: 'recForzoso', name: 'Reconocimiento Forzoso', type: 'link', icon: 'gavel', badge: [] },
  { state: 'impugnacionPat', name: 'Impugnación de Paternidad', type: 'link', icon: 'gavel', badge: [] },
  { state: 'rec', name: 'Reconocimiento', type: 'link', icon: 'supervised_user_circle', badge: [] },
  { state: 'mat', name: 'Matrimonio', type: 'link', icon: 'people', badge: [] },
  { state: 'uni', name: 'Union Convivencial', type: 'link', icon: 'people', badge: [] },
  { state: 'history', name: 'Archivo Histórico', type: 'link', icon: 'group_add', badge: [] },
  { state: 'marginHistory', name: 'Marginales', type: 'link', icon: 'group_add', badge: [] },
  {
    state: 'configuration', name: 'Configuración', type: 'link', icon: 'settings', badge: [
      { state: 'marginConfig', name: 'Marginales', type: 'link', icon: 'dns' },
      { state: 'operatorConfig', name: 'Operadores', type: 'link', icon: 'assignment_ind' },
      { state: 'profileConfig', name: 'Perfiles', type: 'link', icon: 'assignment' },
      { state: 'volumeConfig', name: 'Tomos', type: 'link', icon: 'assignment_ind' }
    ]
  }
  // { state: 'def', name: 'Defunción', type: 'link', icon: 'person_outline' },
  // { state: 'mat', name: 'Matrimonio', type: 'link', icon: 'group' },
  // { state: 'uni', name: 'Union Convivencial', type: 'link', icon: 'supervised_user_circle' },
  // {state: 'button', type: 'link', name: 'Buttons', icon: 'crop_7_5'},
  // {state: 'grid', type: 'link', name: 'Grid List', icon: 'view_comfy'},
  // {state: 'lists', type: 'link', name: 'Lists', icon: 'view_list'},
  // {state: 'menu', type: 'link', name: 'Menu', icon: 'view_headline'},
  // {state: 'tabs', type: 'link', name: 'Tabs', icon: 'tab'},
  // {state: 'stepper', type: 'link', name: 'Stepper', icon: 'web'},
  // {state: 'expansion', type: 'link', name: 'Expansion Panel', icon: 'vertical_align_center'},
  // {state: 'chips', type: 'link', name: 'Chips', icon: 'vignette'},
  // {state: 'toolbar', type: 'link', name: 'Toolbar', icon: 'voicemail'},
  // {state: 'progress-snipper', type: 'link', name: 'Progress snipper', icon: 'border_horizontal'},
  // {state: 'progress', type: 'link', name: 'Progress Bar', icon: 'blur_circular'},
  // {state: 'dialog', type: 'link', name: 'Dialog', icon: 'assignment_turned_in'},
  // {state: 'tooltip', type: 'link', name: 'Tooltip', icon: 'assistant'},
  // {state: 'snackbar', type: 'link', name: 'Snackbar', icon: 'adb'},
  // {state: 'slider', type: 'link', name: 'Slider', icon: 'developer_mode'},
  // {state: 'slide-toggle', type: 'link', name: 'Slide Toggle', icon: 'all_inclusive'},
];

@Injectable()

export class MenuItems {
  getMenuitem(): Menu[] {

    return MENUITEMS;
  }

}
