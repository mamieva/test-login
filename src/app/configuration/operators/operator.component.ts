import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { InboxService } from '../../services/inbox.service';
import { OperatorService } from '../../services/operator.service';
import { lookupService } from '../../services/lookupService.service';
import { PersonService } from '../../services/person.service';
import { FormControl, Validators } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss']
})

export class OperatorComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
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
  offices: any[] = [];
  certificateType: any = '';
  task: any = '';
  section: any = '';
  office: any;
  certificateNumber: any;
  pdfCertificate: any = {};
  year: any;
  dateTo: any = '';
  dateFrom: any = '';
  previewCert: any = {};
  operatorOffice: any = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.offices;
  negativeCertificate = true;
  profiles: any = [];
  personOperator: any = { find: true };
  operatorId: any;
  operator: any = {
    person: {
      docType: {},
      birth: {},
      address: {}
    },
    profile: {},
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private LookupService: lookupService,
    private profileService: ProfileService,
    private personService: PersonService,
    private operatorService: OperatorService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.operatorId = params.id;
    });
    if (this.operatorId) {
      this.operatorService.getOperator(this.operatorId).subscribe((response: any) => {
        this.operator = response;
        this.operator.profile = response.profile ? response.profile : {};
        this.operator.active = response.status === 'ACT' ? true : false;
        this.getTask(this.operator.id);
      }, error => {
        this.snackBarMessage(error.error.message, 4000);
      });
    }
    // Obtener perfiles.
    this.profileService.searchActiveProfile().subscribe((response: any) => {
      this.profiles = response;
    });
  }

  backPage() {
    this.router.navigateByUrl('configuration/operatorConfig');
    // window.history.back();
  }
  getTask(operatorId) {
    this.operatorService.getTask(operatorId).subscribe((response: any) => {
      this.tasks = response;
    });
  }
  
  closePerson(person: any) {
    this[person].person = {
      docType: {},
      birth: {},
      address: {}
    };
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'Este campo es requerido' :
      this.email.hasError('email') ? 'Correo electrónico no válido' :
        '';
  }

  activeOperator() {
    this.operatorService.activeOperator(this.operator.id, this.operator.active).subscribe((response: any) => {
      this.operator.status = response.status;
      this.operator.statusLabel = response.statusLabel;
      this.operator.active = response.status === 'ACT' ? true : false;
    });
  }

  findOperator() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personOperator.docNumber, this.personOperator.sex).subscribe((response: any) => {
      // console.log(response);
      really.operator.person = response;
      really.operator.find = true;

    }, error => {
      really.operator.person = {
        docType: {},
        birth: {},
        address: {}
      };
      really.operator.find = false;
      really.snackBarMessage(error.error.message, 5000);
    })
  }

  assignTask(row: any) {
    this.operatorService.postTask(this.operator.id, row.id).subscribe((response: any) => {
      this.tasks = response;
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  unassignTask(row: any) {
    this.operatorService.deleteTask(this.operator.id, row.id).subscribe((response: any) => {
      this.tasks = response;
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  deleteOperator() {
    this.operatorService.deleteOperator(this.operator.id).subscribe((response: any) => {
      this.snackBarMessage('El operador se eliminó correctamente', 5000);
      this.router.navigateByUrl('/configuration/operatorConfig');
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  updateOperator() {
    if (!this.operator.email) {
      this.snackBarMessage('Rellene el campo correo electrónico', 5000);
      return;
    }
    const model = {
      id: this.operator.id,
      email: this.operator.email,
      profile: {
        id: this.operator.profile.id
      },
      person: {
        docNumber: this.operator.person.docNumber,
        sex: this.operator.person.sex
      }
    };

    this.operatorService.updateOperator(model).subscribe((response: any) => {
      this.operator = response;
      this.operator.active = response.status === 'ACT' ? true : false;
      this.getTask(response.id)
      this.snackBarMessage('Operador actualizado con éxito', 5000);
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  createOperator() {
    // if (!this.operator.docNumber) {
    //   this.snackBarMessage('Rellene el N° Documento', 5000);
    //   return;
    // }
    // if (!this.operator.sex) {
    //   this.snackBarMessage('Rellene el campo sexo', 5000);
    //   return;
    // }
    // if (!this.operator.email) {
    //   this.snackBarMessage('Rellene el campo correo electrónico', 5000);
    //   return;
    // }
    // const model = {
    //   email: this.operator.email,
    //   profile: { id: this.operator.profile.id }
    // };

    this.operatorService.createOperator(this.operator).subscribe((response: any) => {
      this.operator = response;
      this.operator.active = response.status === 'ACT' ? true : false;
      this.getTask(this.operator.id);
      this.snackBarMessage('Operador creado con éxito', 5000);
      this.router.navigateByUrl('operatorConfig/' + this.operator.id)
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration, panelClass: ['blue-snackbar']
    });
  }
}
