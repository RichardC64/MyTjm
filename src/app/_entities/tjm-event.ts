import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { ITjmEventData } from './tjm-event-data';

export interface ITjmEvent {
    outlookEvent: MicrosoftGraph.Event;
    datas: ITjmEventData;
}

