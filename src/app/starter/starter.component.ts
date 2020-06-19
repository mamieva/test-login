import { Component, AfterViewInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { InboxService } from '../services/inbox.service'
import { ProcedureService } from '../services/procedure.service'
import { lookupService } from '../services/lookupService.service'
import { OfficeService } from '../services/office.service'

@Component({
  selector: 'starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements AfterViewInit {
  displayColumns: any;
  displayColumnsSearch: any;
  search: any = '';
  model: any;
  modelSearch: any = {};
  certificates: any;
  certificatesSearch: any;
  sex: any;
  docNumber: any;
  officeId: any;
  procedureTypes: any[] = [];
  requestTypes: any[] = [];
  tasks: any[] = [];
  proceduresStatus: any[] = [];
  procedureStatus: any = {};
  tasksStatus: any[] = [];
  offices: any[] = [];
  procedureType: any = {};
  task: any = {};
  requestOrigin: any = {};
  section: any = {};
  taskStatus: any = '';
  office: any;
  certificateNumber: any;
  year: any;
  dateTo: any = '';
  dateFrom: any = '';
  previewCert: any = {};
  index: any = 0;
  operatorOffice: any = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.offices;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _formBuilder: FormBuilder,
    private inboxService: InboxService,
    private officeService: OfficeService,
    private dialog: MatDialog,
    private procedureService: ProcedureService,
    // private stateService: StateService,
    // private procedureService: ProcedureService,
    private lookupService: lookupService,
    private snackBar: MatSnackBar) {
    this.route.queryParams.subscribe(params => {
      this.search = params;
    });
    if (this.search) {
      // console.log(this.search);
      if (this.search.doc_number && this.search.sex) {
        this.index = 1;
        this.docNumber = this.search.doc_number;
        this.sex = this.search.sex;
        this.getProcedureByProcedure();
      }
      else if (this.search.dateFrom || this.search.dateFrom == '') {
        this.index = 1;
        // console.log(this.search.dateFrom);
        this.dateFrom = this.search.dateFrom;
        this.dateTo = this.search.dateTo;
        this.section.section = {};
        this.section.section.code = this.search.sectionCode;
        this.procedureType.code = this.search.procedureTypeCode;
        this.task.id = this.search.taskId;
        this.taskStatus = this.search.taskStatusId;
        this.requestOrigin.code = this.search.requestOriginCode;
        this.getFilterInbox();
      }
    }
    let really = this;
    this.officeId = JSON.parse(localStorage.getItem('currentOffice')).id;
    // this.lookupService.getProcedureTypes().subscribe((response: any) => {
    //   really.procedureTypes = response;
    // });
    // this.officeService.getOffices().subscribe((response: any) => {
    //   // really.offices = response;
    //   let offices = response;
    //   offices.forEach((elemento: any) => {
    //     really.operatorOffice.forEach(element => {
    //       if (element.id == elemento.id)
    //         really.offices.push(elemento)
    //     });
    //   })
    //   console.log(really.offices);
    // })
    this.lookupService.getOfficeLoggedInfo().subscribe((response: any) => {
      this.offices = response.filters.sectionalFilters;
      this.procedureTypes = response.filters.procedureType;
    })
    this.inboxService.getProceduresByOperator().subscribe((response: any) => {
      really.model = response;
      really.certificates = new MatTableDataSource(response.content);
    })
    this.lookupService.getProcedureStatus().subscribe((response: any) => {
      really.proceduresStatus = response;
    })
  }
  ngAfterViewInit() { }
  ngOnInit() {
    this.displayColumns = ['Numero', 'Tipo', 'Estado', 'Fecha'];
    this.displayColumnsSearch = ['Numero', 'Tipo', 'Estado', 'Fecha'];
    // this.displayColumnsSearch = ['Numero', 'Tipo', 'Area', 'Etapa', 'EstadoTarea', 'Estado', 'Fecha'];
  }
  clickeando(ev: any) {
    console.log(ev);
    this.router.navigateByUrl('/procedure/' + ev.id)
  }
  getCertificatesByPerson() {
    // console.log(sex);
    let really = this;
    this.docNumber = this.docNumber ? this.docNumber : '';
    this.sex = this.sex ? this.sex : '';
    this.inboxService.searchCertificateByPerson(this.docNumber, this.sex).subscribe((response: any) => {
      really.certificates = new MatTableDataSource(response.content);
      // console.log(response);
      if (response.content.length == 0)
        really.snackBarMessage('No se encontraron Trámites', 3000)
    }, error => {
      really.snackBarMessage(error.error.message, 5000)
    });
  }
  getCertificatesByActa() {
    let really = this;
    this.certificateNumber = this.certificateNumber ? this.certificateNumber : '';
    this.year = this.year ? this.year : '';
    this.office = this.office ? this.office : '';
    this.procedureType = this.procedureType ? this.procedureType : '';
    this.inboxService.searchCertificateByActa(this.certificateNumber, this.year, this.office, this.procedureType).subscribe((response: any) => {
      really.certificates = new MatTableDataSource(response.content);
      // console.log(response);
      if (response.content.length == 0)
        really.snackBarMessage('No se encontraron Trámites', 3000)
    }, error => {
      really.snackBarMessage(error.error.message, 5000)
    });

  }
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration, panelClass: ['blue-snackbar']
    });
  }
  previewCertificate(row: any) {
    let really = this;
    this.inboxService.getCertificateById(row.id).subscribe((response: any) => {
      really.previewCert = response;
      console.log(response);
      let dialogRef = this.dialog.open(previewDialog, {
        width: '700px',
        data: really.previewCert
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // this.animal = result;
      });

    })
  }
  resetSearch() {
    let really = this;
    this.docNumber = '';
    this.sex = null;
    this.certificateNumber = ''
    this.year = '';
    this.office = {};
    this.procedureType = {};
    this.certificatesSearch = new MatTableDataSource([]);
    this.modelSearch = {};
    // this.inboxService.getProceduresByOperator().subscribe((response: any) => {
    //   really.model = response;
    //   really.certificates = new MatTableDataSource(response.content);
    // })
    // this.certificates
  }
  editCertificate(elem: any) {
    this.inboxService.rejectCertificate(elem.id).subscribe((response: any) => {
      // console.log(elem);
      if (elem.procedureType.code == 'MATRIMONIO')
        this.router.navigateByUrl('/cmmat/' + elem.id);
      if (elem.procedureType.code == 'RECONOCIMIENTO')
        this.router.navigateByUrl('/cmrec/' + elem.id);
      if (elem.procedureType.code == 'DEFUNCION')
        this.router.navigateByUrl('/cmdef/' + elem.id);
      if (elem.procedureType.code == 'NACIMIENTO')
        this.router.navigateByUrl('/cmnac/' + elem.id);
      if (elem.procedureType.code == 'UNION_CONVIVENCIAL')
        this.router.navigateByUrl('/cmuni/' + elem.id);
    }, error => {
      this.snackBarMessage(error.error.message, 3000)
    })
  }
  goToPage(position: any) {
    let really = this;
    let link: any;
    this.model.links.forEach(element => {
      if (element.rel == position) {
        // debugger
        link = element.href;
        this.inboxService.goToPage(link).subscribe((response: any) => {
          really.model = response;
          really.certificates = new MatTableDataSource(response.content);
        });
      }
    });
  }
  goToPageSearch(position: any) {
    let really = this;
    let link: any;
    this.modelSearch.links.forEach(element => {
      if (element.rel == position) {
        // debugger
        link = element.href;
        this.inboxService.goToPage(link).subscribe((response: any) => {
          really.modelSearch = response;
          really.certificatesSearch = new MatTableDataSource(response.content);
        });
      }
    });
  }
  getProcedureByProcedure() {
    let really = this;
    this.docNumber = this.docNumber ? this.docNumber : '';
    this.sex = this.sex ? this.sex : '';
    this.inboxService.getProcedureByPerson(this.docNumber, this.sex).subscribe((response: any) => {
      really.modelSearch = response;
      let string = `?doc_number=${this.docNumber}&sex=${this.sex}`;
      really.router.navigateByUrl('/starter/' + string);
      really.certificatesSearch = new MatTableDataSource(response.content);
      if (response.content.length == 0) {
        really.snackBarMessage('No se encontraron resultados', 5000)
      }
    }, error => {
      really.snackBarMessage(error.error.message, 5000)
    });
  }
  findTasks(ev: any) {
    // console.log(ev);
    if (ev) {
      this.tasks = ev.task;

      this.requestTypes = ev.requestOrigin;
    }
    // let tak: any[];
    // tak = this.procedureTypes.filter((element: any) => {
    //   return element.code == this.procedureType;
    // });
    // this.tasks = tak[0].task;
    // console.log(this.tasks);
  }
  findTasksStatus(ev: any) {
    if (ev)
      this.tasksStatus = ev.taskStatus;
    // let tak: any[];
    // tak = this.tasks.filter((element: any) => {
    //   return element.id == this.task;
    // });
    // this.tasksStatus = tak[0].taskStatus;
    // console.log(this.tasksStatus);
  }
  getFilterInbox() {
    let sec = this.section && this.section.section ? this.section.section.code : '';
    let pro = this.procedureType && this.procedureType.code ? this.procedureType.code : '';
    let task = this.task && this.task.id ? this.task.id : '';
    let taskSta = this.taskStatus ? this.taskStatus : '';
    let procedStatus = this.procedureStatus.code ? this.procedureStatus.code : '';
    let request = this.requestOrigin && this.requestOrigin.code ? this.requestOrigin.code : '';
    let really = this;
    this.inboxService.getProcedureFilter(this.dateFrom, this.dateTo, sec, pro, task, taskSta, request, procedStatus).subscribe((response: any) => {
      really.modelSearch = response;
      let string = `?dateFrom=${really.dateFrom}&dateTo=${really.dateTo}&sectionCode=${sec}&procedureTypeCode=${pro}&status=${procedStatus}&taskId=${task}&taskStatusId=${taskSta}&requestOriginCode=${request}`;
      really.router.navigateByUrl('/starter/' + string)
      really.certificatesSearch = new MatTableDataSource(response.content);

      this.section = {};
      this.procedureType = {};
      this.task = {};
      this.taskStatus = '';
      this.procedureStatus= {};
      this.requestOrigin = {};
      // console.log(response);
      if (response.content.length == 0)
        really.snackBarMessage('No se encontraron Trámites', 3000)
    }, error => {
      really.snackBarMessage(error.error.message, 5000)
    })
  }
  changeSection(ev: any) {
    console.log(ev);
    if (ev) {
      this.procedureTypes = ev.procedureTypes;
    }
  }
}

@Component({
  selector: 'preview-dialog',
  templateUrl: 'preview.component.html',
  styleUrls: ['./starter.component.scss']
})
export class previewDialog {

  constructor(
    public dialogRef: MatDialogRef<previewDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}