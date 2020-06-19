import { Component, AfterViewInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { InboxService } from '../../services/inbox.service'
import { ProcedureService } from '../../services/procedure.service'
import { ConfigurationService } from '../../services/configuration.service'
import { lookupService } from '../../services/lookupService.service'
import { OfficeService } from '../../services/office.service'

@Component({
  selector: 'marginal',
  templateUrl: './marginal.component.html',
  styleUrls: ['./marginal.component.scss']
})
export class MarginalComponent implements AfterViewInit {
  displayColumns: any;
  attribute: any;
  model: any;
  type: any;
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
  pdfCertificate: any = {};
  year: any;
  marginId: any;
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
    private configurationService: ConfigurationService,
    // private procedureService: ProcedureService,
    private lookupService: lookupService,
    private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.type = params.type;
      this.marginId = params.id;
    });
    if (this.marginId) {
      // console.log(this.marginId);
    }
    let really = this;
    this.configurationService.getMarginType(this.marginId).subscribe((response: any) => {
      // console.log(response);
      this.model = response;
    })
  }
  ngAfterViewInit() { }
  ngOnInit() {
    this.displayColumns = ['Tipo'];
    this.model = [
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
      { id: 1, certificateTypeName: '', year: '', statusLabel: '' },
    ];
    this.certificates = new MatTableDataSource(this.model);
  }
  updateMargin() {
    let really = this;
    this.configurationService.putMarginType(this.marginId, this.model).subscribe((response: any) => {
      // console.log(response);
      this.model = response;
      really.snackBarMessage('Actualizado con Éxito!', 4000);
    }, error => {
      really.snackBarMessage(error.error.message, 4000);
    })
  }
  backPage() {
    window.history.back();
  }
  previewPDF() {
    let really = this;
    this.configurationService.getPreview(this.model.code).subscribe((response) => {
      this.pdfCertificate = response;
      let pdf = document.getElementById('pdfCertificate');
      pdf.scrollIntoView({ block: "end", behavior: "smooth" });
    }, error => {
      really.snackBarMessage(error.error.message, 4000);
    })
  }
  clickeando(ev: any) {
    // console.log(ev);
    this.router.navigateByUrl('/certificate/' + ev.id)
  }
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration,    panelClass: ['blue-snackbar']
    });
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
  changeHTML(ev: any) {
    // console.log(ev);
  }
  editMarginal(elem: any) {
    console.log(elem);
    this.router.navigateByUrl(`${this.type}/${elem.id}`)
  }
  goToPage(position: any) {
    let really = this;
    let link: any;
    // this.model.links.forEach(element => {
    //   if (element.rel == position) {
    //     // debugger
    //     link = element.href;
    //     this.inboxService.goToPage(link).subscribe((response: any) => {
    //       really.model = response;
    //       really.certificates = new MatTableDataSource(response.content);
    //     });
    //   }
    // });
  }
  addText() {
    // Create a dummy input to copy the string array inside it
    let dummy : any = document.createElement("input");

    // Add it to the document
    document.body.appendChild(dummy);

    // Set its ID
    dummy.setAttribute("id", "dummy_id");

    // Output the array into it
    
    let aux = (<HTMLInputElement>document.getElementById('dummy_id'));
    aux.value = this.attribute.codeValue;

    // Select it
    dummy.select();

    // Copy its contents
    document.execCommand("copy");

    // Remove it as its not needed anymore
    document.body.removeChild(dummy);
    this.snackBarMessage(`Se agregó al portapapeles el Atributo "${this.attribute.name}", insertelo donde desee`,5000);
  }
  //
  // GUARDAR CODIGO ---> INSERTA TEXTO EN TEXT AREA
  // addText() {
  //   let selectNode = window.getSelection().getRangeAt(0).startContainer;
  //   console.log(selectNode);
  //   let selectText = document.getSelection();
  //   // selectNode.nodeValue += 'Hola';
  //   if (selectNode.nodeValue && this.attribute) {
  //     let start = this.model.template.substr(0, selectText.focusOffset);
  //     let end = this.model.template.substr(selectText.focusOffset);
  //     this.model.template = start + ' ' + this.attribute.codeValue + ' ' + end;
  //   }
  //   console.log(selectText);

  //   // let focus = select.focusNode;

  // }
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
    // console.log(this.tasks);
  }
  findTasksStatus() {
    let tak: any[];
    tak = this.tasks.filter((element: any) => {
      return element.id == this.task;
    });
    this.tasksStatus = tak[0].taskStatus;
    // console.log(this.tasksStatus);
  }
}
