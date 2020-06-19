import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'DifuntosSafeHtml'})
export class DifuntosSafeHtmlPipe {
  constructor(private sanitizer: DomSanitizer){}

  transform(html: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}