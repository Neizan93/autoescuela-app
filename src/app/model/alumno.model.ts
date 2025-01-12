import { Examen } from "./examen.model";

export interface Alumno {
    nombre: string;
    examenes: Examen[];
}
