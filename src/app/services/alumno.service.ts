import { Injectable } from '@angular/core';
import { Alumno } from '../model/alumno.model';
import { Preferences } from '@capacitor/preferences';
import { Share } from '@capacitor/share';
import { Examen } from '../model/examen.model';
import { Falta } from '../model/falta.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor() { }

  async saveAlumnos(alumnos: Alumno[]) {
    await Preferences.set({
      key: 'alumnos',
      value: JSON.stringify(alumnos)
    });
  };

  async getAlumnos(): Promise<Alumno[]> {
    const { value } = await Preferences.get({ key: 'alumnos' });
    return value ? JSON.parse(value) : [];
  };


  async shareResults(examen: Examen) {
    Share.share({
      title: 'Resultado Examen',
      text: `¡El alumno ha obtenido un resultado de *${examen.resultado}* con *${examen.faltas.length}* faltas! \n\n${examen.faltas.map(falta => `Falta *${falta.tipo}*: ${falta.descripcion} (${falta.veces} ${falta.veces === 1 ? 'vez' : 'veces'})`).join(', \n')}`,
    });
  }

}
