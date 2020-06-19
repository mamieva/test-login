import { Component, AfterViewInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatStepper, MatCheckbox } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MatPaginator, MAT_DIALOG_DATA } from '@angular/material';
import { MigrateUnion } from '../services/migrateUnion.service';
import { OfficeService } from '../services/office.service';
import { PersonService } from '../services/person.service';
import { ProcedureService } from '../services/procedure.service';
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
  selector: 'Procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.scss']
})
export class ProcedureComponent implements AfterViewInit {
  model: any = {};
  procedureId: any;
  displayColumns: any[] = [];
  displayColumnsMargin: any[] = [];
  displayedColumnsProcedure: any[] = [];
  displayedColumnsRequest: any[] = [];
  documents: any[] = [];
  documentsRequest: any[] = [];
  certificates: any;
  marginals: any;
  imagenWS: any = '';
  disabledButton: any = true;
  pdfCertificate: any = {};
  dataSourceRequest: any;
  dataSource: any;
  fulljson: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private defuncionService: MigrateUnion,
    private officeService: OfficeService,
    private personService: PersonService,
    private stateService: StateService,
    private procedureService: ProcedureService,
    private lookupService: lookupService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.procedureId = +params.id;
    });
    if (this.procedureId) {
      this.procedureService.getProcedure(this.procedureId).subscribe((response: any) => {
        // console.log(response);
        this.model = response;
        if (this.model.tasks.current.statusCode == 'EN_CURSO') {
          this.disabledButton = false;
        }
        this.certificates = new MatTableDataSource(response.certificates);
        this.marginals = new MatTableDataSource(response.marginals);
        // Si Hay un Request
        if (response.requestOrigin && response.requestOrigin.id) {
          this.procedureService.getDocumentsByProcedure(response.requestOrigin.id).subscribe((documents: any) => {
            this.documentsRequest = documents;
            this.dataSourceRequest = new MatTableDataSource(this.documentsRequest);
          }, error => {
            if (error.error.status != 409)
              this.snackBarMessage(error.error.message, 6000);
          })
        }
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      });
      this.procedureService.getDocumentsByProcedure(this.procedureId).subscribe((documents: any) => {
        this.documents = documents;
        this.dataSource = new MatTableDataSource(this.documents);
      }, error => {
        if (error.error.status != 409)
          this.snackBarMessage(error.error.message, 6000);
      })
    }

    this.displayedColumnsProcedure = ['Archivo', 'action'];
    this.displayedColumnsRequest = ['Archivo', 'action'];
    this.displayColumns = ['Tipo', 'Tomo', 'Area', 'Etapa', 'Fecha', 'Estado', 'Actions'];
    this.displayColumnsMargin = ['Tipo', 'Estado', 'Actions'];
  }
  ngAfterViewInit() { }
  takeProcedure() {
    this.disabledButton = true;
    this.procedureService.takeProcedure(this.procedureId, this.model).subscribe((response: any) => {
      // console.log(response);
      this.model = response;
      this.disabledButton = false;
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    })
  }
  freeProcedure() {
    // this.disabledButton = true;
    this.procedureService.freeProcedure(this.procedureId, this.model).subscribe((response: any) => {
      // console.log(response);
      this.model = response;
      this.disabledButton = true;
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    })
  }
  goToInfo(id: any) {
    // this.router.navigate(['procedure/' + id]);
    // location.reload();

    let url = '/#/procedure/' + id;
    // url = url.replace('certificate', path);
    // location.href = url + `certificate/${id}`;
    // target = "_blank"
    window.open(url, '_blank')
  }
  digitalize(element: any, index: any, documentType: any) {
    // this.disabledButton = true;
    let really = this;
    let imagen = '';
    let cant = 0;

    // var ws = new WebSocket('ws://127.0.0.1:9998');
    // var ws = new WebSocket('ws://192.168.0.34:9998');
    var ws = new WebSocket(`ws://${AppSettings.SCANNER_ENDPOINT}`);
    // var ws = new WebSocket('ws://192.168.0.27:9998');
    ws.binaryType = "arraybuffer";
    ws.onopen = function (event) {
      //alert('onopen');
      really.disabledButton = true;
      ws.send("TEST!!!");
    };

    ws.onmessage = function (evt: any) {
      // imagen += evt.data;
      // cant++;
      if (evt.data == 'EOF') {
        var gzip = require('gzip-js'),
          options = {
            level: 9,
            name: 'document.txt'
          };

        // out will be a JavaScript Array of bytes
        var out = gzip.zip(imagen, options);
        // debugger
        // console.log(out);
        // //console.log(out.length);

        really.snackBarMessage('Documento recibido, Subiendo!', 6000);
        // really.uploadFile(out, documentType.code);
        really.uploadFile(element.id, out, index, documentType);
      }
      else {
        imagen += evt.data;
        cant++;

      }
    };
    ws.onclose = function () {
      really.disabledButton = false;
      // websocket is closed.

      // really.snackBarMessage('Se cerró la conexión con el scanner', 6000);
      // alert("Connection is closed...");
    };
    ws.onerror = function (event) {
      really.disabledButton = false;
      really.snackBarMessage('Se Produjo un Error, intente nuevamente', 6000);
      // websocket is closed.
      // alert("Error");
    };
  }
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration, panelClass: ['blue-snackbar']
    });
  }
  uploadFile(certificateId: any, base64: any, index: any, documentType: any) {
    let really = this;
    let file: any = {
      procedureId: this.procedureId,
      documentType: documentType,
      compressBase64: base64
    }
    if (documentType == 'MARG') {
      file.marginId = certificateId;
    }
    else {
      file.certificateId = certificateId;
    }
    this.procedureService.uploadCertificate(file).subscribe((response: any) => {
      // debugger
      really.disabledButton = false;
      if (documentType == 'MARG') {
        really.model.marginals[index] = response.margin;
        really.marginals = new MatTableDataSource(really.model.marginals);
      }
      else {
        really.model.certificates[index] = response.certificate;
        really.certificates = new MatTableDataSource(really.model.certificates);
      }
      this.snackBarMessage('Archivo digitalizado con Éxito', 6000);
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    });
  }
  processTask() {
    this.procedureService.postInProcess(this.model.id, this.model.tasks.current.id, this.model).subscribe((response: any) => {
      this.model = response;
      this.certificates = new MatTableDataSource(response.certificates);
      this.marginals = new MatTableDataSource(response.marginals);
      if (this.model.tasks.current.statusCode == 'EN_CURSO') {
        this.disabledButton = false
      }
      else
        this.disabledButton = true
      this.snackBarMessage('Inicializada con Éxito', 6000);
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    })
  }
  finishTask() {
    this.procedureService.postCertificateProcedure(this.model.id, this.model.tasks.current.id, this.model).subscribe((response: any) => {
      this.model = response;
      this.certificates = new MatTableDataSource(response.certificates);
      this.marginals = new MatTableDataSource(response.marginals);
      if (this.model.tasks.current.statusCode == 'EN_CURSO') {
        this.disabledButton = false
      }
      else
        this.disabledButton = true
      this.snackBarMessage('Aprobada con Éxito', 6000);
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    })
  }
  rejectTask(action?: any, opposition?: any) {
    let modelAux = Object.assign({}, this.model);
    if (action)
      modelAux.actionDialog = action;
    if (opposition)
      modelAux.oppositionSelected = opposition;
    let dialogRef = this.dialog.open(RejectDialog, {
      width: '600px',
      data: modelAux
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.procedureService.getProcedure(this.procedureId).subscribe((response: any) => {
        // console.log(response);
        this.model = response;
        if (this.model.tasks.current.statusCode == 'EN_CURSO') {
          this.disabledButton = false;
        }
        this.certificates = new MatTableDataSource(response.certificates);
        this.marginals = new MatTableDataSource(response.marginals);
        this.pdfCertificate = {};
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      });
      // this.certificates = new MatTableDataSource(this.model.certificates);
      // this.animal = result;
    });
  }
  firmar(code: any) {
    this.fulljson.documentType = code;
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '600px',
      data: this.fulljson
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      this.procedureService.getProcedure(this.procedureId).subscribe((response: any) => {
        // console.log(response);
        this.model = response;
        if (this.model.tasks.current.statusCode == 'EN_CURSO') {
          this.disabledButton = false;
        }
        this.certificates = new MatTableDataSource(response.certificates);
        this.marginals = new MatTableDataSource(response.marginals);
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      });
      // this.certificates = new MatTableDataSource(this.model.certificates);
      // this.animal = result;
    });
  }

  cancelMargin() {
    let really = this;
    this.procedureService.cancelMargin(this.model.id, this.model.marginInProcess.id).subscribe((response: any) => {
      really.snackBarMessage('El Marginal fue Cancelado!', 6000);
      really.router.navigateByUrl('');
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }

  deleteFiles(element: any, documents: any) {
    let really = this;
    this.procedureService.deleteFiles(element.id).subscribe((response: any) => {
      really.snackBarMessage('Documento Eliminado con Éxito', 6000);
      if (documents == 'documentsRequest') {
        really.procedureService.getDocumentsByProcedure(really.model.requestOrigin.id).subscribe((documents: any) => {
          really.documentsRequest = documents;
          really.dataSourceRequest = new MatTableDataSource(really.documentsRequest);
        }, error => {
          if (error.error.status == 409) {
            really.dataSourceRequest = new MatTableDataSource([]);
            really.documentsRequest = [];
          }
          really.snackBarMessage(error.error.message, 6000)
        })
      }
      else {
        really.procedureService.getDocumentsByProcedure(really.model.requestOrigin.id).subscribe((documents: any) => {
          really.documentsRequest = documents;
          really.dataSourceRequest = new MatTableDataSource(really.documentsRequest);
        }, error => {
          if (error.error.status == 409) {
            really.dataSource = new MatTableDataSource([]);
            really.documents = [];
          }
          really.snackBarMessage(error.error.message, 6000)
        })
      }
    }, error => {
      really.snackBarMessage(error.error.message, 6000)
    })
  }

  descargar(row: any) {
    let really = this;
    // console.log(row.document);
    this.procedureService.getDocument(row.document.id).subscribe((response: any) => {
      // console.log(response);
      really.pdfCertificate = response;
      really.pdfCertificate.documentId = row.document.id;
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.fulljson = {
        //url: AppSettings.API_ENDPOINT + '/secure/files/upload',
        url: AppSettings.API_ENDPOINT.slice(0, -1),
        xAuthentication: 'Bearer ' + currentUser.authToken.token,
        procedure: really.model,
        proceduretypeAttrId: row.id,
        certificate: row,
        file: really.pdfCertificate.base64
      };
      // localStorage.setItem('procedure', JSON.stringify(fulljson));
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }
  printActa(element?: any) {
    let really = this;
    this.procedureService.getValidationPDF(this.model.id).subscribe((response: any) => {
      really.pdfCertificate = response;
    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    })
  }
  createActa() {
    let really = this
    this.procedureService.postCertificate(this.model.id, this.model).subscribe((response: any) => {
      // console.log(response);
      really.procedureService.getCertificatePDF(this.model.id).subscribe((pdfCertificate: any) => {
        really.pdfCertificate = pdfCertificate;
        this.procedureService.getProcedure(this.procedureId).subscribe((response: any) => {
          // console.log(response);
          this.model = response;
          if (this.model.tasks.current.statusCode == 'EN_CURSO') {
            this.disabledButton = false;
          }
          this.certificates = new MatTableDataSource(response.certificates);
          this.marginals = new MatTableDataSource(response.marginals);
          // this.pdfCertificate = {};
        }, error => {
          this.snackBarMessage(error.error.message, 6000);
        });
        // console.log(pdfCertificate);
      }, error => {
        really.snackBarMessage(error.error.message, 6000);
      })
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }
  descargarMarginFirma(row: any) {
    let really = this;
    // console.log(row.documents[0]);
    this.procedureService.getDocument(row.documents[0].id).subscribe((response: any) => {
      // console.log(response);
      really.pdfCertificate = response;
      really.pdfCertificate.documentId = row.documents[0].id;
      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.fulljson = {
        //url: AppSettings.API_ENDPOINT + '/secure/files/upload',
        url: AppSettings.API_ENDPOINT,
        xAuthentication: 'Bearer ' + currentUser.authToken.token,
        procedure: really.model,
        proceduretypeAttrId: row.id,
        certificate: row,
        file: really.pdfCertificate.base64
      };
      // localStorage.setItem('procedure', JSON.stringify(fulljson));
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }
  downloadAdjunto(row) {
    let really = this;
    // console.log(row.document);
    this.procedureService.getDocument(row.id).subscribe((response: any) => {
      // console.log(response);
      really.pdfCertificate = response;
    });
  }
  suspendTrm() {
    let really = this;
    this.procedureService.suspendTrm(this.model.id).subscribe((response: any) => {
      really.model = response;
      really.snackBarMessage('El trámite ha sido Suspendido', 6000);

    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    });
  }
  anularTrm() {
    let really = this;
    this.procedureService.anularTrm(this.model.id, {}).subscribe((response: any) => {
      really.model = response;
      really.snackBarMessage('Anulado con Éxito', 6000);

    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    });
  }
  cancelarTrm() {
    let really = this;
    this.procedureService.anularTrm(this.model.id, {}).subscribe((response: any) => {
      really.model = response;
      really.snackBarMessage('Cancelado con Éxito', 6000);

    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    });
  }
  btnAnularTrm() {
    return this.model.enabledInvalidate;
  }
  btnGenerarActa() {
    return this.model.enabledGenerateCertificate;
  }
  btnAprobarTarea() {
    if (this.model.tasks.current.enableOperator && this.model.tasks.current.statusCode == 'EN_CURSO' && this.model.tasks.current.code != 'REG_DATA') {
      if (this.model.tasks.current.code == 'WAITING_CELEBRATION' && this.model.certificates.length == 0)
        return false;
      return true;
    }
    else
      return false;
  }
  btnRechazarTarea() {
    if (this.model.tasks.enableRejected && this.model.tasks.previous.length > 0)
      return true;
    else
      return false;
  }
  btnIniciar() {
    if (this.model.tasks.current.enableOperator && (this.model.tasks.current.statusCode == 'PENDIENTE' || this.model.tasks.current.statusCode == 'EN_CURSO') && this.model.tasks.current.code == 'REG_DATA')
      return true;
    else
      return false;
  }
  btnEditar() {
    if (this.model.tasks.current.enableOperator && (this.model.tasks.current.code == 'WAITING_CELEBRATION') && this.model.tasks.current.statusCode == 'PENDIENTE')
      return true;
    else
      return false;
  }
  btnOponentes() {
    return this.model.enabledOpposition;
  }
  btnSuspenderTrm() {
    return this.model.enabledSuspend;
  }
  btnCancelMargin() {
    if (this.model.tasks.current.enableOperator && (this.model.marginInProcess && this.model.marginInProcess.id) && (this.model.tasks.current.statusCode == 'PENDIENTE' || this.model.tasks.current.statusCode == 'EN_CURSO') && this.model.tasks.current.code == 'REG_DATA')
      return true;
    else
      return false;
  }
  btnIniciarTask() {
    if (this.model.tasks.current.enableOperator && this.model.tasks.current.statusCode == 'PENDIENTE' && this.model.tasks.current.code != 'REG_DATA')
      return true;
    else
      return false;
  }
  btnDigitalizarActa(element: any) {
    // debugger
    if (this.model.taken.isTaken && this.model.tasks.current.statusCode == 'EN_CURSO' && this.model.tasks.current.code == 'DIGITIZE' && element.status != 'DIGITIZED')
      return true;
    else
      return false;
  }
  btnDescargarActa(element: any) {
    if (this.model.taken.enableOperator && this.model.taken.isTaken && element.status != 'APPROVED' && element.status != 'PRE_APPROVED' && element.status != 'BLOCKED_IN_PROCESS' && this.model.tasks.current.code == 'APPROVED' && element.document && this.pdfCertificate.documentId != element.document.id)
      return true;
    if (element.status == 'BLOCKED_IN_PROCESS' && this.model.tasks.current.code == 'LOCKED' && element.document && this.pdfCertificate.documentId != element.document.id)
      return true;
    else
      return false;
  }
  btnFirmarActa(element: any) {
    if (this.model.status != 'INVALIDATE' && element.document && this.pdfCertificate && this.pdfCertificate.base64 && this.pdfCertificate.documentId == element.document.id)
      return true;
    else
      return false
  }
  btnDigitalizarMargin(element: any) {
    if (this.model.taken.isTaken && this.model.tasks.current.statusCode == 'EN_CURSO' && this.model.tasks.current.code == 'DIGITIZE_MARGIN' && element.status != 'DIGITIZED')
      return true;
    else
      return false;
  }
  btnDescargarMargin(element: any) {
    if (this.model.taken.isTaken && this.model.tasks.current.statusCode == 'EN_CURSO' && element.status != 'APPROVED' && element.status != 'PRE_APPROVED' && this.model.tasks.current.code == 'APPROVED_MARGIN' && element.documents.length > 0 && this.pdfCertificate.documentId != element.documents[0].id)
      return true;
    else
      return false;

  }
  descargarMargin() {
    let really = this;
    this.procedureService.getDocumentMargin(this.model.id).subscribe((response: any) => {
      really.pdfCertificate = response;
      really.marginals = new MatTableDataSource(response.marginals);
      let pdf = document.getElementById('pdfCertificate2');
      pdf.scrollIntoView({ block: "end", behavior: "smooth" });
    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  goToOponentes() {
    this.router.navigateByUrl('oponentes/' + this.model.id)
  }
  editOponentes(opo:any) {
    this.router.navigateByUrl('oponentes/' + this.model.id + '/' + opo.id)
  }
  goToProcedure() {
    // this.processTask();
    switch (this.model.procedureTypeCode) {
      case 'NACIMIENTO':
        this.router.navigateByUrl('nac/' + this.model.id)
        break;
      case 'MATRIMONIO':
        this.router.navigateByUrl('mat/' + this.model.id)
        break;
      case 'DEFUNCION':
        this.router.navigateByUrl('def/' + this.model.id)
        break;
      case 'UNION_CONVIVENCIAL':
        this.router.navigateByUrl('uni/' + this.model.id)
        break;
      case 'GENERO':
        this.router.navigateByUrl('cambioG/' + this.model.id)
        break;
      case 'SOLICITUD_FUERA_DE_TERMINO':
        this.router.navigateByUrl('inscripcionT/' + this.model.id)
        break;
      case 'SOLICITUD_IMPUGNACION_PATERNIDAD':
        this.router.navigateByUrl('impugnacionPat/' + this.model.id)
        break;
      case 'SOLICITUD_FUERA_DE_TERMINO_JUDICIAL':
        this.router.navigateByUrl('inscripcionT/' + this.model.id)
        break;
      case 'SOLICITUD_ADOPCION':
        this.router.navigateByUrl('adoption/' + this.model.id)
        break;
      case 'SOLICITUD_RECONOCIMIENTO_FORZOSO':
        this.router.navigateByUrl('recForzoso/' + this.model.id)
        break;
      case 'RECONOCIMIENTO':
        this.router.navigateByUrl('rec/' + this.model.id)
        break;
      case 'MARGINAL_CORRECCION_DATOS':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_ADICION_APELLIDO':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_SUPRESION_APELLIDO':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_INSCRIPCION_INCAPACIDAD':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_CANCELACION_INCAPACIDAD':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_ASIGNACION_IDENTIDAD':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_INVALIDATE':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_IMPUGNACION_PATERNIDAD':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_INMOVIL_INSC_TARDIA':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_TUTELA':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_CURATELA':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
      case 'MARGINAL_INSANIA':
        this.router.navigateByUrl(`marginActa/editData/${this.model.procedureTypeCode}/${this.model.marginInProcess.certificate.id}/${this.model.id}`)
        break;
    }
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  moduleId: module.id,
  templateUrl: 'dialog-overview-example-dialog.html',
  providers: [QuestionService, QuestionControlService]
})
export class DialogOverviewExampleDialog {
  model: any = {};
  loading = false;
  user: any = {};
  attempts: number = -1;
  procedure: any;
  files: any[];
  pending: number;
  procedureid: string = '-1';
  mock: boolean = false;
  filterCertificate: String = 'ALL';
  readingCertificates = false;
  private subscription: ISubscription;
  look: string = "";
  currentUser: any; //User;
  firmando = false;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private router: Router,
    private procedureService: ProcedureService,
    private snackBar: MatSnackBar,
    private wsService: WebsocketService,
    private questionService: QuestionService,
    private cdr: ChangeDetectorRef) {

    // this.loadingService.enableShowSpinner();
    // console.log("*********** CONSTRUCTOR *******************");
    // debugger
    if (!this.wsService.websocket) {
      this.wsService.init();
    }
    else {
      this.wsService.close();
      this.wsService.init();
    }
    //this.look = sessionStorage.getItem('look') === undefined ? 'default' : sessionStorage.getItem('look');

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.look = localStorage.getItem('look_backend');
    // console.log("look BACKEND frequent" + this.look);

    this.subscription = this.wsService.websocket.subscribe((msg) => {
      // console.log('MENSAKE', msg);
      $("#imgCipe").animate({ left: "+=50" }, 1000);
      $("#imgCipe").animate({ left: "-=50" }, 1000);
      // console.log(msg);
      // console.log("*********** SUBSCRIPTIOON *******************");
      var color = "#ac1f7f"
      if (this.look == "BLACK") {
        color = "#000000";
      }

      //// console.log("***MENSAJE**");
      //// console.log(msg);

      if (msg[0] == '[') {
        // // console.log("***IF ARRAY**");

        this.readingCertificates = false;
        // this.procedureService.verificateSignOperator(this.operator.id,)
        var list = JSON.parse(msg);
        // console.log('LIST', list);
        var i, arr;
        if (list.length == 0) {
          // this.snackBarMessage('CIPE no válida para firmar este trámite', 6000)
          this.snackBarMessage('Ésta CIPE no es de un Agente Público!', 6000)
          // //alert('CIPE no válida para firmar este trámite', color);
          this.firmando = false;
          return;
        }
        arr = [];
        for (i = 0; i < list.length; i++) {
          arr.push({ key: list[i].position + 1, value: list[i].name });
        }
        this.user.options = arr;
        // // console.log(this.user.options);
        // console.log('arreglop', arr[0]);
        this.model.username = arr[0].key;
      }
      else {
        if (msg[0] == '{') {
          //// console.log("***IF JSON**"); 

          var fileuploaded = JSON.parse(msg);
          if (fileuploaded.result == 'OK') {
            // console.log("***IF JSON OK**");
            // this.pending--;
            // if (this.pending == 0) {
            // console.log("***IF JSON PENDING 0**");
            // this.procedureService.endById(data.procedure.procedureId).subscribe(result => {
            //     localStorage.removeItem('procedure');
            //     this.wsService.close();
            //     this.subscription.unsubscribe();
            //     this.router.navigate(['/']);
            // });
            // this.proceduretionService.endproceduretion(data.procedure.id, data.procedure).subscribe((response: any) => {
            this.disableShowSpinner();
            this.cdr.detectChanges();
            localStorage.removeItem('procedure');
            this.subscription.unsubscribe();
            // this.snackBarMessage('Firmado con Éxito', 6000);
            if (data.certificate.status == 'BLOCKED_IN_PROCESS' && data.procedure.tasks.current.code == 'LOCKED') {
              this.procedureService.blockedActa(data.proceduretypeAttrId, {}).subscribe((response: any) => {
                this.snackBarMessage('Firmado con Éxito', 6000);
                this.data = response;
                this.dialogRef.close();
              }, error => {
                this.dialogRef.close();
                this.snackBarMessage(error.error.message, 6000);
              });
            }
            else {
              if (data.documentType == 'CERT') {
                this.procedureService.approveActa(data.proceduretypeAttrId, {}).subscribe((response: any) => {
                  this.snackBarMessage('Firmado con Éxito', 6000);
                  this.data = response;
                  this.dialogRef.close();
                }, error => {
                  this.dialogRef.close();
                  this.snackBarMessage(error.error.message, 6000);
                });
              }
              else if (data.documentType == 'MARG') {
                this.procedureService.approveMarginal(data.procedure.id, data.proceduretypeAttrId, {}).subscribe((response: any) => {
                  this.snackBarMessage('Firmado con Éxito', 6000);
                  this.data = response;
                  this.dialogRef.close();
                }, error => {
                  this.dialogRef.close();
                  this.snackBarMessage(error.error.message, 6000);
                });
              }
            }
            // });
            // console.log("*********** FIN SUBSCRIPTION disableShowSpinner*******************");
            // }
            // else {
            // if (this.pending < this.files.length)
            //     this.files = this.files.splice(1);
            // this.procedure.file = this.files[0];
            // this.procedure.code = "ADJTRAMIX";
            // // console.log("***IF JSON ADJTRAMIX**");
            // // console.log("Sending procedure:" + this.procedure);
            // // console.log("Sending file:" + this.procedure.file.originalName);
            // // console.log("pending=" + this.pending);
            // this.wsService.websocket.next(JSON.stringify(this.procedure));
            // }
            // this.wsService.close();
            this.disableShowSpinner();
          }
          else if (fileuploaded.result == 'ERROR') {
            this.snackBarMessage('Se Produjo un Error. Contactese con un Administrador', 6000);
            this.firmando = false;
          }
        }
        else if (msg == "OK") {
          // console.log("***IF PIN OK ACTTRAMIX **");
          this.procedure = JSON.parse(localStorage.getItem('procedure'));
          // // console.log(this.procedure);
          // this.procedure.selectedCertificate = this.model.username;
          // this.procedure.pin = this.model.password;
          // this.files = this.procedure.files;
          // this.procedure.files = null;
          // this.pending = this.files.length + 1;
          // this.procedure.code = "ACTTRAMIX";
          //
          // let proceduretypeid = data.procedure.scheduleId != null ? data.procedure.scheduleId : -1;
          // let procedureid = data.procedure.id != null ? data.procedure.id : -1;
          // debugger
          let code = data.documentType ? data.documentType : '';
          // let json = {
          //   url: data.url,
          //   xAuthentication: data.xAuthentication,
          //   selectedCertificate: this.model.username,
          //   pin: this.model.password,
          //   id: 12350
          // };
          // id: data.certificate.document.id
          //////////////
          let json = {
            url: data.url,
            xAuthentication: data.xAuthentication,
            selectedCertificate: this.model.username,
            pin: this.model.password,
            procedure: {
              procedureId: data.proceduretypeAttrId
            },
            // proceduretypeAttr: {
            //   proceduretypeAttrId: data.proceduretypeAttrId
            // },
            file: {
              id: "0",
              mimeType: "application/pdf",
              originalName: "base64_" + Date.now() + ".pdf",
              base64: data.file
            },
            code: code
          };
          /////////////////////
          //
          // console.log(json);
          // this.wsService.websocket.next('HASH_SIGN'+JSON.stringify(json));
          this.wsService.websocket.next(JSON.stringify(json));
          this.firmando = true;
          // console.log("*************** PIN OK");
        }
        else if (msg == 'CARDREADER_OFF') {
          this.readingCertificates = false;
          this.snackBarMessage('No se detectó lector de CIPE', 6000);
          localStorage.setItem('cipe', JSON.stringify({ cipe: false }));

          this.firmando = false;
        }
        else {
          // console.log("***IF ATTEMPS**");
          this.attempts = +msg.split("ATTEMPS ")[1];
          this.disableShowSpinner();
          this.snackBarMessage('PIN Incorrecto, le quedan: ' + this.attempts + ' intentos', 6000)
          this.firmando = false;
        }
      }
    }, error => {
      this.snackBarMessage('Error de Conexión, verifique si estan abiertos los drivers', 7000)
    });
    // console.log("*********** FIN SUBSCRIPTION 2 *******************");
    this.disableShowSpinner();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration, panelClass: ['blue-snackbar']
    });
  }
  getCertificates() {
    $("#imgCipe").animate({ left: "+=50" }, 2000);
    $("#imgCipe").animate({ left: "-=50" }, 2000);
    // $("#imgCipe").animate({ "left": "+=50px" }, "slow");
    // debugger
    // console.log("*********** GET CERTIFICATES *******************");
    this.procedure = JSON.parse(localStorage.getItem('procedure'));
    // // console.log(data.procedure);
    // this.procedureid=data.procedure.id;
    this.readingCertificates = true;
    // console.log(this.readingCertificates);
    // this.questionService.getSecureOrganizations(this.procedureid).subscribe(response => {
    // //Para firmar procedure de ciudadano cambio el OID
    // if(response.oidOrganization == 'OID:2.16.32.1.3.2.1.1.3'){
    //     response.oidOrganization = '2.16.32.1.3.2.1.1.2';
    // }
    // // console.log("oidOrganization: " + response.oidOrganization);  
    //     this.filterCertificate = response.oidOrganization + " "+ response.codsolicitante; 
    //     //// console.log("filterCertificate: " +this.filterCertificate);         
    // this.wsService.websocket.next("GET_SIGN_CERTIFICATES"+ this.filterCertificate);          
    //  console.log("DENTRO DEL SECURE");
    //     //// console.log(this.readingCertificates);
    // console.log("*********** FIN GET CERTIFICATES *******************");
    // },
    // error => {
    //             ////alert("Error al obtener Organizations");
    //             this.readingCertificates=false;
    // });

    // console.log("*********** FIN 2 GET CERTIFICATES *******************");
    if (AppSettings.SING_OID) {

      let currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.wsService.websocket.next("GET_SIGN_CERTIFICATES OID:2.16.32.1.3.2.1.1.1 SN:" + currentUser.person.docNumber);
      // this.wsService.websocket.next("GET_SIGN_CERTIFICATES SN:"+currentUser.person.docNumber);
    }
    else {
      this.wsService.websocket.next("GET_SIGN_CERTIFICATES");
    }
  }

  validatePIN() {
    // console.log("*********** VALIDAR PIN enableShowSpinner*******************");
    this.wsService.websocket.next("PIN" + this.model.password);
    // this.loadingService.enableShowSpinner();
  }

  showSpinner() {
    this.cdr.detectChanges();
    // console.log("*********** showSpinner mustShowSpinner*******************");
    // return this.loadingService.mustShowSpinner();
  }
  disableShowSpinner() {
    // this.cdr.detectChanges();
    // console.log("*********** showSpinner mustShowSpinner*******************");
    // return this.loadingService.disableShowSpinner();
  }

}

@Component({
  selector: 'rejectDialog',
  moduleId: module.id,
  templateUrl: 'rejectDialog.html',
  providers: [ProcedureService]
})

export class RejectDialog {
  rejectTask: any = {};
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private router: Router,
    private procedureService: ProcedureService,
    private snackBar: MatSnackBar,
    private wsService: WebsocketService,
    private cdr: ChangeDetectorRef) {
    // console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration, panelClass: ['blue-snackbar']
    });
  }
  postReject() {
    debugger
    if (this.data.actionDialog == 'RECHAZAR') {
      this.procedureService.rejectTask(this.data.id, this.data.tasks.current.id, this.rejectTask).subscribe((response: any) => {
        this.snackBarMessage('Tarea Rechazada con Éxito!', 6000);
        this.onNoClick();
      }, error => {
        // this.onNoClick();
        this.snackBarMessage(error.error.message, 6000);
      })
    }
    else if (this.data.actionDialog == 'ANULAR') {
      let model: any = {
        cancellationReason: this.rejectTask.observations,
        id: this.data.id
      };
      this.procedureService.anularTrm(this.data.id, model).subscribe((response: any) => {
        this.data.model = response;
        this.snackBarMessage('Anulado con Éxito', 6000);
        this.onNoClick();
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      });
    }
    else if (this.data.actionDialog == 'RECHAZAR_OPOSICION') {
      let model: any = {
        rejectReason: this.rejectTask.observations,
        id: this.data.oppositionSelected.id
      };
      this.procedureService.rechazarOpposition(this.data.id, this.data.oppositionSelected.id, model).subscribe((response: any) => {
        this.data.model = response;
        this.snackBarMessage('Rechazado con Éxito', 6000);
        this.onNoClick();
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      });
    }
    else if (this.data.actionDialog == 'APROBAR_OPOSICION') {
      let model: any = {
        approveReason: this.rejectTask.observations,
        id: this.data.oppositionSelected.id
      };
      this.procedureService.aprobarOpposition(this.data.id, this.data.oppositionSelected.id, model).subscribe((response: any) => {
        this.data.model = response;
        this.snackBarMessage('Aprobado con Éxito', 6000);
        this.onNoClick();
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      });
    }
    else if (this.data.actionDialog == 'DESESTIMAR_OPOSICION') {
      let model: any = {
        disesteemReason: this.rejectTask.observations,
        id: this.data.oppositionSelected.id
      };
      this.procedureService.desestimarOpposition(this.data.id, this.data.oppositionSelected.id, model).subscribe((response: any) => {
        this.data.model = response;
        this.snackBarMessage('Desestimado con Éxito', 6000);
        this.onNoClick();
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      });
    }

  }

}

