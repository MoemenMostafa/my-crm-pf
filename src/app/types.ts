export interface ITrip{
  from:string;
  to:string;
  type:string;
}
export interface IData{
  currency: string;
  deals: IDeal[];
}

export interface IDeal {
  arrival:string;
  cost: number;
  departure: string;
  discount: number;
  duration: IDuration;
  durationMin: number
  reference: string;
  transport: string;
}

export interface IDuration{
  h: string;
  m: string;
}

export class Duration implements IDuration{
  m: string;
  h: string;
  constructor(mins: number){
    this.h = (mins / 60 | 0).toString();
    this.m = (mins % 60 | 0).toString();
  }
}
