import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CMDefuncionComponent } from './CMDefuncion.component';
import { CMDefuncionRoutes } from './CMDefuncion.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MigrateDefuncion } from '../services/migrateDefuncion.service';
import { OfficeService } from '../services/office.service';
import { lookupService } from '../services/lookupService.service';
import { PersonService } from '../services/person.service';
import { StateService } from '../services/state.service';
import { ProcedureService } from '../services/procedure.service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(CMDefuncionRoutes)

  ],
  declarations: [CMDefuncionComponent],
  providers: [
    MigrateDefuncion,
    lookupService,
    OfficeService,
    PersonService,
    StateService,
    ProcedureService
  ]
})

export class CMDefuncionModule { }
