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
  selector: 'CMDefuncion',
  templateUrl: './CMDefuncion.component.html',
  styleUrls: ['./CMDefuncion.component.scss']
})
export class CMDefuncionComponent implements AfterViewInit {
  model: any = { procedureTypeCode: "DEFUNCION", procedureHasAttributeValues: [] };
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
  states: any[] = [];
  departments: any[] = [];
  finalizado: any = false;
  department: any = {};
  citiesDifunto: any[] = [];
  citiesProgenitor_1: any[] = [];
  citiesProgenitor_2: any[] = [];
  citiesDeclarante: any[] = [];
  personDifunto: any = { find: true };
  personDeclarante: any = { find: true };
  personProgenitor_1: any = { find: true };
  personProgenitor_2: any = { find: true };
  progenitor_1: any = {
    actorType: {

      code: "PROGENITOR_1"
    },
    person: {
      ageType: {},
      docType: {},
      address: {},
      personType: {},
      birth: { address: { department: {}, city: {}, country: {} } },
      death: { address: { department: {}, city: {}, country: {} } },
      civilStatus: {}
    }
  }
  progenitor_2: any = {
    actorType: {

      code: "PROGENITOR_2"
    },
    person: {
      personType: {},
      docType: {},
      birth: { address: { department: {}, city: {}, country: {} } },
      death: { address: { department: {}, city: {}, country: {} } },
      civilStatus: {},
      address: {},
    }
  }
  declarante: any = {
    actorType: {
      code: "DECLARANTE"
    },
    person: {
      personType: {},
      ageType: {},
      docType: {},
      address: {},
      birth: { address: { department: {}, city: {}, country: {} } },
      death: { address: { department: {}, city: {}, country: {} } },
      civilStatus: {}
    }
  }
  difunto: any = {
    actorType: {
      code: "DIFUNTO"
    },
    person: {
      personType: {},
      ageType: {},
      docType: {},
      address: {},
      birth: { address: { department: {}, city: {}, country: {} } },
      death: { address: { department: {}, city: {}, country: {} } },
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
      address: { city: {} },
      birth: { address: { city: {} } },
      death: { address: { city: {} } },
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
      address: { city: {} },
      birth: { address: { city: {} } },
      death: { address: { city: {} } },
      civilStatus: {}
    }
  }
  difuntoSelected: any = {};
  progenitor_1Selected: any = {};
  progenitor_2Selected: any = {};
  declaranteSelected: any = {};
  margin: any = {};
  margins: any[] = [];
  marginIndex: any;
  displayedColumns: any;
  displayColumnActa: any;
  displayedColumnsTestigos: any;
  dataSource: any;
  dataSourceTestigos: any;
  dataSourceDifuntos: any;
  dataActasFiles: any;
  documentTypes: any[] = [];
  relationships: any[] = [];
  relationshipsOpponents: any[] = [];
  motivesOpponents: any[] = [];
  testigos: any[] = [];
  difuntos: any[] = [];
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
  auxAttributesDifuntos: any[] = [{
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

        // Obtener ActorTypes
        this.lookupService.getActorTypesByProcedureType('DEFUNCION').subscribe((response: any) => {
          this.actorTypes = response;
          this.actorTypes.forEach((actor, index) => {
            this['actor_' + actor.code.toString().toLowerCase()] = actor;
          })

          this.model.people.forEach((element: any) => {
            if (element.actorType.code == 'PROGENITOR_1') {
              this.progenitor_1 = element;
              this['progenitor_1Selected'] = this['actor_progenitor_1'].personsType.filter((element: any) => {
                // 
                return element.value == this.progenitor_1.person.personType.code;
              })[0];
            }
            if (element.actorType.code == 'PROGENITOR_2') {
              this.progenitor_2 = element;

              this['progenitor_2Selected'] = this['actor_progenitor_2'].personsType.filter((element: any) => {
                // 
                return element.value == this.progenitor_2.person.personType.code;
              })[0];
            }
            if (element.actorType.code == 'DIFUNTO') {
              this.difunto = element
              this['difuntoSelected'] = this['actor_difunto'].personsType.filter((element: any) => {
                // 
                return element.value == this.difunto.person.personType.code;
              })[0];
              if (this.difunto.person.death.address.department && this.difunto.person.death.address.department.id) {
                this.getCitiesByDepartment(this.difunto.person.death.address.department.id, 'citiesDifunto');
              }
            }
            if (element.actorType.code == 'DECLARANTE') {
              this.declarante = element

              this['declaranteSelected'] = this['actor_declarante'].personsType.filter((element: any) => {
                // 
                return element.value == this.declarante.person.personType.code;
              })[0];
              // this.husband = element;
              // this.husband.person.birth.address = { city: {} }
            }
            // if (element.actorType.code == 'DECLARANTE')
            //   this.declarante = element;
          });
        });
        this.matchDocuments();
      });
    }
    else {
      // Obtener ActorTypes
      this.lookupService.getActorTypesByProcedureType('DEFUNCION').subscribe((response: any) => {
        this.actorTypes = response;
        this.actorTypes.forEach((actor, index) => {
          this['actor_' + actor.code.toString().toLowerCase()] = actor;
        })
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
    //Obtener Estados Civil.
    this.lookupService.getCivilStatus().subscribe((response: any) => {
      this.civilStatus = response;
    })
    // traer deptos
    this.getDepartmentsByState();
    // Obtener tipos de attributes 
    if (!this.model.id) {
      this.procedureService.getAttributesProcedureByCode('DEFUNCION').subscribe((attr: any) => {
        this.model.procedureHasAttributeValues = attr;
      }, error => {
        this.snackBarMessage(error.error.message, 4000)
      });
    }
    //

    this.displayedColumns = ['Archivo', 'Obligatorio', 'action'];
    this.displayedColumnsTestigos = ['Documento', 'Apellido y Nombre', 'Acciones'];

  }

  getDepartmentsByState() {
    this.stateService.getDepartamentsByState(41).subscribe((responseDp: any) => {
      this.departments = responseDp;
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
  changedifuntoSelected(ev: any) {
    this.difuntoSelected.attributes = ev.attributes.map((element: any) => {
      if (element.field.indexOf('.') >= 0) {
        element.property_2 = element.field.substring(element.field.indexOf('.') + 1)
        element.property_1 = element.field.substring(0, element.field.indexOf('.'))
      }
      return element;
    });
  }
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
    // if (this.difunto.person.firstName && this.difunto.person.lastName) {
    console.log(this.indice);
    if (this.difunto.person.sex) {
      this.model.people.push(this.difunto);
    }
    else if (this.indice == 0) {
      this.snackBarMessage('Ingrese el Sexo de la Persona', 4000)
      return null
    }
    if (this.progenitor_1.person.sex) {
      this.model.people.push(this.progenitor_1);
    }
    else if (this.indice == 1 && this.progenitor_1.person.lastName) {
      this.snackBarMessage('Ingrese el Sexo de la Persona', 4000)
      return null
    }
    if (this.progenitor_2.person.sex)
      this.model.people.push(this.progenitor_2);
    else if (this.indice == 2 && this.progenitor_2.person.lastName) {
      this.snackBarMessage('Ingrese el Sexo de la Persona', 4000)
      return null
    }
    if (this.declarante.person.sex)
      this.model.people.push(this.declarante);
      else if (this.indice == 3 && this.declarante.person.lastName) {
      // else if (this.indice == 3 && this.declarante.person.last_Name) {
      this.snackBarMessage('Ingrese el Sexo de la Persona', 4000)
      return null
    }
    // }
    // if (this.testigos.length >= 2) {
    //   this.testigos.forEach((element: any) => {
    //     this.model.people.push(element);
    //   })
    // }
    // if (this.difuntos.length > 0) {
    //   this.difuntos.forEach((element: any) => {
    //     this.model.people.push(element);
    //   });
    //   this.model.procedureHasAttributeValues = this.model.procedureHasAttributeValues.concat(this.auxAttributesDifuntos);
    // }
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
        // 
        localStorage.setItem('nuevoTramite', 'SI');
        // window.location.href += '/' + response.id; 
        really.router.navigateByUrl('def/' + response.id);
        // stepper.selectedIndex += 1;
        really.indice += 1;
        // Traer Atributos del Tramite        
        really.procedureService.getAttributesProcedure(response.id).subscribe((attributes: any) => {
          really.model.procedureHasAttributeValues = attributes;
        })
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
          really.procedureService.getValidationPDF(really.model.id).subscribe((response: any) => {
            // console.log(response);
            really.pdfValidate = response;
          }, error => {
            really.snackBarMessage(error.error.message, 5000);
          });
        }

        // Traer Atributos del Tramite        
        really.procedureService.getAttributesProcedure(response.id).subscribe((attributes: any) => {
          really.model.procedureHasAttributeValues = attributes;
        })
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
  changePersonType(ev: any, person: any) {

    this[person].person = {
      ageType: {},
      docType: {},
      address: {},
      personType: {},
      birth: { address: { department: {}, city: {}, country: {} } },
      death: { address: { department: {}, city: {}, country: {} } },
      civilStatus: {}
    };
    this[person].person.personType.code = ev.value;
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
  finalizarTramite() {
    let really = this;
    let proced: any = {};
    proced.procedureId = this.model.id;
    proced.observations = this.model.observations;
    //
    this.procedureService.postCertificate(proced.procedureId, proced).subscribe((response: any) => {
      // console.log(response);
      really.procedureService.getCertificatePDF(proced.procedureId).subscribe((pdfCertificate: any) => {
        really.pdfCertificate = pdfCertificate;
        this.procedureService.postCertificateProcedure(proced.procedureId, really.model.tasks.current.id, proced).subscribe((response: any) => {
          really.finalizado = true;
        }, error => {
          really.snackBarMessage(error.error.message, 6000);
        })
        // // console.log(pdfCertificate);
      }, error => {
        really.snackBarMessage(error.error.message, 6000);
      })
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
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
  closePerson(person: any, findPerson: any) {
    this[person].person = {
      ageType: {},
      docType: {},
      address: {},
      personType: {},
      birth: { address: { department: {}, city: {}, country: {} } },
      death: { address: { department: {}, city: {}, country: {} } },
      civilStatus: {}
    };
    this[findPerson] = { find: true };
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
    console.log(this[person]);
    this.personService.postPerson(this[person].person).subscribe((response: any) => {
      really[searchPerson].docNumber = response.docNumber;
      really[searchPerson].sex = response.sex;
      really.findPerson(searchPerson, person);
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    })
  }
  findPerson(searchPerson: any, person: any) {
    // 
    let really = this;
    this.personService.getPersonByDocumentSex(this[searchPerson].docNumber, this[searchPerson].sex).subscribe((response: any) => {
      console.log(response);
      really[person].person = response;
      // really.wife.person.age = '';
      really[searchPerson].find = true;
      if (!really[person].person.birth.address.departament) {
        really[person].person.birth.address.department = {}
      }
      if (!really[person].person.death.address.department)
        really[person].person.death.address.department = {}

    }, error => {
      // debugger
      if (error.status == 404) {
        // 
        // if (person == 'difunto') {
        let aux = really['actor_' + person].personsType.filter((element: any) => {
          // 
          return element.value == 'PERSON_UNDOCUMENTED'
        });
        if (aux.length > 0)
          really[person + 'Selected'] = aux[0];
        // }
        really[searchPerson].find = false;
        really[person].person = {
          ageType: {},
          docType: {},
          address: {},
          personType: {},
          birth: { address: { department: {}, city: {}, country: {} } },
          death: { address: { department: {}, city: {}, country: {} } },
          civilStatus: {}
        };
      }
      really.snackBarMessage(error.error.message, 5000);
    });
  }

  digitalize(attachmentTypeFile: any, addPage?: any) {
    // 
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
        // 
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
      // 
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
