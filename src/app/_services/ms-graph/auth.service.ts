import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { IMsGraphToken } from '@entities';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'myTjm_Token';

  constructor() { }

  public login() {
    const url = this.getUrl();
    const width = 525,
      height = 525,
      screenX = window.screenX,
      screenY = window.screenY,
      outerWidth = window.outerWidth,
      outerHeight = window.outerHeight;

    const left = screenX + Math.max(outerWidth - width, 0) / 2;
    const top = screenY + Math.max(outerHeight - height, 0) / 2;

    const features = [
      'width=' + width,
      'height=' + height,
      'top=' + top,
      'left=' + left,
      'status=no',
      'resizable=yes',
      'toolbar=no',
      'menubar=no',
      'scrollbars=yes'];
    const popup = window.open(url, 'oauth', features.join(','));
    if (!popup) {
      alert('failed to pop up auth window');
    }
  }

  public logout() {
    localStorage.removeItem(this.tokenKey);
  }

  /** Appelée par le callbackComponent */
  public onCallback() {
    const token = this.getTokenFromURL();

    if (token) {
      this.saveAuthToken(token);
    }
    window.opener.location.reload();
    window.close();
  }

  /** Retourne le token d'identification du user dans Graph */
  public getAuthToken(): IMsGraphToken {
    return <IMsGraphToken>JSON.parse(localStorage.getItem(this.tokenKey));
  }

  private getTokenFromURL(): IMsGraphToken {
    if (window.location.hash) {
      const authResponse = window.location.hash.substring(1);
      const authInfo = JSON.parse(
        '{' + authResponse.replace(/([^=]+)=([^&]+)&?/g, '"$1":"$2",').slice(0, -1) + '}',
        (key, value) => key === '' ? value : decodeURIComponent(value));
      return authInfo;
    } else {
      alert('failed to receive auth token');
    }
  }

  private saveAuthToken(token: IMsGraphToken) {
    localStorage.setItem(this.tokenKey, JSON.stringify(token));
  }

  private getUrl(): string {
    let url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
    url += '?client_id=' + environment.appId;
    url += '&response_type=token';
    url += '&redirect_uri=' + encodeURIComponent(environment.callback);
    url += '&scope=' + encodeURIComponent(environment.scope);
    return url;
  }
}
