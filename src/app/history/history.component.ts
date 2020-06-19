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
  selector: 'history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements AfterViewInit {
  displayColumns: any;
  model: any;
  isMargin: any = false;
  search: any;
  certificates: any;
  sex: any;
  docNumber: any;
  officeId: any;
  certificateTypes: any[] = [];
  tasks: any[] = [];
  tasksStatus: any[] = [];
  offices: any[] = [];
  certificateType: any = '';
  task: any = '';
  section: any = '';
  taskStatus: any = '';
  office: any;
  certificateNumber: any;
  year: any;
  dateTo: any = '';
  dateFrom: any = '';
  previewCert: any = {};
  operatorOffice: any = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.offices;
  negativeCertificate: boolean = true;
  //
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private inboxService: InboxService,
    private officeService: OfficeService,
    private dialog: MatDialog,
    private procedureService: ProcedureService,
    // private stateService: StateService,
    // private procedureService: ProcedureService,
    private lookupService: lookupService,
    private snackBar: MatSnackBar) {
    console.log(this.router.url)
    // if (this.router.url == '/historyMargin')
    this.isMargin = this.router.url.indexOf('/marginHistory') >= 0;
    // console.log(this.isMargin);
    this.route.queryParams.subscribe(params => {
      this.search = params;
    });
    if (this.search) {
      // console.log(this.search);
      if (this.search.doc_number && this.search.sex) {
        this.docNumber = this.search.doc_number;
        this.sex = this.search.sex;
        this.searchCertificateByPerson();
      }
      else if (this.search.certificateNumber || this.search.certificateNumber == '') {
        // console.log(this.search.dateFrom);
        this.certificateNumber = this.search.certificateNumber;
        this.year = this.search.year;
        this.office = this.search.officeId;
        this.certificateType = this.search.certificateTypeCode;
        this.getCertificatesByActa();
      }
    }
    let really = this;
    this.officeId = JSON.parse(localStorage.getItem('currentOffice')).id;
    this.lookupService.getCertificateTypesAll().subscribe((response: any) => {
      really.certificateTypes = response;
    });
    this.officeService.getOffices().subscribe((response: any) => {
      // really.offices = response;
      this.offices = response;
      // offices.forEach((elemento: any) => {
      //   really.operatorOffice.forEach(element => {
      //     if (element.id == elemento.id)
      //       really.offices.push(elemento)
      //   });
      // })
      // console.log(really.offices);
    })
    // this.lookupService.getOfficeLoggedInfo().subscribe((response: any) => {
    //   this.offices = response.sectionsToFilter;
    // })
    // this.inboxService.getProceduresByOperator().subscribe((response: any) => {
    //   really.model = response;
    //   really.certificates = new MatTableDataSource(response.content);
    // })
  }
  ngAfterViewInit() { }
  ngOnInit() {
    this.displayColumns = ['Tipo'];
  }
  clickeando(ev: any) {
    console.log(ev);
    this.router.navigateByUrl('/certificate/' + ev.id)
  }
  searchCertificateByPerson() {
    // console.log(sex);
    let really = this;
    this.docNumber = this.docNumber ? this.docNumber : '';
    this.sex = this.sex ? this.sex : '';
    if (this.isMargin) {
      this.inboxService.searchCertificateMarginByPerson(this.docNumber, this.sex).subscribe((response: any) => {
        really.certificates = new MatTableDataSource(response.content);
        // console.log(response);
        really.model = response;
        let string = `?doc_number=${this.docNumber}&sex=${this.sex}`;
        really.router.navigateByUrl('/marginHistory/' + string);
        if (response.content.length == 0) {
          really.snackBarMessage('No se encontraron Actas', 3000)
          really.negativeCertificate = true;
        }
        else {
          really.negativeCertificate = true;
        }
      }, error => {
        really.negativeCertificate = true;
        really.snackBarMessage(error.error.message, 5000)
      });
    }
    else {
      this.inboxService.searchCertificateByPerson(this.docNumber, this.sex).subscribe((response: any) => {
        really.certificates = new MatTableDataSource(response.content);
        // console.log(response);
        really.model = response;
        let string = `?doc_number=${this.docNumber}&sex=${this.sex}`;
        really.router.navigateByUrl('/history/' + string);
        if (response.content.length == 0) {
          really.snackBarMessage('No se encontraron Actas', 3000)
          really.negativeCertificate = true;
        }
        else {
          really.negativeCertificate = true;
        }
      }, error => {
        really.negativeCertificate = true;
        really.snackBarMessage(error.error.message, 5000)
      });
    }
  }
  getCertificatesByActa() {
    let really = this;
    this.certificateNumber = this.certificateNumber ? this.certificateNumber : '';
    this.year = this.year ? this.year : 0;
    this.office = this.office ? this.office : '';
    this.certificateType = this.certificateType ? this.certificateType : '';
    if (!this.isMargin) {
      this.inboxService.searchCertificateByActa(this.certificateNumber, this.year, this.office, this.certificateType).subscribe((response: any) => {
        really.certificates = new MatTableDataSource(response.content);
        // console.log(response);
        really.model = response;
        let string = `?certificateNumber=${really.certificateNumber}&year=${really.year}&officeId=${really.office}&certificateTypeCode=${really.certificateType}`;
        really.router.navigateByUrl('/history/' + string);
        if (response.content.length == 0) {
          really.snackBarMessage('No se encontraron Actas', 3000)
          really.negativeCertificate = true;
        }
        else {
          really.negativeCertificate = true;
        }
      }, error => {
        really.negativeCertificate = true;
        really.snackBarMessage(error.error.message, 5000)
      });
    }
    else {
      this.inboxService.searchCertificateMarginByActa(this.certificateNumber, this.year, this.office, this.certificateType).subscribe((response: any) => {
        really.certificates = new MatTableDataSource(response.content);
        // console.log(response);
        really.model = response;
        let string = `?certificateNumber=${really.certificateNumber}&year=${really.year}&officeId=${really.office}&certificateTypeCode=${really.certificateType}`;
        really.router.navigateByUrl('/marginHistory/' + string);
        if (response.content.length == 0) {
          really.snackBarMessage('No se encontraron Actas', 3000)
          really.negativeCertificate = true;
        }
        else {
          really.negativeCertificate = true;
        }
      }, error => {
        really.negativeCertificate = true;
        really.snackBarMessage(error.error.message, 5000)
      });
    }
  }
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration,    panelClass: ['blue-snackbar']
    });
  }
  openNegative(row: any) {
    let really = this;
    let dialogRef = this.dialog.open(certificateDialog, {
      width: '700px',
      data: really.previewCert
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
    // this.inboxService.getCertificateById(row.id).subscribe((response: any) => {
    //   really.previewCert = response;
    //   console.log(response);

    // })
  }
  resetSearch() {
    let really = this;
    this.docNumber = '';
    this.sex = null;
    this.certificateNumber = ''
    this.year = '';
    this.office = null;
    this.certificateType = null;
    this.certificates = new MatTableDataSource([]);
    // this.inboxService.getProceduresByOperator().subscribe((response: any) => {
    //   really.model = response;
    //   really.certificates = new MatTableDataSource(response.content);
    // })
    // this.certificates
  }
  editCertificate(elem: any) {
    this.inboxService.rejectCertificate(elem.id).subscribe((response: any) => {
      // console.log(elem);
      if (elem.certificateType.code == 'MATRIMONIO')
        this.router.navigateByUrl('/cmmat/' + elem.id);
      if (elem.certificateType.code == 'RECONOCIMIENTO')
        this.router.navigateByUrl('/cmrec/' + elem.id);
      if (elem.certificateType.code == 'DEFUNCION')
        this.router.navigateByUrl('/cmdef/' + elem.id);
      if (elem.certificateType.code == 'NACIMIENTO')
        this.router.navigateByUrl('/cmnac/' + elem.id);
      if (elem.certificateType.code == 'UNION_CONVIVENCIAL')
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
  getProcedureByProcedure() {
    let really = this;
    this.inboxService.getProcedureByPerson(this.docNumber, this.sex).subscribe((response: any) => {
      really.model = response;
      really.certificates = new MatTableDataSource(response.content);
    });
  }
  findTasks() {
    let tak: any[];
    tak = this.certificateTypes.filter((element: any) => {
      return element.code == this.certificateType;
    });
    this.tasks = tak[0].task;
    console.log(this.tasks);
  }
  findTasksStatus() {
    let tak: any[];
    tak = this.tasks.filter((element: any) => {
      return element.id == this.task;
    });
    this.tasksStatus = tak[0].taskStatus;
    console.log(this.tasksStatus);
  }
}

@Component({
  selector: 'certificate-dialog',
  templateUrl: 'preview.component.html',
  styleUrls: ['./history.component.scss']
})
export class certificateDialog {
  model: any = {};
  certificate: any = {};
  constructor(
    public procedureService: ProcedureService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<certificateDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  generateNegative() {
    let really = this;
    this.procedureService.generateCertificateNegative(this.model).subscribe((response: any) => {
      console.log(response);
      really.certificate = response;
      $('#download').click();
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    })
  }


  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration,    panelClass: ['blue-snackbar']
    });
  }

}