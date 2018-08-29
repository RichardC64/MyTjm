import { IClient } from './client';
import { DayPosition } from './day-position';

export interface ITjmEventData {
    client: IClient;
    cost: number;
    dayPosition: DayPosition;
}
