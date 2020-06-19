import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { cambioGeneroComponent } from './cambioGenero.component';
import { cambioGeneroRoutes } from './cambioGenero.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MigrateBorn } from '../services/migrateBorn.service';
import { OfficeService } from '../services/office.service';
import { lookupService } from '../services/lookupService.service';
import { PersonService } from '../services/person.service';
import { StateService } from '../services/state.service';
import { ProcedureService } from '../services/procedure.service';
import { OperatorSafeHtmlPipe } from '../services/pipes/operator.safe.html.pipe.1';
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
    RouterModule.forChild(cambioGeneroRoutes)

  ],
  declarations: [cambioGeneroComponent, OperatorSafeHtmlPipe],
  providers: [
    MigrateBorn,
    lookupService,
    OfficeService,
    PersonService,
    StateService,
    ProcedureService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class cambioGeneroModule { }
