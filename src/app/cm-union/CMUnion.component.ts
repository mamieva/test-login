import { Component, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatStepper, MatCheckbox } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MigrateUnion } from '../services/migrateUnion.service';
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
  selector: 'CMUnion',
  templateUrl: './CMUnion.component.html',
  styleUrls: ['./CMUnion.component.scss']
})
export class CMUnionComponent implements AfterViewInit {
  model: any = { procedureTypeCode: "UNION_CONVIVENCIAL", procedureHasAttributeValues: [] };
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
  states: any[] = [];
  departaments: any[] = [];
  finalizado: any = false;
  department: any = {};
  cities: any[] = [];
  personWife: any = { find: true };
  personDeclarante: any = { find: true };
  personHusband: any = { find: true };
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

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private unionService: MigrateUnion,
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
          if (element.actorType.code == 'CONTRAYENTE_2') {
            this.wife = element;
            // this.wife.person.birth.address = { city: {} }
          }
          if (element.actorType.code == 'CONTRAYENTE_1') {
            this.husband = element;
            // this.husband.person.birth.address = { city: {} }
          }
          if (element.actorType.code.indexOf('TESTIGO_') >= 0) {
            this.testigos.push(element)
            this.dataSourceTestigos = new MatTableDataSource(this.testigos);
            // this.husband = element;
            // this.husband.person.birth.address = { city: {} }
          }
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
    // Obtener Estados
    this.stateService.getStatesByCountry(1).subscribe((response: any) => {
      this.states = response;
      this.provincia.id = 20;
      this.stateService.getDepartamentsByState(20).subscribe((responseDp: any) => {
        this.departaments = responseDp;
      })
    });
    this.stateService.getCitiesByState(department).subscribe((response: any) => {
      this.cities = response;
    })

    // Obtener tipos de attributes 
    if (!this.model.id) {
      this.procedureService.getAttributesProcedureByCode('UNION_CONVIVENCIAL').subscribe((attr: any) => {
        this.model.procedureHasAttributeValues = attr;
      }, error => {
        this.snackBarMessage(error.error.message, 4000)
      });
    }
    // Obtener ActorTypes
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
  findDeclarante() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personDeclarante.docNumber, this.personDeclarante.sex).subscribe((response: any) => {
      console.log(response);
      really.declarante.person = response;
      // really.declarante.person.age = '';
      really.declarante.person.birth.address = { city: {} }
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
      really.wife.person.birth.address = { city: {} }
      really.wife.person.death.address = { city: {} }

    }, error => {
      really.personWife.find = false;
      really.wife.person = {
        docType: {},
        birth: { address: { city: {} } },
        death: { address: { city: {} } },
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
      really.husband.person.birth.address = { city: {} }
      really.husband.person.death.address = { city: {} }

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
    if (this.husband.person.firstName && this.husband.person.lastName) {
      this.model.people.push(this.husband);
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
        really.router.navigateByUrl('uni/' + response.id);
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
          really.procedureService.getValidationPDF(really.model.id).subscribe((response: any) => {
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
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration, panelClass: ['blue-snackbar']
    });
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
  addMarginFile(element: any, i: any) {
    // console.log(element);
    $('#file-input').click();
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

    this.procedureService.postCertificate(proced.procedureId, proced).subscribe((response: any) => {
      // console.log(response);
      really.procedureService.getCertificatePDF(proced.procedureId).subscribe((pdfCertificate: any) => {
        really.pdfCertificate = pdfCertificate;
        this.procedureService.postCertificateProcedure(proced.procedureId, really.model.tasks.current.id, proced).subscribe((response: any) => {
          really.finalizado = true;
        }, error => {
          really.snackBarMessage(error.error.message, 6000);
        })
        // console.log(pdfCertificate);
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
  closePerson(person: any, personType: any) {
    this[person].person = {
      docType: {},
      birth: {},
      address: {}
    };
    this[personType] = { find: true }
  }
  addTestigo(index: any) {
    if (index == -1 && this.declarante.person.firstName && this.declarante.person.firstName && this.declarante.person.docNumber) {
      let num = this.testigos.length + 1;
      this.declarante.actorType.code = 'TESTIGO_' + num;
      this.unionService.addActor(this.model.id, this.declarante).subscribe((response: any) => {
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
            address: { city: {} },
            birth: { address: { city: {} } },
            death: { address: { city: {} } }
          }
        };
      }, error => {
        this.snackBarMessage(error.error.message, 6000);
      })
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
  deleteOponente(element: any, index: any) {
    //
    this.oponentes.splice(index, 1);
    this.dataSourceOponentes = new MatTableDataSource(this.oponentes);
    this.updateProcedure(false, true);
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
      // really[person].person.birth.address = { city: {} }
      // really[person].person.death.address = { city: {} }

    }, error => {
      really[searchPerson].find = false;
      really[person].person = {
        docType: {},
        birth: { address: { city: {} } },
        death: { address: { city: {} } },
        civilStatus: {},
        address: {}
      };
      really.snackBarMessage(error.error.message, 5000);
    });
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
