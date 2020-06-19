import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OperatorComponent } from './operator.component';
import { OperatorRoutes } from './operator.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InboxService } from '../../services/inbox.service';
import { lookupService } from '../../services/lookupService.service';
import { OfficeService } from '../../services/office.service';
import { ProcedureService } from '../../services/procedure.service';
import { NgxEditorModule } from 'ngx-editor';
import { ImageViewerModule } from 'ng2-image-viewer';
import { OperatorSafeHtmlPipe } from '../../services/pipes/operator.safe.html.pipe';
import { OperatorService } from '../../services/operator.service';
import { PersonService } from '../../services/person.service';
import { ProfileService } from '../../services/profile.service';

@NgModule({
  imports: [
    ImageViewerModule,
    FormsModule,
    NgxEditorModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(OperatorRoutes)
  ],
  declarations: [OperatorComponent, OperatorSafeHtmlPipe],
  providers: [
    ProcedureService,
    InboxService,
    lookupService,
    ProfileService,
    OfficeService,
    OperatorService,
    PersonService
  ]
})

export class OperatorModule { }
