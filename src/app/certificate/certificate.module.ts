import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CertificateComponent } from './certificate.component';
import { CertificateRoutes } from './certificate.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MigrateUnion } from '../services/migrateUnion.service';
import { OfficeService } from '../services/office.service';
import { lookupService } from '../services/lookupService.service';
import { PersonService } from '../services/person.service';
import { StateService } from '../services/state.service';
// import { CertificateService } from '../services/certificate.service';
import { ImageViewerModule } from 'ng2-image-viewer';

@NgModule({
  imports: [
    ImageViewerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(CertificateRoutes)

  ],
  declarations: [CertificateComponent],
  providers: [
    MigrateUnion,
    lookupService,
    OfficeService,
    PersonService,
    StateService
  ]
})

export class CertificateModule { }
