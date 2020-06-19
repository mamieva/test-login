import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProcedureComponent } from './procedure.component';
import { ProcedureRoutes } from './procedure.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MigrateUnion } from '../services/migrateUnion.service';
import { OfficeService } from '../services/office.service';
import { lookupService } from '../services/lookupService.service';
import { PersonService } from '../services/person.service';
import { StateService } from '../services/state.service';
import { ProcedureService } from '../services/procedure.service';
import { ImageViewerModule } from 'ng2-image-viewer';

@NgModule({
  imports: [
    ImageViewerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(ProcedureRoutes)

  ],
  declarations: [ProcedureComponent],
  providers: [
    MigrateUnion,
    lookupService,
    OfficeService,
    PersonService,
    StateService,
    ProcedureService
  ]
})

export class ProcedureModule { }
