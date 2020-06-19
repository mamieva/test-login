import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CMReconocimientoComponent } from './CMReconocimiento.component';
import { CMReconocimientoRoutes } from './CMReconocimiento.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MigrateMatrimonio } from '../services/migrateMatrimonio.service';
import { OfficeService } from '../services/office.service';
import { lookupService } from '../services/lookupService.service';
import { PersonService } from '../services/person.service';
import { StateService } from '../services/state.service';
import { ProcedureService } from '../services/procedure.service';
import { ReportsC2SafeHtmlPipe } from '../services/pipes/reportsC2.safe.html.pipe';
import { ImageViewerModule } from 'ng2-image-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    PdfViewerModule,
    ImageViewerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(CMReconocimientoRoutes)

  ],
  declarations: [CMReconocimientoComponent,ReportsC2SafeHtmlPipe],
  providers: [
    MigrateMatrimonio,
    lookupService,
    OfficeService,
    PersonService,
    StateService,
    ProcedureService
  ]
})

export class CMReconocimientoModule { }
