import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MarginalComponent } from './marginal.component';
import { MarginalRoutes } from './marginal.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InboxService } from '../../services/inbox.service'
import { lookupService } from '../../services/lookupService.service'
import { OfficeService } from '../../services/office.service'
import { ProcedureService } from '../../services/procedure.service'
import { ConfigurationService } from '../../services/configuration.service'
import { NgxEditorModule } from 'ngx-editor';
import { ImageViewerModule } from 'ng2-image-viewer';

@NgModule({
  imports: [
    ImageViewerModule,
    FormsModule,
    NgxEditorModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(MarginalRoutes)
  ],
  declarations: [MarginalComponent],
  providers: [
    ProcedureService,
    InboxService,
    lookupService,
    OfficeService,
    ConfigurationService
  ]
})

export class MarginalModule { }
