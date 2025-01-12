import { Falta } from "./falta.model";

export interface Examen {
  fecha: Date;
  faltas: Falta[];
  resultado: 'apto' | 'no-apto';
}
