import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { InboxService } from '../services/inbox.service';
import { ProcedureService } from '../services/procedure.service';
import { ConfigurationService } from '../services/configuration.service';
import { OperatorService } from '../services/operator.service';
import { lookupService } from '../services/lookupService.service'
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})

export class ConfigurationComponent {
  displayColumns: any;
  type: any;
  selectedTab: any;
  typeLabel: any = '';
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
  operatorOffice: any = JSON.parse(localStorage.getItem('currentOffice'));
  negativeCertificate = true;
  model: any = {};
  search: any;
  paramsSearch: any;
  searchParams: any = {};
  index: any;
  //
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private inboxService: InboxService,
    private dialog: MatDialog,
    private lookupService: lookupService,
    private configurationService: ConfigurationService,
    private operatorService: OperatorService,
    private profileService: ProfileService,
    private snackBar: MatSnackBar) {
    this.route.params.subscribe(params => {
      this.type = params.type;
    });
    this.route.queryParams.subscribe(params => {
      // debugger
      this.paramsSearch = params;
      this.lookupService.getCertificateTypesAll().subscribe((types: any) => {
        this.certificateTypes = types;
      }, error => {
        this.snackBarMessage(error.error.message, 4000);
      })

      if (JSON.stringify(this.paramsSearch) != '{}' && this.type == 'volumeConfig') {
        this.index = 1;
        this.configurationService.getVolumes(this.paramsSearch.certificateTypeId, this.paramsSearch.statusVolume, this.paramsSearch.yearVolume, this.paramsSearch.numberVolume, this.paramsSearch.numberBook).subscribe((response: any) => {
          this.model = response;
          this.displayColumns = ['Numero', 'Tipo', 'Anio', 'Libro', 'Estado'];
          this.certificates = new MatTableDataSource(this.model.content);
        }, error => {
          this.snackBarMessage(error.error.message, 4000);
        });
      }
    });
    if (this.type) {
      if (this.type === 'marginConfig') {
        this.typeLabel = 'Marginales';
        this.configurationService.getMarginTypes().subscribe((response: any) => {
          this.model.content = response;
          this.displayColumns = ['Nombre'];
          this.certificates = [];
          this.certificates = new MatTableDataSource(this.model.content);
        }, error => {
          this.snackBarMessage(error.error.message, 4000);
        });
      }
      if (this.type === 'operatorConfig') {
        this.typeLabel = 'operadores';
        this.searchOperator('');
      }
      if (this.type === 'profileConfig') {
        this.typeLabel = 'perfiles';
        this.searchProfile('');
      }
      if (this.type === 'volumeConfig') {
        this.searchInbox();
        this.typeLabel = 'tomos';
      }
    }
    const really = this;
  }

  searchOperator(search: any) {
    if (!search) { search = ''; }
    this.operatorService.searchOperator(search).subscribe((response: any) => {
      response.content.map((i: any) => {
        if (i.person) {
          i.name = i.person.fullName;
          i.docNumber = i.person.docNumber;
          i.code = i.id;
        }
      });
      this.model = response;
      this.displayColumns = ['Username', 'Nombre', 'DNI','Estado'];
      this.certificates = new MatTableDataSource(this.model.content);
    }, error => {
      this.snackBarMessage(error.error.message, 4000);
    });
  }
  searchInbox() {
    this.configurationService.getVolumesInbox().subscribe((response: any) => {
      this.model = response;
      this.displayColumns = ['Numero', 'Tipo', 'Anio', 'Estado'];
      this.certificates = new MatTableDataSource(this.model.content);
    }, error => {
      this.snackBarMessage(error.error.message, 4000);
    })
  }
  searchVolume() {
    // console.log(numberVolume);
    // console.log(yearVolume);
    // console.log(typeVolume);
    // console.log(statusVolumen);
    this.searchParams.certificateType = this.searchParams.certificateType ? this.searchParams.certificateType : '';
    this.searchParams.statusVolumen = this.searchParams.statusVolumen ? this.searchParams.statusVolumen : '';
    this.searchParams.yearVolume = this.searchParams.yearVolume ? this.searchParams.yearVolume : '';
    this.searchParams.numberVolume = this.searchParams.numberVolume ? this.searchParams.numberVolume : '';
    this.searchParams.numberBook = this.searchParams.numberBook ? this.searchParams.numberBook : '';
    this.router.navigateByUrl(`configuration/volumeConfig?certificateTypeId=${this.searchParams.certificateType}&statusVolume=${this.searchParams.statusVolumen}&yearVolume=${this.searchParams.yearVolume}&numberVolume=${this.searchParams.numberVolume}&numberBook=${this.searchParams.numberBook}`)
  }
  searchVolumeConfig() {
    this.configurationService.getVolumeConfig().subscribe((response: any) => {
      this.model.content = response;
      this.displayColumns = ['Tipo', 'Cantidad Folios'];
      this.certificates = new MatTableDataSource(this.model.content);
    }, error => {
      this.snackBarMessage(error.error.message, 4000);
    })
  }

  searchProfile(search: any) {
    if (!search) { search = ''; }
    this.profileService.searchProfile(search).subscribe((response: any) => {
      response.map((i: any) => {
        i.code = i.id;
      });
      this.model.content = response;
      this.displayColumns = ['Nombre', 'Descripción', 'Estado'];
      this.certificates = new MatTableDataSource(this.model.content);
    }, error => {
      this.snackBarMessage(error.error.message, 4000);
    });
  }
  changeTab(ev: any) {
    // console.log(ev);
    this.model = {};
    switch (ev.tab.textLabel) {
      case 'Tomos':
        this.selectedTab = null;
        this.router.navigateByUrl('configuration/volumeConfig')
        this.searchInbox();
        break;
      case 'customSearch':
        this.selectedTab = 'customSearch';
        this.displayColumns = ['Numero', 'Tipo', 'Anio', 'Libro', 'Estado'];
        this.lookupService.getCertificateTypesAll().subscribe((types: any) => {
          this.certificateTypes = types;
        }, error => {
          this.snackBarMessage(error.error.message, 4000);
        })
        this.certificates = new MatTableDataSource([]);
        break;
      case 'volumeType':
        this.router.navigateByUrl('configuration/volumeConfig')
        this.selectedTab = 'volumeType';
        this.searchVolumeConfig();
        break;
    }
  }
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration, panelClass: ['blue-snackbar']
    });
  }
  openNegative(row: any) {
    const really = this;
    const dialogRef = this.dialog.open(certificateDialog, {
      width: '700px',
      data: really.previewCert
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
    // this.inboxService.getCertificateById(row.id).subscribe((response: any) => {
    //   really.previewCert = response;
    // })
  }
  resetSearch() {
    const really = this;
    this.docNumber = '';
    this.sex = null;
    this.certificateNumber = '';
    this.year = '';
    this.office = null;
    this.certificateType = null;
    this.certificates = new MatTableDataSource([]);
  }
  clearSearchVolume() {
    this.model.content = [];
    this.searchParams = {};
    this.displayColumns = ['Numero', 'Tipo', 'Anio', 'Libro', 'Estado'];
    this.certificates = new MatTableDataSource([]);
  }

  editConfiguration(elem: any) {
    if (this.type == 'marginConfig') {
      this.router.navigateByUrl(`${this.type}/${elem.code}`);
      return null;
    }
    if (this.selectedTab && this.selectedTab == 'volumeType') {
      this.router.navigateByUrl(`volumeType/${elem.id}`)
    }
    else {
      this.router.navigateByUrl(`${this.type}/${elem.id}`);
    }
  }
  goNewOperator() {
    this.router.navigateByUrl('operatorConfig');
  }
  newVolume() {
    this.router.navigateByUrl('/volumeConfig');
  }
  goNewProfile() {
    this.router.navigateByUrl('profileConfig');
  }

  goToPage(position: any) {
    const really = this;
    let link: any;
    this.model.links.forEach(element => {
      if (element.rel === position) {
        link = element.href;
        this.inboxService.goToPage(link).subscribe((response: any) => {
          response.content.map((i: any) => {
            if (i.person) {
              i.name = i.person.fullName;
              i.docNumber = i.person.docNumber;
              i.code = i.id;
            }
          });
          really.model = response;
          really.certificates = new MatTableDataSource(response.content);
        });
      }
    });
  }
  getProcedureByProcedure() {
    const really = this;
    this.inboxService.getProcedureByPerson(this.docNumber, this.sex).subscribe((response: any) => {
      really.model = response;
      really.certificates = new MatTableDataSource(response.content);
    });
  }
  findTasks() {
    let tak: any[];
    tak = this.certificateTypes.filter((element: any) => {
      return element.code === this.certificateType;
    });
    this.tasks = tak[0].task;
  }
  findTasksStatus() {
    let tak: any[];
    tak = this.tasks.filter((element: any) => {
      return element.id === this.task;
    });
    this.tasksStatus = tak[0].taskStatus;
  }
}

@Component({
  selector: 'certificate-dialog',
  templateUrl: 'preview.component.html',
  styleUrls: ['./configuration.component.scss']
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
    const really = this;
    this.procedureService.generateCertificateNegative(this.model).subscribe((response: any) => {
      really.certificate = response;
      $('#download').click();
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
