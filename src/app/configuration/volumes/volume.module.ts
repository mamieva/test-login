import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VolumeComponent } from './volume.component';
import { VolumeRoutes } from './volume.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InboxService } from '../../services/inbox.service';
import { lookupService } from '../../services/lookupService.service';
import { OfficeService } from '../../services/office.service';
import { ProcedureService } from '../../services/procedure.service';
import { NgxEditorModule } from 'ngx-editor';
import { ImageViewerModule } from 'ng2-image-viewer';
// import { VolumeSafeHtmlPipe } from '../../services/pipes/volume.safe.html.pipe';
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
    RouterModule.forChild(VolumeRoutes)
  ],
  declarations: [VolumeComponent],
  providers: [
    ProcedureService,
    InboxService,
    lookupService,
    OfficeService,
    VolumeService,
    PersonService
  ]
})

export class VolumeModule { }
