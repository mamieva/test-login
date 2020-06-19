import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { InboxService } from '../../services/inbox.service';
import { VolumeService } from '../../services/volume.service';
import { lookupService } from '../../services/lookupService.service';
import { PersonService } from '../../services/person.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'volumeType',
  templateUrl: './volumeType.component.html',
  styleUrls: ['./volumeType.component.scss']
})

export class volumeTypeComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  displayColumns: any;
  attribute: any;
  model: any = {};
  type: any;
  certificates: any;
  sex: any;
  docNumber: any;
  officeId: any;
  volumesTypes: any[] = [];
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
  dateTo: any = '';
  dateFrom: any = '';
  previewCert: any = {};
  volumeTypeOffice: any = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.offices;
  negativeCertificate = true;
  profileTypes: any = [
    { name: 'Perfil 1', code: 'code_1' },
    { name: 'Perfil 2', code: 'code_2' },
    { name: 'Perfil 3', code: 'code_3' },
    { name: 'Perfil 4', code: 'code_4' }
  ];
  volumeTypeId: any;
  volumeType: any = {
    person: {
      docType: {},
      birth: {},
      address: {}
    },
    profileType: {},
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: lookupService,
    private personService: PersonService,
    private volumeTypeService: VolumeService,
    private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.volumeTypeId = params.id;
    });
    if (this.volumeTypeId) {
      this.volumeTypeService.getVolumeType(this.volumeTypeId).subscribe((response: any) => {
        this.model = response;
        this.volumeTypeService.getVolumesTypes().subscribe((types: any) => {
          // console.log(types);
          this.volumesTypes = types;
        })
      }, error => {
        this.snackBarMessage(error.error.message, 4000);
      });
    }
  }

  ngOnInit() {
    // Obtener tipos de perfiles.
    // this.lookupService.getProfileType().subscribe((response: any) => {
    //   this.profileTypes = response;
    // });
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'Este campo es requerido' :
      this.email.hasError('email') ? 'Correo electrónico no válido' :
        '';
  }
  newvolumeType() {
    this.volumeTypeService.createVolume(this.model).subscribe((response: any) => {
      this.model = response;
    }, error => {
      this.snackBarMessage(error.error.message, 5000)
    })
  }
  updatevolumeType() {
    this.volumeTypeService.putVolumeType(this.model).subscribe((response: any) => {
      this.model = response;
      this.snackBarMessage('Actualizado con Éxito!', 5000)
    }, error => {
      this.snackBarMessage(error.error.message, 5000)
    })
  }
  getIndexPdf() {
    this.pdfCertificate.base64 = this.model.indexClosevolumeTypePdfBase64;
  }
  getClosedPdf() {
    this.pdfCertificate.base64 = this.model.certificateClosevolumeTypePdfBase64;
  }
  backPage() {
    window.history.back();
  }

  findPerson() {
    this.personService.getPersonByDocumentSex(this.volumeType.docNumber, this.volumeType.sex).subscribe((response: any) => {
      this.volumeType.person = response;
    }, error => {
      this.volumeType = {
        person: {
          docType: {},
          birth: {},
          address: {}
        },
        profileType: {},
        address: {},
        birth: {}
      };
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  createvolumeType() {
    if (!this.volumeType.docNumber) {
      this.snackBarMessage('Rellene el N° Documento', 5000);
      return;
    }
    if (!this.volumeType.sex) {
      this.snackBarMessage('Rellene el campo sexo', 5000);
      return;
    }
    if (!this.volumeType.email) {
      this.snackBarMessage('Rellene el campo correo electrónico', 5000);
      return;
    }
    const model = {
      email: this.volumeType.email,
      person: {
        docNumber: this.volumeType.docNumber,
        sex: this.volumeType.sex
      }
    };

    this.volumeTypeService.createVolume(model).subscribe((response: any) => {
      this.volumeType = response;
      this.snackBarMessage('Operador creado con éxito', 5000);
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration,    panelClass: ['blue-snackbar']
    });
  }
}
