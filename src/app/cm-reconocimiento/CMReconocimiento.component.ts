import { Component, AfterViewInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatStepper, MatCheckbox } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig, MatTable, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { MigrateBorn } from '../services/migrateBorn.service';
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
  selector: 'CMReconocimiento',
  templateUrl: './CMReconocimiento.component.html',
  styleUrls: ['./CMReconocimiento.component.scss']
})
export class CMReconocimientoComponent implements AfterViewInit {
  model: any = { procedureTypeCode: "RECONOCIMIENTO", procedureHasAttributeValues: [] };
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
  attachmentFiles: any[] = [];
  // attachmentTypeFile: any = {};
  documents: any[] = [];
  // actaBloquear: any = { volume: {}, certificateTypeCode: "NACIMIENTO" };
  // actaReconocimiento: any = { volume: {}, certificateTypeCode: "RECONOCIMIENTO" };
  offices: any[] = [];
  states: any[] = [];
  departaments: any[] = [];
  cities: any[] = [];
  personCambioGenero: any = { find: true };
  personProgenitor_1: any = { find: true };
  personProgenitor_2: any = { find: true };
  personDeclarante: any = { find: true };
  personSon: any = {};
  cambio_genero: any = {
    actorType: {
      id: 4,
      code: "CAMBIO_GENERO"
    },
    person: {
      docType: {},
      address: {},
      birth: {}
    }
  }
  progenitor_1: any = {
    actorType: {
      id: 4,
      code: "RECONOCIDO_PROGENITOR_1",
      relationship: { code: '' }
    },
    person: {
      docType: {},
      birth: {},
      address: {}
    }
  }
  progenitor_2: any = {
    actorType: {
      id: 4,
      code: "RECONOCIDO_PROGENITOR_2",
      relationship: { code: '' }
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
  son: any = {
    actorType: {
      id: 4,
      code: "RECONOCIDO",
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
  attributesProcedure: any[] = [];
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
  provincia: any = {};
  department: any = {};
  numberOfBirths: any;
  nacidos: any[] = [];
  civilStatus: any[] = [];
  validate: any = false;
  finalizado: any = false;
  constructor(
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
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
    let really = this;
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
        this.procedureService.getAttributesProcedure(this.model.id).subscribe((attributes: any) => {
          console.log(attributes);
          // this.attributesProcedure = attributes;
          this.model.procedureHasAttributeValues = attributes;
        })
        response.people.forEach((element: any) => {
          if (element.actorType.code == 'RECONOCIDO') {
            this.son = element;
            this.stateService.getDepartamentsByState(this.son.person.birth.address.city.department.state.id).subscribe((responseDp: any) => {
              this.departaments = responseDp;
            })
            this.stateService.getCitiesByState(this.son.person.birth.address.city.department.id).subscribe((response: any) => {
              this.cities = response;
            })
          }
          if (element.actorType.code == 'RECONOCIDO_PROGENITOR_1')
            this.progenitor_1 = element;
          if (element.actorType.code == 'RECONOCIDO_PROGENITOR_2')
            this.progenitor_2 = element;
          if (element.actorType.code == 'DECLARANTE') {
            this.declarante = element;
            // this.wife.person.birth.address = { city: {} }
          }
          if (element.actorType.code == 'RECIEN_NACIDO') {
            this.nacidos.push(element);
            this.dataSource = new MatTableDataSource(this.nacidos);
          }
          // Obtener documentos y matchear digitalizados.
          really.matchDocuments();
        });
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
    // // Obtener tipos de archivos 
    // this.lookupService.getAttachmentType('RECONOCIMIENTO').subscribe((response: any) => {
    //   this.attachmentFiles = response;
    // });
    //Obtener Relaciones
    this.lookupService.getRelationship().subscribe((response: any) => {
      this.relationships = response;
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
    });
    // Obtener ActorTypes
    // this.lookupService.getActorTypesByProcedureType('NACIMIENTO').subscribe((response: any) => {
    //   this.actorTypes = response;
    // });
    //
    this.displayedColumns = ['Archivo', 'Obligatorio', 'action'];
    // this.dataSource = new MatTableDataSource(this.margins);
    // this.displayColumnActa = ['Archivo', 'Acciones'];
    // this.dataActasFiles = new MatTableDataSource(this.fileActas);
  }
  ngAfterViewInit() { }
  resetStepper(stepper: MatStepper) {
    stepper.selectedIndex = 0;
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
  postCambioGenero() {
    let really = this;
    this.personService.postPerson(this.cambio_genero.person).subscribe((response: any) => {
      really.personCambioGenero.docNumber = response.docNumber;
      really.personCambioGenero.sex = response.sex;
      really.findCambioGenero();
    }, error =>
        really.snackBarMessage(error.error.message, 5000))
  }
  findCambioGenero() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personCambioGenero.docNumber, this.personCambioGenero.sex).subscribe((response: any) => {
      // console.log(response);
      really.cambio_genero.person = response;
      really.personCambioGenero.find = true;

    }, error => {
      really.cambio_genero.person = {
        docType: {},
        birth: {},
        address: {}
      };
      really.personCambioGenero.find = false;
      really.snackBarMessage(error.error.message, 5000);
    })
  }
  postProgenitor_1() {
    let really = this;
    this.personService.postPerson(this.progenitor_1.person).subscribe((response: any) => {
      really.personProgenitor_1.docNumber = response.docNumber;
      really.personProgenitor_1.sex = response.sex;
      really.findProgenitor_1();
    }, error =>
        really.snackBarMessage(error.error.message, 5000))
  }
  findProgenitor_1() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personProgenitor_1.docNumber, this.personProgenitor_1.sex).subscribe((response: any) => {
      // console.log(response);
      really.progenitor_1.person = response;
      really.personProgenitor_1.find = true;

    }, error => {
      really.progenitor_1.person = {
        docType: {},
        birth: {},
        address: {}
      };
      really.personProgenitor_1.find = false;
      really.snackBarMessage(error.error.message, 5000);
    });
  }
  postProgenitor_2() {
    let really = this;
    this.personService.postPerson(this.progenitor_2.person).subscribe((response: any) => {
      really.personProgenitor_2.docNumber = response.docNumber;
      really.personProgenitor_2.sex = response.sex;
      really.findProgenitor_2();
    }, error =>
        really.snackBarMessage(error.error.message, 5000))
  }
  findProgenitor_2() {
    let really = this;
    this.personService.getPersonByDocumentSex(this.personProgenitor_2.docNumber, this.personProgenitor_2.sex).subscribe((response: any) => {
      // console.log(response);
      really.progenitor_2.person = response;
      really.personProgenitor_2.find = true;

    }, error => {
      really.progenitor_2.person = {
        docType: {},
        birth: {},
        address: {}
      };
      really.personProgenitor_2.find = false;
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
  findSon() {
    let really = this;
    this.personService.getPersonByDocumentSexReconocimiento(this.personSon.docNumber, this.personSon.sex).subscribe((response: any) => {
      // console.log(response);
      really.son.person = response;
      if (this.son.person.birth.address.city.department.state.id) {
        this.stateService.getDepartamentsByState(this.son.person.birth.address.city.department.state.id).subscribe((responseDp: any) => {
          this.departaments = responseDp;
        })
        this.stateService.getCitiesByState(this.son.person.birth.address.city.department.id).subscribe((response: any) => {
          this.cities = response;
        })
      }
      // really.son.person.birth.address = { city: {} }

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
    if (this.son.person.firstName && this.son.person.lastName && this.son.person.birth.address.city.id) {
      this.model.people.push(this.son);
    }
    // if (this.cambio_genero.person.firstName && this.cambio_genero.person.lastName) {
    //   this.model.people.push(this.cambio_genero);
    // }
    if (this.progenitor_1.person.firstName && this.progenitor_1.person.lastName) {
      this.model.people.push(this.progenitor_1);
    }
    if (this.progenitor_2.person.firstName && this.progenitor_2.person.lastName) {
      this.model.people.push(this.progenitor_2);
    }
    // if (this.declarante.person.firstName && this.declarante.person.lastName) {
    //   this.model.people.push(this.declarante);
    // }
    // if (this.nacidos.length > 0) {
    //   this.nacidos.forEach((element, index) => {
    //     let i = index + 1;
    //     element.actorType.relationship.code = 'HERMANO_' + i;
    //     this.model.people.push(element);
    //   });
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
        really.router.navigateByUrl('rec/' + response.id);
        // stepper.selectedIndex += 1;
        really.indice += 1;
      }, error => {
        really.snackBarMessage(error.error.message, 5000);
      })
    }
    else {
      // // console.log(this.model);
      this.procedureService.putProcedure(this.model.id, this.model).subscribe((response: any) => {
        really.model = response;
        really.pdfValidate = {};
        //obtener tipos de doc.
        really.matchDocuments();
        really.procedureService.getAttributesProcedure(this.model.id).subscribe((attributes: any) => {
          console.log(attributes);
          // this.attributesProcedure = attributes;
          really.model.procedureHasAttributeValues = attributes;
        })
        // // console.log(response);
        // Obtener ActorTypes
        // if (really.indice == 3 && this.numberOfBirths > this.nacidos.length) {
        //   really.indice = 3;
        //   really.snackBarMessage('Ingrese todos los Nacidos correspondientes', 5000);
        // }
        // if (really.indice != 3) {
        if (!validate)
          really.indice += 1;
        // }
        if (validate) {
          really.procedureService.getValidationPDF(really.model.id).subscribe((response: any) => {
            // console.log(response);
            really.pdfValidate = response;
            really.validate = validate;
            // console.log($('#download'));
            // .click();
          }, error => {
            really.snackBarMessage(error.error.message, 5000);
          });
        }
      }, error => {
        really.snackBarMessage(error.error.message, 5000);
      })
    }
  }
  snackBarMessage(msg: any, duration: any) {
    this.snackBar.open(msg, '', {
      duration: duration, panelClass: ['blue-snackbar']
    });
  }

  digitalize(documentType: any, addPage?: any) {
    // this.disabledButton = true;
    let really = this;
    let imagen = '';
    let cant = 0;

    // var ws = new WebSocket('ws://127.0.0.1:9998');
    // var ws = new WebSocket('ws://192.168.0.34:9998');

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
  closePerson(person: any) {
    this[person].person = {
      docType: {},
      birth: {},
      address: {}
    };
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
      this.snackBarMessage('Archivo digitalizado con Éxito', 6000);
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
    });
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
  closePreviewDoc() {
    this.documentScanned = {};
  }

  deleteFiles(document: any) {
    let really = this;
    this.procedureService.deleteFiles(document.id).subscribe((response: any) => {
      this.snackBarMessage('Documento eliminado con Éxito', 6000);
      really.procedureService.getDocumentsByProcedure(really.model.id).subscribe((documents: any) => {
        really.documents = documents;
        really.dataSource = new MatTableDataSource(really.documents);
      }, error => {
        if (error.error.status != 409)
          this.snackBarMessage(error.error.message, 6000);
      })
    }, error => {
      this.snackBarMessage(error.error.message, 6000);
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
  cambioIndice(ev: any) {
    // console.log(ev.selectedIndex);
    this.indice = ev.selectedIndex;
    // console.log(this.indice);
  }
  changeLastNames(ev: any, ele: any) {
    console.log(ev);
    this[ele].person.lastName = ev.lastName;
    if (this[ele].person.lastNames.options) {
      this[ele].person.secondLastName = '';
    }
    else {
      this[ele].person.secondLastName = ev.secondLastName;
    }
    console.log(this[ele]);
  }
  changeSecondLastNames(ev: any, ele: any) {
    this[ele].person.secondLastName = ev.secondLastName;
  }
  updatePerson(person: any) {
    let really = this;
    this.personService.putPerson(this[person].person.id, this[person].person).subscribe((response: any) => {
      really.snackBarMessage('Actualizado con Éxito', 5000);
    }, error => {
      really.snackBarMessage(error.error.message, 6000);
    })
  }
  showDatosActa() {
    let aux = false;
    this.model.procedureHasAttributeValues.forEach(element => {
      if (element.enableForEdit)
        aux = true;
    });
    return this.model.procedureHasAttributeValues.length > 0 && aux;
  }

}
