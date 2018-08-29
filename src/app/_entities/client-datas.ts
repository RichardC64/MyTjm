import { IClient } from '@entities';

export interface IClientDatas {
    lastUpdateDateTime: string;
    clients: IClient[];
}
