import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'OponentesSafeHtml'})
export class OponentesSafeHtmlPipe {
  constructor(private sanitizer: DomSanitizer){}

  transform(html: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(html);
  }
}