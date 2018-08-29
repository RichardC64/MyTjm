import { Injectable } from '@angular/core';
import { IParameter } from '@entities';

const ParametersKey = 'myTjm_parameters';
const ParametersFileName = 'parameters.json';

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  constructor() { }

  public save(parameter: IParameter) {
    localStorage.setItem(ParametersKey, JSON.stringify(parameter));
  }

  public load(): IParameter {
    return <IParameter>JSON.parse(localStorage.getItem(ParametersKey));
  }
}
