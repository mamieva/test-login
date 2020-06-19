import { Component, AfterViewInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatStepper, MatCheckbox } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MatPaginator, MAT_DIALOG_DATA } from '@angular/material';
import { MigrateUnion } from '../services/migrateUnion.service';
import { OfficeService } from '../services/office.service';
import { PersonService } from '../services/person.service';
// import { CertificateService } from '../services/certificate.service';
import { StateService } from '../services/state.service';
import { lookupService } from '../services/lookupService.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { EventEmitter } from '../../../node_modules/protractor';
//
import { AppSettings } from './../app.settings';
import { QuestionService } from '../services/question.service';
import { QuestionControlService } from '../services/question-control.service';
import { ISubscription } from "rxjs/Subscription";
import { WebsocketService } from '../services/util/websocket.service';

@Component({
  selector: 'Certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements AfterViewInit {
  model: any = {};
  certificateId: any;
  displayColumns: any[] = [];
  displayedColumnsCertificate: any[] = [];
  displayedColumnsRequest: any[] = [];
  documents: any[] = [];
  documentsRequest: any[] = [];
  certificates: any;
  imagenWS: any = '';
  disabledButton: any = true;
  pdfCertificate: any = {};
  dataSourceRequest: any;
  dataSource: any;
  fulljson: any = {};

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private defuncionService: MigrateUnion,
    private officeService: OfficeService,
    private personService: PersonService,
    private stateService: StateService,
    private router: Router,
    // private certificateService: CertificateService,
    private lookupService: lookupService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.certificateId = +params.id;
    });
    if (this.certificateId) {
      this.lookupService.getCertificateById(this.certificateId).subscribe((response: any) => {
        console.log(response);
        this.model = response;
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      });
    }

    this.displayedColumnsCertificate = ['Archivo', 'action'];
    this.displayedColumnsRequest = ['Archivo', 'action'];
    this.displayColumns = ['Tipo', 'Tomo', 'Area', 'Etapa', 'Fecha', 'Estado', 'Actions'];
  }
  ngAfterViewInit() { }
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration,    panelClass: ['blue-snackbar']
    });
  }
  downloadAdjunto(row) {
    let really = this;
    console.log(row.document);
    // this.lookupService.g(row.id).subscribe((response: any) => {
    //   console.log(response);
    //   really.pdfCertificate = response;
    // });
  }
  goToInfo(id: any) {
    this.router.navigateByUrl('certificate/' + id);
    location.reload();
  }
  btnDescargar() {
    if (this.model.status != 'BLOCKED') {
      this.lookupService.getDocumentsByCertificate(this.certificateId).subscribe((documents: any) => {
        this.pdfCertificate = documents;
        let pdf = document.getElementById('pdfCertificate');
        pdf.scrollIntoView({ block: "end", behavior: "smooth" });
      })
    }
    if (this.model.status == 'BLOCKED') {
      this.lookupService.getDocumentsByCertificateBlocked(this.certificateId).subscribe((documents: any) => {
        this.pdfCertificate = documents;
        let pdf = document.getElementById('pdfCertificate');
        pdf.scrollIntoView({ block: "end", behavior: "smooth" });
      })
    }
  }
  marginarActa(procedureTypeCode: any) {
    this.router.navigateByUrl(`/marginActa/editData/${procedureTypeCode}/${this.model.id}`);
    // this.router.navigateByUrl(`/marginActa/editData/${this.model.id}/${this.model.procedureMargin.inProcess.id}`);
  }
  retomarMargin(procedureId: any) {
    this.router.navigateByUrl(`/procedure/${procedureId}`)
  }
}

