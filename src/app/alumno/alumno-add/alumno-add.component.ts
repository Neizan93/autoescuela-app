import { Component, ElementRef, model, output, ViewChild } from '@angular/core';
import { Alumno } from '../../model/alumno.model';

@Component({
  selector: 'app-alumno-add',
  imports: [],
  templateUrl: './alumno-add.component.html',
  styleUrl: './alumno-add.component.scss'
})
export class AlumnoAddComponent {
  alumnoAdded = output<Alumno>();

  @ViewChild('nombreInput') nombreInput?: ElementRef<HTMLInputElement>;
  addAlumno(nombre: string) {
    if (nombre.trim()) {
      const nuevoAlumno: Alumno = { nombre: nombre.trim(), examenes: [] };
      this.alumnoAdded.emit(nuevoAlumno);
      if (this.nombreInput?.nativeElement) {
        this.nombreInput.nativeElement.value = '';
      }
    }
  }
}

