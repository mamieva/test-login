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
  selector: 'volume',
  templateUrl: './volume.component.html',
  styleUrls: ['./volume.component.scss']
})

export class VolumeComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  displayColumns: any;
  attribute: any;
  model: any = {};
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
  dateTo: any = '';
  dateFrom: any = '';
  previewCert: any = {};
  volumeOffice: any = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.offices;
  negativeCertificate = true;
  profileTypes: any = [
    { name: 'Perfil 1', code: 'code_1' },
    { name: 'Perfil 2', code: 'code_2' },
    { name: 'Perfil 3', code: 'code_3' },
    { name: 'Perfil 4', code: 'code_4' }
  ];
  volumeId: any;
  volume: any = {
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
    private volumeService: VolumeService,
    private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.volumeId = params.id;
    });
    if (this.volumeId) {
      this.volumeService.getVolume(this.volumeId).subscribe((response: any) => {
        this.model = response;
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
  newVolume() {
    this.volumeService.createVolume(this.model).subscribe((response: any) => {
      this.model = response;
    }, error => {
      this.snackBarMessage(error.error.message, 5000)
    })
  }
  closedVolume() {
    this.volumeService.closeVolume(this.model).subscribe((response: any) => {
      this.model = response;
    }, error => {
      this.snackBarMessage(error.error.message, 5000)
    })
  }
  printPdf() {
    this.volumeService.printPdf(this.model.id).subscribe((response: any) => {
      this.model = response;
    }, error => {
      this.snackBarMessage(error.error.message, 5000)
    })
  }
  getIndexPdf() {
    this.pdfCertificate.base64 = this.model.indexCloseVolumePdfBase64;
  }
  getClosedPdf() {
    this.pdfCertificate.base64 = this.model.certificateCloseVolumePdfBase64;
  }
  previewPDF(item:any){    
    this.pdfCertificate.base64 = this.model[item];
  }
  backPage() {
    window.history.back();
  }

  findPerson() {
    this.personService.getPersonByDocumentSex(this.volume.docNumber, this.volume.sex).subscribe((response: any) => {
      this.volume.person = response;
    }, error => {
      this.volume = {
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

  updateVolume() {
    if (!this.volume.email) {
      this.snackBarMessage('Rellene el campo correo electrónico', 5000);
      return;
    }
    const model = {
      id: this.volume.id,
      status: this.volume.status,
      userName: this.volume.email.userName,
      email: this.volume.email,
      volumeType: this.volume.profileType,
      person: {
        id: this.volume.person.id,
      }
    };

    this.volumeService.updateVolume(model).subscribe((response: any) => {
      this.volume = response;
      this.snackBarMessage('Operador actualizado con éxito', 5000);
    }, error => {
      this.snackBarMessage(error.error.message, 5000);
    });
  }

  createVolume() {
    if (!this.volume.docNumber) {
      this.snackBarMessage('Rellene el N° Documento', 5000);
      return;
    }
    if (!this.volume.sex) {
      this.snackBarMessage('Rellene el campo sexo', 5000);
      return;
    }
    if (!this.volume.email) {
      this.snackBarMessage('Rellene el campo correo electrónico', 5000);
      return;
    }
    const model = {
      email: this.volume.email,
      person: {
        docNumber: this.volume.docNumber,
        sex: this.volume.sex
      }
    };

    this.volumeService.createVolume(model).subscribe((response: any) => {
      this.volume = response;
      this.snackBarMessage('Operador creado con éxito', 5000);
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
