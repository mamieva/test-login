import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { volumeTypeComponent } from './volumeType.component';
import { volumeTypeRoutes } from './volumeType.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InboxService } from '../../services/inbox.service';
import { lookupService } from '../../services/lookupService.service';
import { OfficeService } from '../../services/office.service';
import { ProcedureService } from '../../services/procedure.service';
import { NgxEditorModule } from 'ngx-editor';
import { ImageViewerModule } from 'ng2-image-viewer';
// import { volumeTypeSafeHtmlPipe } from '../../services/pipes/volumeType.safe.html.pipe';
import { VolumeService } from '../../services/volume.service';
import { PersonService } from '../../services/person.service';

@NgModule({
  imports: [
    ImageViewerModule,
    FormsModule,
    NgxEditorModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(volumeTypeRoutes)
  ],
  declarations: [volumeTypeComponent],
  providers: [
    ProcedureService,
    InboxService,
    lookupService,
    OfficeService,
    VolumeService,
    PersonService
  ]
})

export class volumeTypeModule { }
