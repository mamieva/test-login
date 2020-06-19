import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HistoryComponent } from './history.component';
import { HistoryRoutes } from './history.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InboxService } from '../services/inbox.service'
import { lookupService } from '../services/lookupService.service'
import { OfficeService } from '../services/office.service'
import { ProcedureService } from '../services/procedure.service'

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(HistoryRoutes)
  ],
  declarations: [HistoryComponent],
  providers: [
    ProcedureService,
    InboxService,
    lookupService,
    OfficeService
  ]
})

export class HistoryModule { }
