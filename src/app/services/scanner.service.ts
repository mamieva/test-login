import { Injectable } from '@angular/core';

import { HttpProxy } from './util/http.proxy';
import { AppSettings } from '../app.settings';

@Injectable()
export class ScannerService {
    constructor(
        private http: HttpProxy
    ) { }

    digitalize(cmp: any, documentType: any, addPage?: any) {
        let really = cmp;
        let imagen = '';
        let cant = 0;
        let addpage = addPage;
        let recibido = false;
        
        var ws = new WebSocket(`ws://${AppSettings.SCANNER_ENDPOINT}`);
        ws.binaryType = "arraybuffer";
        ws.onopen = function (event) {
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

                really.snackBarMessage('Documento recibido, Subiendo!', 6000);
                really.uploadFile(out, imagen, documentType.code, documentType.documentId, addPage);
            }
            else {
                if (!recibido)
                    really.snackBarMessage('Recibiendo Documento Escaneado!!', 7000);
                else
                    recibido = true;
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
        };
    }

    uploadFile(cmp: any, compressBase64: any, base64: any, attachmentType: any, documentId?: any, addPage?: any) {
        let really = cmp;
        let file = {
            procedureId: cmp.model.id,
            documentType: attachmentType,
            id: documentId && addPage ? documentId : null,
            compressBase64: compressBase64,
            // base64: base64
        };
        cmp.procedureService.uploadAttachmentProcedure(file).subscribe((response: any) => {
            cmp.matchDocuments();
            cmp.snackBarMessage('Archivo digitalizado con Éxito', 6000);
        }, error => {
            cmp.snackBarMessage(error.error.message, 6000);
        });
    }
    deleteFiles(cmp: any, document: any) {
        cmp.procedureService.deleteFiles(document.documentId).subscribe((response: any) => {
            cmp.snackBarMessage('Documento eliminado con Éxito', 6000);
            cmp.matchDocuments();
        }, error => {
            cmp.snackBarMessage(error.error.message, 6000);
        })
    }
}