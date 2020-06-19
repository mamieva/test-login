import { Component, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatStepper, MatCheckbox } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MigrateBorn } from '../services/migrateBorn.service';
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
import { AppSettings } from './../app.settings';

@Component({
  selector: 'recForzoso',
  templateUrl: './recForzoso.component.html',
  styleUrls: ['./recForzoso.component.scss']
})
export class recForzosoComponent implements AfterViewInit {
  model: any = { procedureTypeCode: "SOLICITUD_RECONOCIMIENTO_FORZOSO", procedureFromRequest: {}, procedureHasAttributeValues: [] };
  certificateId: any;
  indice: any = 0;
  isLinear = false;
  bloqueoActa: any = false;
  bloqueoReconocimiento: any = false;
  bloqueoSinOficio: any = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  // actaBloquear: any = { volume: {}, certificateTypeCode: "NACIMIENTO" };
  // actaReconocimiento: any = { volume: {}, certificateTypeCode: "RECONOCIMIENTO" };
  offices: any[] = [];
  states: any[] = [];
  departaments: any[] = [];
  cities: any[] = [];
  personTestigo_1: any = { find: true };
  personTestigo_2: any = { find: true };
  personVinculante: any = { find: true };
  personProgenitor_3: any = { find: true };
  personDeclarante: any = { find: true };
  personBorn: any = {};
  testigo_1: any = {
    actorType: {
      id: 4,
      code: "TESTIGO",
      relationship: { code: 'TESTIGO_1' },
    },
    person: {
      docType: {},
      address: {},
      birth: {}
    }
  };
  testigo_2: any = {
    actorType: {
      id: 4,
      code: "TESTIGO",
      relationship: { code: 'TESTIGO_2' },
    },
    person: {
      docType: {},
      address: {},
      birth: {}
    }
  }
  vinculante: any = {
    actorType: {
      id: 4,
      code: "VINCULANTE",
      relationship: {},
    },
    person: {
      docType: {},
      birth: {},
      address: {}
    }
  }
  progenitor_3: any = {
    actorType: {
      id: 4,
      code: "PROGENITOR_3"
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
  born: any = {
    actorType: {
      id: 4,
      code: "RECIEN_NACIDO",
      relationship: {}
    },
    person: {
      docType: { code: 'DOC_DNI' },
      address: { city: {} },
      birth: { address: { city: {} } }
    }
  }
  documentScanned: any = {}; fileSelected: any;
  pdfValidate: any = {};
  pdfCertificate: any = {};
  margin: any = {};
  margins: any[] = [];
  marginIndex: any;
  displayedColumns: any;
  displayedColumnsVinculantes: any;
  displayColumnActa: any;
  dataSource: any;
  dataSourceVinculantes: any;
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
  provincia: any = {};
  department: any = {};
  numberOfBirths: any;
  vinculantes: any[] = [];
  civilStatus: any[] = [];
  validate: any = false;
  finalizado: any = false;
  documents: any[] = [];
  attachmentFiles: any[] = [];
  attachmentTypeFile: any = {};
  adoptionTypes: any[] = [];
  procedureHasAttributeValues: any = {
    sentence_number: { code: 'SENTENCE_NUMBER' },//
    sentencing_date: { code: 'SENTENCING_DATE' },//
    tribunal: { code: 'TRIBUNAL' },//
    // secretary: { code: 'SECRETARY' },
    // secretary_name: { code: 'SECRETARY_NAME' },
    official_date: { code: 'OFFICIAL_DATE' },//
    official_document: { code: 'OFFICIAL_DOCUMENT' },//
    // incised_number: { code: 'INCISED_NUMBER' },
    // court_order_number: { code: 'COURT_ORDER_NUMBER' },
    // court_orders: { code: 'COURT_ORDERS' },
    // judgment_text: { code: 'JUDGMENT_TEXT' },
    judge_name: { code: 'JUDGE_NAME' },//
    state_name: { code: 'STATE_NAME' },//
    // adoption_type: { code: 'ADOPTION_TYPE' }
  }
  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private bornService: MigrateBorn,
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
    });
    let department = JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.offices[0].city ? JSON.parse(localStorage.getItem('currentUser')).authToken.claims.scopes.offices[0].city.department.id : 482;
    let nuevo = localStorage.getItem('nuevoTramite');

