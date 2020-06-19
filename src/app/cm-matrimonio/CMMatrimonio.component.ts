import { Component, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatStepper, MatCheckbox } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MigrateMatrimonio } from '../services/migrateMatrimonio.service';
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
  selector: 'CMMatrimonio',
  templateUrl: './CMMatrimonio.component.html',
  styleUrls: ['./CMMatrimonio.component.scss']
})
export class CMMatrimonioComponent implements AfterViewInit {
  model: any = { procedureTypeCode: "MATRIMONIO", procedureHasAttributeValues: [] };
  certificateId: any;
  filteredOptions: Observable<any>;
  OperatorCtrl: FormControl = new FormControl();
  isLinear = true;
  indice: any = 0;
  bloqueoActa: any = false;
  bloqueoReconocimiento: any = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  seventhFormGroup: FormGroup;
  acta: any = {
    office: {},
    volume: {}, certificateTypeCode: "MATRIMONIO"
  };
  // actaBloquear: any = { volume: {}, certificateTypeCode: "NACIMIENTO" };
  // actaReconocimiento: any = { volume: {}, certificateTypeCode: "RECONOCIMIENTO" };
  offices: any[] = [];
  states_1: any[] = [];
  states_2: any[] = [];
  departments_1: any[] = [];
  departments_2: any[] = [];
  finalizado: any = false;
  department: any = {};
  countries: any[] = [];
  cities_1: any[] = [];
  cities_2: any[] = [];
  personWife: any = { find: true };
  personMotherWife: any = { find: true };
  personFatherWife: any = { find: true };
  personDeclarante: any = { find: true };
  personOponente: any = { find: true };
  personHusband: any = { find: true };
  personMotherHusband: any = { find: true };
  personFatherHusband: any = { find: true };
  motherWife: any = {
    actorType: {

      code: "CONTRAYENTE_2_PROGENITOR_2"
    },
    person: {
      docType: {},
      address: {},
      birth: { address: {} },
      civilStatus: {}
    }
  }
  fatherWife: any = {
    actorType: {

      code: "CONTRAYENTE_2_PROGENITOR_1"
    },
    person: {
      docType: {},
      birth: { address: {} },
      address: {},
      civilStatus: {}
    }
  }
  motherHusband: any = {
    actorType: {
      code: "CONTRAYENTE_1_PROGENITOR_2"
    },
    person: {
      docType: {},
      address: {},
      birth: { address: {} },
      civilStatus: {}
    }
  }
  fatherHusband: any = {
    actorType: {
      code: "CONTRAYENTE_1_PROGENITOR_1"
    },
    person: {
      docType: {},
      address: {},
      birth: { address: {} },
      civilStatus: {}
    }
  }
  declarante: any = {
    actorType: {
      code: ""
    },
    person: {
      docType: {},
      address: {},
      birth: { address: {} },
      civilStatus: {}
    }
  }
  oponente: any = {
    actorType: {
      code: ""
    },
    person: {
      docType: {},
      address: {},
      birth: { address: {} },
      civilStatus: {}
    }
  }
  husband: any = {
    actorType: {

      code: "CONTRAYENTE_1",
      relationship: {}
    },
    person: {
      docType: {},
      address: { city: {}, country: {} },
      birth: { address: { city: {}, country: {} } },
      death: { address: { city: {}, country: {} } },
      civilStatus: {}
    }
  }
  wife: any = {
    actorType: {

      code: "CONTRAYENTE_2",
      relationship: {}
    },
    person: {
      docType: {},
      address: { city: {}, country: {} },
      birth: { address: { city: {}, country: {} } },
      death: { address: { city: {}, country: {} } },
      civilStatus: {}
    }
  }
  margin: any = {};
  margins: any[] = [];
  marginIndex: any;
  displayedColumns: any;
  displayColumnActa: any;
  displayedColumnsTestigos: any;
  dataSource: any;
  dataSourceTestigos: any;
  dataSourceOponentes: any;
  dataActasFiles: any;
  documentTypes: any[] = [];
  relationships: any[] = [];
  relationshipsOpponents: any[] = [];
  motivesOpponents: any[] = [];
  testigos: any[] = [];
  oponentes: any[] = [];
  fileActas: any[] = [];
  filesMarginales: any;
  filesAttachment: any[] = [];
  attachmentFiles: any[] = [];
  actorTypes: any[] = [];
  actorType: any = {};
  editarPersona: any = 'NO';
  editActorType: any = {};
  observations: any = {};
  operatorsSign: any[] = [];
  civilStatus: any[] = [];
  provincia: any = {};
  documentScanned: any = {};
  fileSelected: any = {};
  pdfCertificate: any = {};
  pdfValidate: any = {};
  validate = false;
  auxAttributesOponentes: any[] = [{
    name: "Motivo de la oposición",
    code: "OPPOSITION_MOTIVE",
    value: "",
    enableForEdit: false,
    type: "text"
  },
  {
    name: "Descripción de la oposición",
    code: "OPPOSITION_DESCRIPTION",
    value: "",
    enableForEdit: false,
    type: "text"
  }]

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private matrimonioService: MigrateMatrimonio,
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
        // Traer Atributos del Tramite        
        this.procedureService.getAttributesProcedure(response.id).subscribe((attributes: any) => {
          this.model.procedureHasAttributeValues = attributes;
        })
        response.people.forEach((element: any) => {
          if (element.actorType.code == 'CONTRAYENTE_2_PROGENITOR_1')
            this.motherWife = element;
          if (element.actorType.code == 'CONTRAYENTE_2_PROGENITOR_2')
            this.fatherWife = element;
          if (element.actorType.code == 'CONTRAYENTE_1_PROGENITOR_1')
            this.fatherHusband = element;
          if (element.actorType.code == 'CONTRAYENTE_1_PROGENITOR_2')
            this.motherHusband = element;
          if (element.actorType.code == 'CONTRAYENTE_2') {
            this.wife = element;
            // this.wife.person.birth.address = { city: {}, country:{} }
          }
          if (element.actorType.code == 'CONTRAYENTE_1') {
            this.husband = element;
            // this.husband.person.birth.address = { city: {}, country:{} }
          }
          if (element.actorType.code.indexOf('TESTIGO_') >= 0) {
            this.testigos.push(element)
            this.dataSourceTestigos = new MatTableDataSource(this.testigos);
            // this.husband = element;
            // this.husband.person.birth.address = { city: {}, country:{} }
          }
          if (element.actorType.code.indexOf('OPONENTE') >= 0) {
            this.oponentes.push(element)
            this.dataSourceOponentes = new MatTableDataSource(this.oponentes);
            // this.husband = element;
            // this.husband.person.birth.address = { city: {}, country:{} }
          }
          // if (element.actorType.code == 'DECLARANTE')
          //   this.declarante = element;
        });
        this.matchDocuments();
      });

    }
    // $("#snav").toggle();
    this.firstFormGroup = this._formBuilder.group({
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
    this.seventhFormGroup = this._formBuilder.group({
      // sixthCtrl: ['', Validators.required]
    });
    //Obtener Tipos de Docu.
    this.lookupService.getDocumentType().subscribe((response: any) => {
      this.documentTypes = response;
    })
    //Obtener Relaciones
    this.lookupService.getRelationship().subscribe((response: any) => {
      this.relationships = response;
    })
    //Obtener Relaciones
    this.lookupService.getRelationshipOpponents().subscribe((response: any) => {
      this.relationshipsOpponents = response;
    })
    //Obtener Motivos de Oposición
    this.lookupService.getOppositionMotives().subscribe((response: any) => {
      this.motivesOpponents = response;
    })

    //Obtener Estados Civil.
    this.lookupService.getCivilStatus().subscribe((response: any) => {
      this.civilStatus = response;
    })
    // Obtener Oficinas
    this.officeService.getOffices().subscribe((response: any) => {
      this.offices = response;
    });
    //Obtener Paises
    this.stateService.getCountries().subscribe((response: any) => {
      this.countries = response;
    })
    // // Obtener Estados
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

    // Obtener tipos de attributes 
    if (!this.model.id) {
      this.procedureService.getAttributesProcedureByCode('MATRIMONIO').subscribe((attr: any) => {
        this.model.procedureHasAttributeValues = attr;
      }, error => {
        this.snackBarMessage(error.error.message, 4000)
      });
    }
    //Obtener ActorTypes
    // this.lookupService.getActorTypesByProcedureType('NACIMIENTO').subscribe((response: any) => {
    //   this.actorTypes = response;
    // });
    //

    this.displayedColumns = ['Archivo', 'Obligatorio', 'action'];
    this.displayedColumnsTestigos = ['Documento', 'Apellido y Nombre', 'Acciones'];
    // this.dataSource = new MatTableDataSource(this.margins);
    // this.displayColumnActa = ['Archivo', 'Acciones'];
    // this.dataActasFiles = new MatTableDataSource(this.fileActas);

  }
  getStatesByCountry(country: any, render: any) {
    this.stateService.getStatesByCountry(country).subscribe((response: any) => {
      this[render] = response;
    });
  }
  getDepartmentsByState(state: any, render: any) {
    this.stateService.getDepartamentsByState(state).subscribe((responseDp: any) => {
      this[render] = responseDp;
    })
  }
  getCitiesByDepartment(departament: any, render: any) {
    this.stateService.getCitiesByState(departament).subscribe((response: any) => {
      this[render] = response;
    })
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
  findMotherWife() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personMotherWife.docNumber, this.personMotherWife.sex).subscribe((response: any) => {
      console.log(response);
      really.motherWife.person = response;
      really.motherWife.person.birth.address = { city: {}, country: {} }
    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    })
  }
  findFatherWife() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personFatherWife.docNumber, this.personFatherWife.sex).subscribe((response: any) => {
      console.log(response);
      really.fatherWife.person = response;
      really.fatherWife.person.birth.address = { city: {}, country: {} }
    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  findMotherHusband() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personMotherHusband.docNumber, this.personMotherHusband.sex).subscribe((response: any) => {
      console.log(response);
      really.motherHusband.person = response;
      really.motherHusband.person.birth.address = { city: {}, country: {} }
    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    })
  }
  findFatherHusband() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personFatherHusband.docNumber, this.personFatherHusband.sex).subscribe((response: any) => {
      console.log(response);
      really.fatherHusband.person = response;
      really.fatherHusband.person.birth.address = { city: {}, country: {} }
    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  findDeclarante() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personDeclarante.docNumber, this.personDeclarante.sex).subscribe((response: any) => {
      console.log(response);
      really.declarante.person = response;
      // really.declarante.person.age = '';
      really.declarante.person.birth.address = { city: {}, country: {} }
    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  findWife() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personWife.docNumber, this.personWife.sex).subscribe((response: any) => {
      console.log(response);
      really.wife.person = response;
      // really.wife.person.age = '';
      really.personWife.find = true;
      // really.wife.person.birth.address = { city: {}, country: {} }
      // really.wife.person.death.address = { city: {}, country: {} }

    }, error => {
      really.personWife.find = false;
      really.wife.person = {
        docType: {},
        birth: { address: { city: {}, country: {} } },
        death: { address: { city: {}, country: {} } },
        address: {}
      };
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  findHusband() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personHusband.docNumber, this.personHusband.sex).subscribe((response: any) => {
      console.log(response);
      really.husband.person = response;
      // really.husband.person.age = '';
      really.husband.person.birth.address = { city: {}, country: {} }
      really.husband.person.death.address = { city: {}, country: {} }

    }, error => {
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  // changeState(ev: any) {
  //   let really = this;
  //   this.stateService.getDepartamentsByState(ev.value).subscribe((response: any) => {
  //     really.departaments = response;
  //   })
  // }
  // changeDepartament(ev: any) {
  //   let really = this;
  //   this.stateService.getCitiesByState(ev.value).subscribe((response: any) => {
  //     really.cities = response;
  //   })
  // }

  updatePerson(person: any) {
    let really = this;
    this.personService.putPerson(this[person].person.id, this[person].person).subscribe((response: any) => {
      really.snackBarMessage('Actualizado con Éxito', 5000);
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }
  changeLastNames(ev: any, ele: any) {
    console.log(ev);
    this[ele].person.lastName = ev.lastName;
    this[ele].person.secondLastName = ev.secondLastName;
    console.log(this[ele]);
  }
  updateProcedure(validate: any, noMove?: any) {
    let really = this;
    this.model.people = [];
    if (this.wife.person.firstName && this.wife.person.lastName) {
      this.model.people.push(this.wife);
    }
    if (this.motherWife.person.firstName && this.motherWife.person.lastName) {
      this.model.people.push(this.motherWife);
    }
    if (this.fatherWife.person.firstName && this.fatherWife.person.lastName) {
      this.model.people.push(this.fatherWife);
    }
    if (this.husband.person.firstName && this.husband.person.lastName) {
      this.model.people.push(this.husband);
    }
    if (this.motherHusband.person.firstName && this.motherHusband.person.lastName) {
      this.model.people.push(this.motherHusband);
    }
    if (this.fatherHusband.person.firstName && this.fatherHusband.person.lastName) {
      this.model.people.push(this.fatherHusband);
    }
    if (this.testigos.length >= 2) {
      this.testigos.forEach((element: any) => {
        this.model.people.push(element);
      })
    }
    if (this.oponentes.length > 0) {
      this.oponentes.forEach((element: any) => {
        this.model.people.push(element);
      });
      this.model.procedureHasAttributeValues = this.model.procedureHasAttributeValues.concat(this.auxAttributesOponentes);
    }
    // else if (this.testigos.length > 0) {
    //   really.snackBarMessage('Se Deben Ingresar al Menos Dos Testigos', 5000);
    //   return null;
    // }    
    if (!this.model.id) {
      // this.model.office = {};
      // this.model.office.id = JSON.parse(localStorage.getItem('currentOffice')).id;
      this.model.officeId = JSON.parse(localStorage.getItem('currentOffice')).id;
      this.procedureService.postProcedure(this.model).subscribe((response: any) => {
        really.model = response;
        // debugger
        localStorage.setItem('nuevoTramite', 'SI');
        // window.location.href += '/' + response.id; 
        really.router.navigateByUrl('mat/' + response.id);
        // stepper.selectedIndex += 1;
        really.indice += 1;
      }, error => {
        really.snackBarMessage(error.error.message, 5000);
      })
    }
    else {
      this.procedureService.putProcedure(this.model.id, this.model).subscribe((response: any) => {
        really.model = response;
        really.pdfValidate = {};
        if (!validate && !noMove)
          really.indice += 1;
        if (validate) {
          really.validate = validate;
          really.procedureService.getRequestMarriedPDF(really.model.id).subscribe((response: any) => {
            // console.log(response);
            really.pdfValidate = response;
          }, error => {
            really.snackBarMessage(error.error.message, 5000);
          });
        }
        really.matchDocuments();
      }, error => {
        really.snackBarMessage(error.error.message, 5000);
      })
    }
  }
  cambioIndice(ev: any) {
    // console.log(ev.selectedIndex);
    this.indice = ev.selectedIndex;
    // console.log(this.indice);
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
      this.matrimonioService.addMargin(this.margin).subscribe((response: any) => {
        // marginal.sentence = margin.value;
        console.log(response);
        let r = response;
        r.fileCount = 0;
        really.margins.push(r);
        really.dataSource = new MatTableDataSource(really.margins);
        $('#filesText').html('');
        this.margin = {};
        this.editActorType = {};
        this.actorType = {};
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
      this.matrimonioService.putMargin(this.margin).subscribe((response: any) => {
        //
        let obj: any = {};
        Object.assign(obj, really.margins[really.marginIndex]);
        really.margins[really.marginIndex] = response;
        really.margins[really.marginIndex].fileCount = obj.fileCount;
        this.dataSource = new MatTableDataSource(this.margins);
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
    this.margin = {};
    this.editActorType = {};
  }
  deleteMargin(element: any, index: any) {
    let really = this;
    this.marginIndex = index;
    this.matrimonioService.deleteMargin(element.id).subscribe((response: any) => {
      let obj: any = {};
      Object.assign(obj, really.margins[really.marginIndex]);
      really.margins[really.marginIndex] = response;
      really.margins[really.marginIndex].fileCount = obj.fileCount;
      console.log(really.margins); really.margins.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.margins);
    })
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
    // console.log('element', element);
    // console.log('index', index);
  }
  onFileChange(element: any) {
    console.log(element);
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
      this.matchDocuments();
      this.snackBarMessage('Archivo digitalizado con Éxito', 6000);
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    });
  }
  uploadFileActa(file: any, proceduretypeAttrId: any, index: any) {
    let really = this;
    let formData: FormData = new FormData();
    //// console.log('FILE', file);
    //formData.append('document', JSON.stringify(document));
    formData.append('file', file, file.name);
    formData.append('originalName', file.name);
    formData.append('procedureId', this.model.id.toString());
    formData.append('proceduretypeAttrId', this.model.id);
    formData.append('mimeType', file.type);
    formData.append('code', 'CERT');
    console.log(file.name);

    ////// console.log('formData:' + formData);
    this.matrimonioService.uploadFile(formData).subscribe((response: any) => {
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
  backToInbox() {
    this.router.navigateByUrl('/starter');
  }
  nextStep() {
    this.router.navigateByUrl('/procedure/' + this.model.id)
  }
  backStep() {
    console.log(this.indice);
    this.indice -= 1;
  }
  // printCertificateOpo() {
  //   let really = this;
  //   this.procedureService.getCertificateOpoPDF(this.model.id).subscribe((response: any) => {
  //     really.pdfValidate = response;
  //   }, error => {
  //     really.snackBarMessage(error.error.message, 6000);
  //   })
  // }
  finalizarTramite() {
    let really = this;
    let proced: any = {};
    proced.procedureId = this.model.id;
    proced.observations = this.model.observations;
    //
    // this.procedureService.postCertificate(proced.procedureId, proced).subscribe((response: any) => {
    //   // console.log(response);
    // really.procedureService.getCertificatePDF(proced.procedureId).subscribe((pdfCertificate: any) => {
    //     really.pdfCertificate = pdfCertificate;
    this.procedureService.postCertificateProcedure(proced.procedureId, really.model.tasks.current.id, proced).subscribe((response: any) => {
      really.finalizado = true;
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
    // // console.log(pdfCertificate);
    //   }, error => {
    //     really.snackBarMessage(error.error.message, 6000);
    //   })
    // }, error => {
    //   really.snackBarMessage(error.error.message, 6000);
    // })
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
    let actor: any = this.model.people.filter((element: any) => {
      return element.actorType.code == really.actorType.code;
    })
    if (actor.length == 0)
      this.snackBarMessage('No se encontraron datos del actor', 5000)
    else {
      this.editActorType = actor[0];
      console.log(this.editActorType);
    }

  }
  closePerson(person: any) {
    this[person].person = {
      docType: {},
      birth: {},
      address: {}
    };
  }
  deleteFileActa(documentId: any) {
    let really = this;
    this.matrimonioService.deleteFiles(documentId.id).subscribe((response: any) => {
      really.snackBarMessage('Archivo Eliminado con Éxito', 3000);
      really.fileActas = [];
      really.dataActasFiles = new MatTableDataSource(really.fileActas);
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }
  addTestigo(index: any) {
    let really = this;
    if (index == -1 && this.declarante.person.firstName && this.declarante.person.firstName && this.declarante.person.docNumber) {
      let num = this.testigos.length + 1;
      this.declarante.actorType.code = 'TESTIGO_' + num;
      this.personService.putPerson(this.declarante.person.id, this.declarante.person).subscribe((response: any) => {
        this.matrimonioService.addActor(this.model.id, this.declarante).subscribe((response: any) => {
          this.testigos.push(this.declarante)
          this.snackBarMessage('Agregado con Éxito', 6000);
          this.dataSourceTestigos = new MatTableDataSource(this.testigos);
          this.declarante = {
            actorType: {
              code: "",
              relationship: {}
            },
            person: {
              docType: {},
              address: { city: {}, country: {} },
              birth: { address: { city: {}, country: {} } },
              death: { address: { city: {}, country: {} } }
            }
          };
          this.personDeclarante = { find: true }
        }, error => {
          this.snackBarMessage(error.error.message, 6000);
        })
      }, error => {
        really.snackBarMessage(error.error.message, 6000);
      });
    }
    else if (index >= 0) {
      this.testigos[index] = this.declarante;
    }
    else {
      this.snackBarMessage('Ingrese los datos del Testigo', 5000);
    }
  }
  deleteTestigo(element: any, index: any) {
    //
    this.testigos.splice(index, 1);
    this.dataSourceTestigos = new MatTableDataSource(this.testigos);
    this.updateProcedure(false, true);
  }
  addOponente(index: any) {
    if (index == -1 && this.oponente.person.firstName && this.oponente.person.firstName && this.oponente.person.docNumber) {
      let num = this.testigos.length + 1;
      this.oponente.actorType.code = 'OPONENTE';
      this.matrimonioService.addActor(this.model.id, this.oponente).subscribe((response: any) => {
        this.oponentes.push(this.oponente)
        this.snackBarMessage('Agregado con Éxito', 6000);
        this.dataSourceOponentes = new MatTableDataSource(this.oponentes);
        this.oponente = {
          actorType: {
            code: "",
            relationship: {}
          },
          person: {
            docType: {},
            address: { city: {}, country: {} },
            birth: { address: { city: {}, country: {} } },
            death: { address: { city: {}, country: {} } }
          }
        };
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      })
    }
    else if (index >= 0) {
      this.oponentes[index] = this.oponente;
    }
    else {
      this.snackBarMessage('Ingrese los datos del Oponente', 5000);
    }
  }
  deleteOponente(element: any, index: any) {
    //
    this.oponentes.splice(index, 1);
    this.dataSourceOponentes = new MatTableDataSource(this.oponentes);
    this.updateProcedure(false, true);
  }
  cancelarMargin() {
    $('#filesText').html('');
    $('#file-input').val('');
    this.margin = {};
    this.actorType = {};
    this.editActorType = {};
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

  postPerson(searchPerson: any, person: any) {
    let really = this;
    this.personService.postPerson(this[person].person).subscribe((response: any) => {
      really[searchPerson].docNumber = response.docNumber;
      really[searchPerson].sex = response.sex;
      really.findPerson(searchPerson, person);
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    })
  }
  findPerson(searchPerson: any, person: any) {
    // debugger
    let really = this;
    this.personService.getPersonByDocumentSex(this[searchPerson].docNumber, this[searchPerson].sex).subscribe((response: any) => {
      console.log(response);
      really[person].person = response;
      // really.wife.person.age = '';
      really[searchPerson].find = true;
      if (person == 'wife')
        this.buildCity('wife', '1')
      if (person == 'husband')
        this.buildCity('husband', '2')
      // really[person].person.birth.address = { city: {}, country:{} }
      // really[person].person.death.address = { city: {}, country:{} }

    }, error => {
      really[searchPerson].find = false;
      really[person].person = {
        docType: {},
        birth: { address: { city: {}, country: {} } },
        death: { address: { city: {}, country: {} } },
        civilStatus: {},
        address: {}
      };
      really.snackBarMessage(error.error.message, 5000);
    });
  }

  buildCity(person: any, render: any) {
    if (this[person].person.birth.address.country.id) {
      this.getStatesByCountry(this[person].person.birth.address.country.id, 'states_' + render)
      if (this[person].person.birth.address.city.department.state.id) {
        this.getDepartmentsByState(this[person].person.birth.address.city.department.state.id, 'departments_' + render)
        if (this[person].person.birth.address.city.department.id)
          this.getCitiesByDepartment(this[person].person.birth.address.city.department.id, 'cities_' + render)
      }
    }
  }

  digitalize(attachmentTypeFile: any, addPage?: any) {
    // debugger
    // this.disabledButton x= true;
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
        // console.log(really.imagenWS);
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
        really.uploadFile(out, attachmentTypeFile.code, attachmentTypeFile.documentId, addPage);
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

  addFileAttachment(element: any) {
    this.fileSelected = element;
    $('#file-inputAttachment').click();
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
  closePreviewDoc() {
    this.documentScanned = {};
  }
  deleteFiles(document: any) {
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
