import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'MatrimonioSafeHtml'})
export class MatrimonioSafeHtmlPipe {
  constructor(private sanitizer: DomSanitizer){}

  transform(html: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}