    if (this.certificateId) {
      if (nuevo) {
        this.indice = 0;
        this.indice = 1;
        localStorage.removeItem('nuevoTramite');
      }
      this.procedureService.getProcedure(this.certificateId).subscribe((response: any) => {
        this.model = response;
        response.people.forEach((element: any) => {
          if (element.actorType.relationship.code == 'TESTIGO_1')
            this.testigo_1 = element;
          if (element.actorType.relationship.code == 'TESTIGO_2')
            this.testigo_2 = element;
          // if (element.actorType.code == 'vinculante')
          //   this.vinculante = element;
          // if (element.actorType.code == 'PROGENITOR_3')
          //   this.progenitor_3 = element;
          // if (element.actorType.code == 'DECLARANTE') {
          //   this.declarante = element;
          //   // this.wife.person.birth.address = { city: {} }
          // }
          if (!response.procedureFromRequest) {
            this.model.procedureFromRequest = {};
          }
          if (element.actorType.code == 'VINCULANTE') {
            this.vinculantes.push(element);
            this.dataSourceVinculantes = new MatTableDataSource(this.vinculantes);
          }
          // if (element.actorType.code.indexOf('TESTIGO_') >= 0) {
          //   this.testigos.push(element)
          //   // this.husband = element;
          //   // this.husband.person.birth.address = { city: {} }
          // }
          // if (element.actorType.code == 'DECLARANTE')
          //   this.declarante = element;
        });

        this.matchDocuments();
        response.procedureHasAttributeValues.forEach((element: any) => {
          let aux: string = element.code;
          element.id = null;
          this.procedureHasAttributeValues[aux.toLowerCase()] = element;
          console.log(this.procedureHasAttributeValues);
        })
        //Obtener Documentos
        // this.procedureService.getDocumentsByProcedure(this.model.id).subscribe((response: any) => {
        //   this.documents = response;
        //   this.dataSource = new MatTableDataSource(this.documents);
        // }, error => {
        //   if (error.error.status != 409)
        //     this.snackBarMessage(error.error.message, 6000);
        // })
      })
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
    //Obtener Relaciones
    this.lookupService.getRelationshipAdoption().subscribe((response: any) => {
      this.relationships = response;
    })
    //Obtener tipos de recForzoso
    this.lookupService.getAdoptionTypes().subscribe((response: any) => {
      this.adoptionTypes = response;
    })

    //Obtener Estados Civil.
    this.lookupService.getCivilStatus().subscribe((response: any) => {
      this.civilStatus = response;
    })
    // Obtener Oficinas
    this.officeService.getOffices().subscribe((response: any) => {
      this.offices = response;
    });
    // Obtener tipos de archivos 
    this.lookupService.getAttachmentType('SOLICITUD_ADOPCION').subscribe((response: any) => {
      this.attachmentFiles = response;
    });
    // Obtener Estados
    // this.stateService.getStatesByCountry(1).subscribe((response: any) => {
    //   this.states = response;
    //   this.provincia.id = 20;
    //   this.stateService.getDepartamentsByState(20).subscribe((responseDp: any) => {
    //     this.departaments = responseDp;
    //   })
    // });
    // this.stateService.getCitiesByState(department).subscribe((response: any) => {
    //   this.cities = response;
    // })
    // Obtener ActorTypes
    // this.lookupService.getActorTypesByProcedureType('NACIMIENTO').subscribe((response: any) => {
    //   this.actorTypes = response;
    // });
    //
    this.displayedColumns = ['Archivo', 'Obligatorio', 'action'];
    this.dataSource = new MatTableDataSource(this.documents);
    this.displayedColumnsVinculantes = ['Nombre', 'Virtud', 'Accion'];
    this.dataSourceVinculantes = new MatTableDataSource(this.vinculantes);
    this.displayColumnActa = ['Archivo', 'Acciones'];
    this.dataActasFiles = new MatTableDataSource(this.fileActas);
  }
  ngAfterViewInit() { }
  resetStepper(stepper: MatStepper) {
    stepper.selectedIndex = 0;
  }
  postTestigo_1() {
    let really = this;
    this.personService.postPerson(this.testigo_1.person).subscribe((response: any) => {
      really.personTestigo_1.docNumber = response.docNumber;
      really.personTestigo_1.sex = response.sex;
      really.findTestigo_1();
    }, error =>
        really.snackBarMessage(error.error.message, 5000))
  }
  findTestigo_1() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personTestigo_1.docNumber, this.personTestigo_1.sex).subscribe((response: any) => {
      // console.log(response);
      really.testigo_1.person = response;
      really.personTestigo_1.find = true;

    }, error => {
      really.testigo_1.person = {
        docType: {},
        birth: {},
        address: {}
      };
      really.personTestigo_1.find = false;
      really.snackBarMessage(error.error.message, 5000);
    })
  }
  findTestigo_2() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personTestigo_2.docNumber, this.personTestigo_2.sex).subscribe((response: any) => {
      // console.log(response);
      really.testigo_2.person = response;
      really.personTestigo_2.find = true;

    }, error => {
      really.testigo_2.person = {
        docType: {},
        birth: {},
        address: {}
      };
      really.personTestigo_2.find = false;
      really.snackBarMessage(error.error.message, 5000);
    })
  }
  postVinculante() {
    let really = this;
    this.personService.postPerson(this.vinculante.person).subscribe((response: any) => {
      really.personVinculante.docNumber = response.docNumber;
      really.personVinculante.sex = response.sex;
      really.findVinculante();
    }, error =>
        really.snackBarMessage(error.error.message, 5000))
  }
  findVinculante() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personVinculante.docNumber, this.personVinculante.sex).subscribe((response: any) => {
      // console.log(response);
      really.vinculante.person = response;
      really.personVinculante.find = true;

    }, error => {
      really.vinculante.person = {
        docType: {},
        birth: {},
        address: {}
      };
      really.personVinculante.find = false;
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  postProgenitor_3() {
    let really = this;
    this.personService.postPerson(this.progenitor_3.person).subscribe((response: any) => {
      really.personProgenitor_3.docNumber = response.docNumber;
      really.personProgenitor_3.sex = response.sex;
      really.findProgenitor_3();
    }, error =>
        really.snackBarMessage(error.error.message, 5000))
  }
  findProgenitor_3() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personProgenitor_3.docNumber, this.personProgenitor_3.sex).subscribe((response: any) => {
      // console.log(response);
      really.progenitor_3.person = response;
      really.personProgenitor_3.find = true;

    }, error => {
      really.progenitor_3.person = {
        docType: {},
        birth: {},
        address: {}
      };
      really.personProgenitor_3.find = false;
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  postDeclarante() {
    let really = this;
    this.personService.postPerson(this.declarante.person).subscribe((response: any) => {
      really.personDeclarante.docNumber = response.docNumber;
      really.personDeclarante.sex = response.sex;
      really.findDeclarante();
    }, error =>
        really.snackBarMessage(error.error.message, 5000))
  }
  findDeclarante() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personDeclarante.docNumber, this.personDeclarante.sex).subscribe((response: any) => {
      // console.log(response);
      really.declarante.person = response;
      really.personDeclarante.find = true;

    }, error => {
      really.declarante.person = {
        docType: {},
        birth: {},
        address: {}
      };
      really.personDeclarante.find = false;
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  findBorn() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personBorn.docNumber, this.personBorn.sex).subscribe((response: any) => {
      // console.log(response);
      really.born.person = response;
      // really.born.person.birth.address = { city: {} }

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
  updateProcedure(validate: any) {
    // console.log('indice', this.indice);
    let really = this;
    this.model.people = [];
    // if (this.born.person.firstName && this.born.person.lastName && this.born.person.birth.address.city.id) {
    //   this.model.people.push(this.born);
    // }
    if (this.testigo_1.person.firstName && this.testigo_1.person.lastName) {
      this.model.people.push(this.testigo_1);
    }
    if (this.testigo_2.person.firstName && this.testigo_2.person.lastName) {
      this.model.people.push(this.testigo_2);
    }
    // if (this.vinculante.person.firstName && this.vinculante.person.lastName) {
    //   this.model.people.push(this.vinculante);
    // }
    // if (this.progenitor_3.person.firstName && this.progenitor_3.person.lastName) {
    //   this.model.people.push(this.progenitor_3);
    // }
    // if (this.declarante.person.firstName && this.declarante.person.lastName) {
    //   this.model.people.push(this.declarante);
    // }
    if (this.showVinculante()) {
      if (this.vinculantes.length > 0) {
        this.vinculantes.forEach((element, index) => {
          let i = index + 1;
          // element.actorType.relationship.code = 'HERMANO_' + i;
          this.model.people.push(element);
        });
      }
    }
    // let values = Object.values(this.procedureHasAttributeValues);
    this.model.procedureHasAttributeValues = Object.values(this.procedureHasAttributeValues);
    if (!this.model.id) {
      // this.model.office = {};
      // this.model.office.id = JSON.parse(localStorage.getItem('currentOffice')).id;
      this.model.officeId = JSON.parse(localStorage.getItem('currentOffice')).id;
      this.procedureService.postProcedure(this.model).subscribe((response: any) => {
        really.model = response;
        // debugger
        really.matchDocuments();
        localStorage.setItem('nuevoTramite', 'SI');
        // window.location.href += '/' + response.id; 
        really.router.navigateByUrl('recForzoso/' + response.id);
        // stepper.selectedIndex += 1;
        really.indice += 1;
      }, error => {
        really.snackBarMessage(error.error.message, 5000);
      })
    }
    else {
      // // console.log(this.model);
      this.procedureService.putProcedure(this.model.id, this.model).subscribe((response: any) => {
        // // console.log(response);
        really.model = response;

        really.matchDocuments();
        // Obtener ActorTypes
        // if (really.indice == 3 && this.numberOfBirths > this.vinculantes.length) {
        //   really.indice = 3;
        //   really.snackBarMessage('Ingrese todos los Vinculantes correspondientes', 5000);
        // }
        // if (really.indice != 3) {
        // if (!validate)
        really.indice += 1;
        // // }
        // if (validate) {
        really.validate = true;
        //   really.procedureService.getValidationPDF(really.model.id).subscribe((response: any) => {
        //     // console.log(response);
        //     really.pdfValidate = response;
        //     // console.log($('#download'));
        //     // .click();
        //   }, error => {
        //     really.snackBarMessage(error.error.message, 5000);
        //   });
        // }
      }, error => {
        really.snackBarMessage(error.error.message, 5000);
      })
    }
  }
  showVinculante() {
    // if (this.procedureHasAttributeValues.adoption_type.value == 'SIMPLE_INTEGRACION' || this.procedureHasAttributeValues.adoption_type.value == 'PLENA_INTEGRACION')
    //   return true;
    return false;
  }
  addVinculante() {
    let nada: any;
    // debugger
    // if (this.numberOfBirths && this.vinculantes.length < this.numberOfBirths) {
    let aux_texto = JSON.stringify(this.vinculante);
    if (this.vinculante.person.lastName && this.vinculante.person.firstName && this.vinculante.person.docNumber && this.vinculante.person.sex && this.vinculante.person.birth.birthDay && this.vinculante.actorType.relationship.code) {
      this.vinculantes.push(JSON.parse(aux_texto));
      // this.model.people.push(nacido);
      this.dataSourceVinculantes = new MatTableDataSource(this.vinculantes);
      this.vinculante = {
        actorType: {
          id: 4,
          code: "VINCULANTE",
          relationship: {},
        },
        person: {
          docType: {},
          birth: {},
          address: {}
        }
      };
      this.personVinculante = { find: true };
      // // console.log(this.model.people);
      this.snackBarMessage('Agregado con Éxito', 5000);
    }
    else {
      this.snackBarMessage('Ingrese todos los Datos del Vinculante', 5000);
      return null;
    }
    // if (this.numberOfBirths > this.vinculantes.length) {
    //   this.snackBarMessage('Agregado con Éxito, le faltan ' + (this.numberOfBirths - this.vinculantes.length) + ' nacido/s', 5000);
    // }
    // else {
    //   this.snackBarMessage('Ha agregado todos los vinculantes correspondientes', 5000);
    // }
    this.born.person.firstName = '';
    this.born.person.birth.birthHour = null;
    // console.log('aux', aux_texto);
    // console.log('born', this.born);

    // else if (!this.numberOfBirths) {
    //   this.snackBarMessage('Debe indicar la cantidad de Nacimientos', 5000);
    // }
    // else {
    //   this.snackBarMessage('No puede agregar el Vinculante, ya completó todos los nacimientos', 5000);
    // }
  }
  deleteVinculante(element: any, index: any) {
    this.vinculantes.splice(index, 1);
    this.snackBarMessage('Eliminado con Éxito', 5000);
    this.dataSourceVinculantes = new MatTableDataSource(this.vinculantes);
  }
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration, panelClass: ['blue-snackbar']
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
  }
  onFileChange(element: any) {
    // console.log(element);
  }
  // uploadFile(file: any, proceduretypeAttrId: any) {
  //   let really = this;
  //   let formData: FormData = new FormData();
  //   formData.append('file', file, file.name);
  //   formData.append('originalName', file.name);
  //   formData.append('procedureId', this.model.id.toString());
  //   formData.append('proceduretypeAttrId', proceduretypeAttrId);
  //   formData.append('mimeType', file.type);
  //   formData.append('code', 'MARG');
  //   // console.log(file.name);
  //   this.bornService.uploadFile(formData).subscribe((response: any) => {
  //     // really.margins[index].fileCount += 1;
  //     really.snackBarMessage('Se subio correctamente el Documento', 6000);

  //     $('#file-input').val('');
  //   }, error => {
  //     really.snackBarMessage(error.error.message, 6000);
  //   });
  // }
  uploadFileActa(file: any, proceduretypeAttrId: any, index: any) {
    let really = this;
    let formData: FormData = new FormData();
    //// // console.log('FILE', file);
    //formData.append('document', JSON.stringify(document));
    formData.append('file', file, file.name);
    formData.append('originalName', file.name);
    formData.append('procedureId', this.model.id.toString());
    formData.append('proceduretypeAttrId', this.model.id);
    formData.append('mimeType', file.type);
    formData.append('code', 'CERT');
    // console.log(file.name);

    ////// // console.log('formData:' + formData);
    this.bornService.uploadFile(formData).subscribe((response: any) => {
      // really.margins[index].fileCount += 1;
      really.fileActas.push(response);

      really.dataActasFiles = new MatTableDataSource(really.fileActas);
      really.snackBarMessage('Se subio correctamente el Documento', 6000);
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    });
  }
  addMarginFile(element: any, i: any) {
    // // console.log(element);
    $('#file-input').click();
  }
  uploadFiles(ev: any) {
    // let really = this;
    // console.log(ev);
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
    let proced: any = {};
    proced.procedureId = this.model.id;
    proced.observations = this.model.observations;
    //
    this.procedureService.putProcedureFromRequest(this.model).subscribe((procedure: any) => {
      this.procedureService.postCertificateProcedure(proced.procedureId, really.model.tasks.current.id, proced).subscribe((response: any) => {
        really.finalizado = true;
      }, error => {
        really.snackBarMessage(error.error.message, 6000);
      })
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })

    // this.procedureService.postCertificate(proced.procedureId, proced).subscribe((response: any) => {
    //   // console.log(response);
    //   really.procedureService.getCertificatePDF(proced.procedureId).subscribe((pdfCertificate: any) => {
    //     really.pdfCertificate = pdfCertificate;
    //     this.procedureService.postCertificateProcedure(proced.procedureId, really.model.tasks.current.id, proced).subscribe((response: any) => {
    //       really.finalizado = true;
    //     }, error => {
    //       really.snackBarMessage(error.error.message, 6000);
    //     })
    //     // // console.log(pdfCertificate);
    //   }, error => {
    //     really.snackBarMessage(error.error.message, 6000);
    //   })
    // }, error => {
    //   really.snackBarMessage(error.error.message, 6000);
    // })
  }
  backStep() {
    this.indice -= 1;
  }
  cambioIndice(ev: any) {
    this.indice = ev.selectedIndex;
  }
  openDialog(): void {
    let dialogRef = this.dialog.open(newPersonDialog, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  selectActorType() {
    let really = this;
    // // console.log(this.actorType);
    let actor: any = this.model.people.filter((element: any) => {
      return element.actorType.code == really.actorType.code;
    })
    if (actor.length == 0)
      this.snackBarMessage('No se encontraron datos del actor', 5000)
    else {
      this.editActorType = actor[0];
      // // console.log(this.editActorType);
    }

  }
  deleteFileActa(documentId: any) {
    let really = this;
    this.bornService.deleteFiles(documentId.id).subscribe((response: any) => {
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
  validatePDF() {
    let really = this;

    // this.updateProcedure();
  }
  openNewPerson() {
    let dialogRef = this.dialog.open(newPersonDialog, {
      width: '700px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }
  backToInbox() {
    this.router.navigateByUrl('/starter');
  }
  nextStep() {
    this.router.navigateByUrl('/procedure/' + this.model.id)
  }
  changeLastNames(ev: any, ele: any) {
    console.log(ev);
    this[ele].person.lastName = ev.lastName;
    this[ele].person.secondLastName = ev.secondLastName;
    console.log(this[ele]);
  }
  updatePerson(person: any) {
    let really = this;
    this.personService.putPerson(this[person].person.id, this[person].person).subscribe((response: any) => {
      really.snackBarMessage('Actualizado con Éxito', 5000);
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }

  matchDocuments() {
    //obtener tipos de doc.
    this.procedureService.getDocumentTypeByProcedure(this.model.id).subscribe((docTypes: any) => {
      this.attachmentFiles = docTypes;
      this.dataSource = new MatTableDataSource(this.attachmentFiles);
      this.procedureService.getDocumentsByProcedure(this.model.id).subscribe((documents: any) => {
        // documents;
        docTypes.map((element) => {
          documents.forEach(doc => {
            if (doc.code == element.code) {
              element.digitalized = true;
              element.documentId = doc.id;
              element.validAddPage = doc.validAddPage;
              element.mimeType = doc.mimeType;
              element.fileName = doc.name;
            }
          });
          return element;
        });
      }, error => {
        if (error.error.status != 409)
          this.snackBarMessage(error.error.message, 6000);
      })
    })

  }
  digitalize(documentType: any, addPage?: any) {
    // this.disabledButton = true;
    let really = this;
    let imagen = '';
    let cant = 0;

    // var ws = new WebSocket('ws://127.0.0.1:9998');
    // var ws = new WebSocket('ws://192.168.0.34:9998');
    // var ws = new WebSocket('ws://192.168.0.25:9998');
    var ws = new WebSocket(`ws://${AppSettings.SCANNER_ENDPOINT}`);
    ws.binaryType = "arraybuffer";
    ws.onopen = function (event) {
      //alert('onopen');
      ws.send("TEST!!!");
    };

    ws.onmessage = function (evt: any) {
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
        //console.log(out.length);

        really.snackBarMessage('Documento recibido, Subiendo!', 6000);
        really.uploadFile(out, documentType.code, documentType.documentId, addPage);
      }
      else {
        imagen += evt.data;
        cant++;

      }
    };
    ws.onclose = function () {
      // really.disabledButton = false;
      // websocket is closed.

      // really.snackBarMessage('Se cerró la conexión con el scanner', 6000);
      // alert("Connection is closed...");
    };
    ws.onerror = function (event) {
      // really.disabledButton = false;
      really.snackBarMessage('Se Produjo un Error, intente nuevamente', 6000);
      // websocket is closed.
      // alert("Error");
    };
  }
  deleteFilesDoc(document: any) {
    let really = this;
    this.procedureService.deleteFiles(document.documentId).subscribe((response: any) => {
      this.snackBarMessage('Documento eliminado con Éxito', 6000);
      really.matchDocuments();
      really.closePreviewDoc();
      // really.procedureService.getDocumentsByProcedure(really.model.id).subscribe((documents: any) => {
      //   really.documents = documents;
      //   really.dataSource = new MatTableDataSource(really.documents);
      // }, error => {
      //   if (error.error.status != 409)
      //     this.snackBarMessage(error.error.message, 6000);
      // })
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    })
  }
  getDocument(element: any, download?: any) {
    let really = this;
    // this.documentScanned = {};
    this.procedureService.getDocument(element.documentId).subscribe((response: any) => {
      really.documentScanned = response;
      really.documentScanned.download = false;
      if (download) {
        really.documentScanned.download = true;
        document.getElementById('download' + element.id).click();
      }
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }
  btnDownloadAttach(element: any) {
    if (element.mimeType) {
      if (element.mimeType.indexOf('image') >= 0 || element.mimeType.indexOf('pdf') >= 0) {
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }
  closePreviewDoc() {
    this.documentScanned = {};
  }
  downloadDocument(element: any) {
    let really = this;
    // this.documentScanned = {};
    this.procedureService.getDocumentDownload(this.model.id, element.documentId).subscribe((response: any) => {
      // debugger
      var binaryData = [];
      binaryData.push(response);
      var a = document.createElement('a');
      var url = window.URL.createObjectURL(new Blob(binaryData, { type: element.mimeType }));
      a.href = url;
      a.download = element.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }

  addFileAttachment(element: any) {
    this.fileSelected = element;
    $('#file-input').click();
  }
  uploadFilesAttachment(file: any) {
    // let really = this;
    let really = this;
    let formData: FormData = new FormData();
    //// // console.log('FILE', file);
    //formData.append('document', JSON.stringify(document));
    formData.append('file', file.target.files[0], file.target.files[0].name);
    formData.append('originalName', file.name);
    formData.append('procedureId', this.model.id.toString());
    formData.append('code', this.fileSelected.code);
    this.procedureService.uploadAttachmentProcedureFile(formData).subscribe((response: any) => {
      really.snackBarMessage('Archivo Adjuntado con Éxito!', 6000);
      really.fileSelected = {}
      really.matchDocuments();
    }, error => {
      really.fileSelected = {}
      this.snackBarMessage(error.error.message, 6000);
    })
  }

  uploadFile(base64: any, attachmentType: any, documentId?: any, addPage?: any) {
    let really = this;
    let file = {
      procedureId: this.model.id,
      documentType: attachmentType,
      id: documentId && addPage ? documentId : null,
      compressBase64: base64
    };
    // console.log(file);
    this.procedureService.uploadAttachmentProcedure(file).subscribe((response: any) => {
      // debugger
      // really.disabledButton = false;
      // really.model.certificates[index] = response.certificate;
      // really.certificates = new MatTableDataSource(really.model.certificates);

      really.matchDocuments();
      // really.procedureService.getDocumentsByProcedure(really.model.id).subscribe((documents: any) => {
      //   really.documents = documents;

      //   really.matchDocuments();
      //   really.dataSource = new MatTableDataSource(really.documents);
      // }, error => {
      //   if (error.error.status != 409)
      //     this.snackBarMessage(error.error.message, 6000);
      // })
      this.snackBarMessage('Archivo digitalizado con Éxito', 6000);
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    });
  }
  deleteFiles(document: any) {
    let really = this;
    this.procedureService.deleteFiles(document.id).subscribe((response: any) => {
      this.snackBarMessage('Documento eliminado con Éxito', 6000);
      // really.procedureService.getDocumentsByProcedure(really.model.id).subscribe((documents: any) => {
      //   really.documents = documents;
      //   really.dataSource = new MatTableDataSource(really.documents);
      // }, error => {
      //   if (error.error.status != 409)
      //     this.snackBarMessage(error.error.message, 6000);
      // })
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    })
  }

}

@Component({
  selector: 'newPerson-dialog',
  templateUrl: 'recForzosoModal.component.html'
})
export class newPersonDialog {

  constructor(
    public dialogRef: MatDialogRef<newPersonDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
