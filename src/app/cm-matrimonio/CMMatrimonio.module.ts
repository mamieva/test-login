import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CMMatrimonioComponent } from './CMMatrimonio.component';
import { CMMatrimonioRoutes } from './CMMatrimonio.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MigrateMatrimonio } from '../services/migrateMatrimonio.service';
import { OfficeService } from '../services/office.service';
import { lookupService } from '../services/lookupService.service';
import { PersonService } from '../services/person.service';
import { StateService } from '../services/state.service';
import { ProcedureService } from '../services/procedure.service';
import { ImageViewerModule } from 'ng2-image-viewer';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatrimonioSafeHtmlPipe } from '../services/pipes/matrimonio.safe.html.pipe';

@NgModule({
  imports: [
    ImageViewerModule,
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(CMMatrimonioRoutes)

  ],
  declarations: [CMMatrimonioComponent,MatrimonioSafeHtmlPipe],
  providers: [
    MigrateMatrimonio,
    lookupService,
    OfficeService,
    PersonService,
    StateService,
    ProcedureService
  ]
})

export class CMMatrimonioModule { }
