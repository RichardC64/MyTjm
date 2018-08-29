import { HttpClient } from '@angular/common/http';
import { Directive, ElementRef, Input, HostListener } from '@angular/core';
import { map } from 'rxjs/operators';

@Directive({
  selector: '[appHttpSrc]'
})
export class HttpSrcDirective {
  private _appHttpSrc: string;
  private _url: string;

  constructor(
    private el: ElementRef,
    private http: HttpClient) {
  }

  public get appHttpSrc(): string {
    return this._appHttpSrc;
  }
  @Input()
  public set appHttpSrc(v: string) {
    this._appHttpSrc = v;
    // on fait un appel Http pour récupére l'image(format blob)
    this.http.get(v, { responseType: 'blob' }).pipe(
      map(val => {
        // on crée l'url
        return URL.createObjectURL(val);
      }))
      .subscribe(url => {
        // on dit au tag img que son url c'est l'url crée ci-dessus
        this.el.nativeElement.src = url;
      });
  }

  @HostListener('load') onLoad() {
    if (this._url != null) {
      // on libère la mémoire du blob sauvegardé
      URL.revokeObjectURL(this._url);
    }
  }
}
