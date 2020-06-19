import { Component, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatStepper, MatCheckbox } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MigrateDefuncion } from '../services/migrateDefuncion.service';
import { OfficeService } from '../services/office.service';
import { PersonService } from '../services/person.service';
import { StateService } from '../services/state.service';
import { lookupService } from '../services/lookupService.service';
import { ProcedureService } from '../services/procedure.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'CMDefuncion',
  templateUrl: './CMDefuncion.component.html',
  styleUrls: ['./CMDefuncion.component.scss']
})
export class CMDefuncionComponent implements AfterViewInit {
  model: any;
  certificateId: any;
  filteredOptions: Observable<any>;
  OperatorCtrl: FormControl = new FormControl();
  isLinear = true;
  bloqueoActa: any = false;
  bloqueoReconocimiento: any = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  acta: any = {
    office: {},
    volume: {}, certificateTypeCode: "DEFUNCION"
  };
  // actaBloquear: any = { volume: {}, certificateTypeCode: "NACIMIENTO" };
  // actaReconocimiento: any = { volume: {}, certificateTypeCode: "RECONOCIMIENTO" };
  offices: any[] = [];
  states: any[] = [];
  departaments: any[] = [];
  cities: any[] = [];
  personMother: any = {};
  personFather: any = {};
  personDeclarante: any = {};
  personDifunto: any = {};
  mother: any = {
    actorType: {
      id: 4,
      code: "PROGENITOR_1"
    },
    person: {
      docType: {},
      address: {},
      birth: {}
    }
  }
  father: any = {
    actorType: {
      id: 4,
      code: "PROGENITOR_2"
    },
    person: {
      docType: {},
      birth: {},
      address: {}
    }
  }
  declarante: any = {
    actorType: {
      id: 4,
      code: "DECLARANTE",
      relationship: {}
    },
    person: {
      docType: {},
      address: {},
      birth: { address: {} }
    }
  }
  difunto: any = {
    actorType: {
      id: 4,
      code: "DIFUNTO",
      relationship: {}
    },
    person: {
      ageType: {},
      docType: {},
      address: { city: {} },
      birth: { address: { city: {} } },
      death: { address: { city: {} } }
    }
  }
  margin: any = {};
  margins: any[] = [];
  marginIndex: any;
  displayedColumns: any;
  displayColumnActa: any;
  dataSource: any;
  dataActasFiles: any;
  documentTypes: any[] = [];
  relationships: any[] = [];
  fileActas: any[] = [];
  filesMarginales: any;
  filesAttachment: any[] = [];
  actorTypes: any[] = [];
  actorType: any = {};
  editarPersona: any = 'NO';
  editActorType: any = {};
  observations: any = {};
  operatorsSign: any[] = [];
  civilStatus: any[] = [];
  ageTypes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private defuncionService: MigrateDefuncion,
    private officeService: OfficeService,
    private personService: PersonService,
    private stateService: StateService,
    private router: Router,
    private procedureService: ProcedureService,
    private lookupService: lookupService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.certificateId = +params.id;
      console.log(this.certificateId);
    });
    if (this.certificateId) {
      this.lookupService.getCertificateById(this.certificateId).subscribe((response: any) => {
        this.model = response;
        this.acta = response;
        if (!response.replacementCertificate) {
          this.acta.replacementCertificate = { volume: {}, certificateTypeCode: "NACIMIENTO" }
        }
        if (!response.recognitionCertificate) {
          this.acta.recognitionCertificate = { volume: {}, certificateTypeCode: "RECONOCIMIENTO" }
        }
        this.observations.observation = this.model.observation;
        this.fileActas.push(this.model.document);
        this.dataActasFiles = new MatTableDataSource(this.fileActas);
        this.margins = response.marginals;
        this.dataSource = new MatTableDataSource(this.margins);
        response.procedure.people.forEach((element: any) => {
          if (element.actorType.code == 'PROGENITOR_1')
            this.mother = element;
          if (element.actorType.code == 'PROGENITOR_2')
            this.father = element;
          if (element.actorType.code == 'DIFUNTO')
            this.difunto = element;
          if (element.actorType.code == 'DECLARANTE') {
            this.declarante = element;
            // this.wife.person.birth.address = { city: {} }
          }
          // if (element.actorType.code == 'CONTRAYENTE_1') {
          //   this.husband = element;
          //   this.husband.person.birth.address = { city: {} }
          // }
          // if (element.actorType.code.indexOf('TESTIGO_') >= 0) {
          //   this.testigos.push(element)
          //   this.dataSourceTestigos = new MatTableDataSource(this.testigos);
          //   // this.husband = element;
          //   // this.husband.person.birth.address = { city: {} }
          // }
          // if (element.actorType.code == 'DECLARANTE')
          //   this.declarante = element;
        });
      });
    }
    // $("#snav").toggle();
    this.firstFormGroup = this._formBuilder.group({
      volumeNumber: ['', Validators.required],
      folioNumber: ['', Validators.required],
      certificateNumber: ['', Validators.required],
      year: ['', Validators.required],
      officeId: ['', Validators.required],
      operatorSignId: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      // secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      // thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      // fourthCtrl: ['', Validators.required]
    });
    this.fifthFormGroup = this._formBuilder.group({
      // fifthCtrl: ['', Validators.required]
    });
    this.sixthFormGroup = this._formBuilder.group({
      // sixthCtrl: ['', Validators.required]
    });
    //Obtener Tipos de Docu.
    this.lookupService.getDocumentType().subscribe((response: any) => {
      this.documentTypes = response;
    })
    //Obtener Estados Civil.
    this.lookupService.getCivilStatus().subscribe((response: any) => {
      this.civilStatus = response;
    })
    //Obtener Relaciones
    this.lookupService.getRelationship().subscribe((response: any) => {
      this.relationships = response;
    })
    //Obtener Relaciones
    this.lookupService.getAgeType().subscribe((response: any) => {
      this.ageTypes = response;
    })

    // Obtener Oficinas
    this.officeService.getOffices().subscribe((response: any) => {
      this.offices = response;
    });
    // Obtener Estados
    this.stateService.getStatesByCountry(1).subscribe((response: any) => {
      this.states = response;
    });
    // Obtener ActorTypes
    // this.lookupService.getActorTypesByProcedureType('NACIMIENTO').subscribe((response: any) => {
    //   this.actorTypes = response;
    // });
    //Obtener operadores de firma

    this.lookupService.getOperatorsSign().subscribe((response: any) => {
      this.operatorsSign = response.content;
      // Autocomplete Operadores
      this.filteredOptions = this.OperatorCtrl.valueChanges.pipe(
        startWith(''),
        map(val => {
          if (val == '' || typeof val == 'object') {
            return this.operatorsSign.slice();
          }
          return this.filter(val)
        })
      );
    })
    //
    this.displayedColumns = ['sentence', 'date', 'status', 'action'];
    this.dataSource = new MatTableDataSource(this.margins);
    this.displayColumnActa = ['Archivo', 'Acciones'];
    this.dataActasFiles = new MatTableDataSource(this.fileActas);
  }
  ngAfterViewInit() { }
  resetStepper(stepper: MatStepper) {
    stepper.selectedIndex = 0;
  }
  displayFn(option: any) {
    return option && option.person ? option.person.lastName + ' ' + option.person.firstName : option;
  }
  filter(val: any) {
    return this.operatorsSign.filter(option => {
      let aux = option.person.lastName + ' ' + option.person.firstName;
      return aux.toLowerCase().indexOf(val.toLowerCase()) >= 0;
    });
  }
  createActa(stepper: MatStepper, bloquearActa: MatCheckbox) {
    let really = this;
    //    
    this.acta.officeId = this.acta.office.id;
    this.acta.operatorSignId = this.acta.operatorSign.id;
    this.defuncionService.postActa(this.acta).subscribe((response: any) => {
      really.model = response;
      // if (bloquearActa.checked) {
      //   console.log(response);
      //   this.defuncionService.bloquearActa(response.id, really.actaBloquear).subscribe((bloqueada: any) => {
      //     console.log(bloqueada);
      //     stepper.selectedIndex = 1;
      //   }, error => {
      //     really.snackBarMessage(error.error.message, 5000);
      //   })
      // }
      // else
      stepper.selectedIndex = 1;
    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    });

  }
  getOffices() {
    // this.defuncionService.
  }
  findMother() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personMother.docNumber, this.personMother.sex).subscribe((response: any) => {
      console.log(response);
      really.mother.person = response;

    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    })
  }
  findFather() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personFather.docNumber, this.personFather.sex).subscribe((response: any) => {
      console.log(response);
      really.father.person = response;

    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  findDeclarante() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personDeclarante.docNumber, this.personDeclarante.sex).subscribe((response: any) => {
      console.log(response);
      really.declarante.person = response;

    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  findDifunto() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personDifunto.docNumber, this.personDifunto.sex).subscribe((response: any) => {
      console.log(response);
      really.difunto.person = response;
      really.difunto.person.ageType = {};
      really.difunto.person.birth.address = { city: {} }
      really.difunto.person.death.address = { city: {} }

    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  changeState(ev: any) {
    let really = this;
    this.stateService.getDepartamentsByState(ev.value).subscribe((response: any) => {
      really.departaments = response;
    })
  }
  changeDepartament(ev: any) {
    let really = this;
    this.stateService.getCitiesByState(ev.value).subscribe((response: any) => {
      really.cities = response;
    })
  }
  updateProcedure(stepper: any) {
    console.log(stepper.selectedIndex);
    let really = this;
    this.model.procedure.people = [];
    if (this.difunto.person.firstName && this.difunto.person.lastName) {
      this.model.procedure.people.push(this.difunto);
    }
    if (this.mother.person.firstName && this.mother.person.lastName) {
      this.model.procedure.people.push(this.mother);
    }
    if (this.father.person.firstName && this.father.person.lastName) {
      this.model.procedure.people.push(this.father);
    }
    if (this.declarante.person.firstName && this.declarante.person.lastName) {
      this.model.procedure.people.push(this.declarante);
    }
    console.log(this.model.procedure);
    this.procedureService.putProcedure(this.model.procedure.id, this.model.procedure).subscribe((response: any) => {
      // console.log(response);
      stepper.selectedIndex += 1;
      // Obtener ActorTypes
      if (stepper.selectedIndex == 3) {
        this.lookupService.getActorTypesByCertificateType(this.model.id).subscribe((response: any) => {
          this.actorTypes = response;
        });
      }
    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    })
  }
  addMargin() {
    let really = this;
    // console.log(margin.value);
    if (!this.margin.id) {
      this.margin.status = 'ACT';
      this.margin.certificate = {};
      this.margin.certificate.id = this.model.id;
      this.margin.procedureId = this.model.procedure.id;
      if (this.editarPersona == 'SI' && this.editActorType.person) {
        this.margin.people = [this.editActorType];
      }
      this.defuncionService.addMargin(this.margin).subscribe((response: any) => {
        // marginal.sentence = margin.value;
        console.log(response);
        let r = response;
        r.fileCount = 0;
        really.margins.push(r);
        really.dataSource = new MatTableDataSource(really.margins);
        $('#filesText').html('');
        this.actorType = {};
        this.margin = {};
        this.editActorType = {};
        if (really.filesMarginales && really.filesMarginales.target.files.length > 0) {
          Array.from(really.filesMarginales.target.files).forEach((element: any) => {
            really.uploadFile(element, response.id);
          })
        }
      }, error => {
        really.snackBarMessage(error.error.message, 5000);
      })
    }
    else {
      if (this.editarPersona == 'SI' && this.editActorType.person) {
        this.margin.people = [this.editActorType];
      }
      this.defuncionService.putMargin(this.margin).subscribe((response: any) => {
        //
        let obj: any = {};
        Object.assign(obj, really.margins[really.marginIndex]);
        really.margins[really.marginIndex] = response;
        really.margins[really.marginIndex].fileCount = obj.fileCount;
        this.dataSource = new MatTableDataSource(this.margins);
        $('#filesText').html('');
        this.margin = {};
        this.actorType = {};
        this.editActorType = {};
        if (really.filesMarginales && really.filesMarginales.target.files.length > 0) {
          Array.from(really.filesMarginales.target.files).forEach((element: any) => {
            really.uploadFile(element, response.id);
          })
        }
      }, error => {
        really.snackBarMessage(error.error.message, 5000);
      })
    }
    this.margin = {};
    this.editActorType = {};
  }
  deleteMargin(element: any, index: any) {
    let really = this;
    this.marginIndex = index;
    this.defuncionService.deleteMargin(element.id).subscribe((response: any) => {
      let obj: any = {};
      Object.assign(obj, really.margins[really.marginIndex]);
      really.margins[really.marginIndex] = response;
      really.margins[really.marginIndex].fileCount = obj.fileCount;
      console.log(really.margins);really.margins.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.margins);
    })
  }
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration,    panelClass: ['blue-snackbar']
    });
  }
  editMargin(element: any, index: any) {
    this.margin = element;
    this.marginIndex = index;
    if (element.people.length > 0) {
      this.editarPersona = 'SI'
      this.editActorType = element.people[0];
      this.actorType.code = element.people[0].actorType.code;
    }
    else {
      this.editarPersona = 'NO'
      this.editActorType = {};
    }
    // console.log('element', element);
    // console.log('index', index);
  }
  onFileChange(element: any) {
    console.log(element);
  }
  uploadFile(file: any, proceduretypeAttrId: any) {
    let really = this;
    let formData: FormData = new FormData();
    //// console.log('FILE', file);
    //formData.append('document', JSON.stringify(document));
    formData.append('file', file, file.name);
    formData.append('originalName', file.name);
    formData.append('procedureId', this.model.procedure.id.toString());
    formData.append('proceduretypeAttrId', proceduretypeAttrId);
    formData.append('mimeType', file.type);
    formData.append('code', 'MARG');
    console.log(file.name);

    ////// console.log('formData:' + formData);
    this.defuncionService.uploadFile(formData).subscribe((response: any) => {
      // really.margins[index].fileCount += 1;
      really.snackBarMessage('Se subio correctamente el Documento', 6000);

      $('#file-input').val('');
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    });
  }
  uploadFileActa(file: any, proceduretypeAttrId: any, index: any) {
    let really = this;
    let formData: FormData = new FormData();
    //// console.log('FILE', file);
    //formData.append('document', JSON.stringify(document));
    formData.append('file', file, file.name);
    formData.append('originalName', file.name);
    formData.append('procedureId', this.model.procedure.id.toString());
    formData.append('proceduretypeAttrId', this.model.id);
    formData.append('mimeType', file.type);
    formData.append('code', 'CERT');
    console.log(file.name);

    ////// console.log('formData:' + formData);
    this.defuncionService.uploadFile(formData).subscribe((response: any) => {
      // really.margins[index].fileCount += 1;
      really.fileActas.push(response);
      really.dataActasFiles = new MatTableDataSource(really.fileActas);
      really.snackBarMessage('Se subio correctamente el Documento', 6000);
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    });
  }
  addMarginFile(element: any, i: any) {
    // console.log(element);
    $('#file-input').click();
  }
  uploadFiles(ev: any) {
    // let really = this;
    console.log(ev);
    this.filesMarginales = ev;
    $('#filesText').html('Se adjuntaron: ' + ev.target.files.length + ' archivo/s.')
    // Array.from(ev.target.files).forEach((element: any) => {
    //   really.uploadFile(element, proceduretypeAttrId, index);
    // })
  }
  uploadFilesActa(ev: any, proceduretypeAttrId: any, index: any) {
    let really = this;
    Array.from(ev.target.files).forEach((element: any) => {
      really.uploadFileActa(element, proceduretypeAttrId, index);
    })
  }
  finalizarTramite() {
    let really = this;
    if (this.observations) {
      this.defuncionService.addObservation(this.model.id, this.observations).subscribe((response: any) => {
        //
        really.defuncionService.approveActa(really.model.id, really.model).subscribe((response: any) => {
          console.log(response);
          really.defuncionService.approveProcedure(really.model.procedure.id, really.model.procedure).subscribe((response: any) => {
            really.snackBarMessage('Se ha Aprobado con Éxito el Tramite', 5000);
            // really.openDialog();
            really.router.navigateByUrl('/starter');
          }, error => {
            really.snackBarMessage(error.error.message, 5000);
          })
        }, error => {
          really.snackBarMessage(error.error.message, 6000);
        })
      }, error => {
        really.snackBarMessage(error.error.message, 6000);

      })
    }
    else {
      this.defuncionService.approveActa(this.model.id, this.model).subscribe((response: any) => {
        console.log(response);
        really.defuncionService.approveProcedure(really.model.procedure.id, really.model.procedure).subscribe((response: any) => {
          really.snackBarMessage('Se ha Aprobado con Éxito el Tramite', 5000);
          // really.openDialog();
          really.router.navigateByUrl('/starter');
        }, error => {
          really.snackBarMessage(error.error.message, 5000);
        })
      }, error => {
        really.snackBarMessage(error.error.message, 6000);
      })

    }
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  selectActorType() {
    let really = this;
    // console.log(this.actorType);
    let actor: any = this.model.procedure.people.filter((element: any) => {
      return element.actorType.code == really.actorType.code;
    })
    if (actor.length == 0)
      this.snackBarMessage('No se encontraron datos del actor', 5000)
    else {
      this.editActorType = actor[0];
      console.log(this.editActorType);
    }

  }
  deleteFileActa(documentId: any) {
    let really = this;
    this.defuncionService.deleteFiles(documentId.id).subscribe((response: any) => {
      really.snackBarMessage('Archivo Eliminado con Éxito', 3000);
      really.fileActas = [];
      really.dataActasFiles = new MatTableDataSource(really.fileActas);
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }
  cancelarMargin() {
    $('#filesText').html('');
    $('#file-input').val('');
    this.margin = {};
    this.actorType = {};
    this.editActorType = {};
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
