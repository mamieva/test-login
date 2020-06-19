import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationRoutes } from './configuration.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InboxService } from '../services/inbox.service';
import { lookupService } from '../services/lookupService.service';
import { OfficeService } from '../services/office.service';
import { ProcedureService } from '../services/procedure.service';
import { ConfigurationService } from '../services/configuration.service';
import { OperatorService } from '../services/operator.service';
import { ProfileService } from '../services/profile.service';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(ConfigurationRoutes)
  ],
  declarations: [ConfigurationComponent],
  providers: [
    ProcedureService,
    InboxService,
    lookupService,
    OfficeService,
    ConfigurationService,
    OperatorService,
    ProfileService
  ]
})

export class ConfigurationModule { }
