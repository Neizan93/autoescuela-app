import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Alumno } from '../../model/alumno.model';
import { Examen } from '../../model/examen.model';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { AlumnoService } from '../../services/alumno.service';

@Component({
  selector: 'app-resultado',
  imports: [UpperCasePipe, DatePipe],
  templateUrl: './resultado.component.html',
  styleUrl: './resultado.component.scss'
})
export class ResultadoComponent {
  examen: Examen | null = null;
  alumno: Alumno | null = null;

  constructor(private router: Router, private alumnoService: AlumnoService) {
    const navState = this.router.getCurrentNavigation()?.extras.state as { examen: Examen; alumno: Alumno };
    this.examen = navState?.examen ?? null;
    this.alumno = navState?.alumno ?? null;

    if (this.examen && this.alumno) {
      this.alumno.examenes.push(this.examen);
      this.updateAlumno(this.alumno);
    }
  }

  updateAlumno(alumno: Alumno) {
    this.alumnoService.getAlumnos().then(alumnos => {
      const index = alumnos.findIndex(a => a.nombre === alumno.nombre);
      if (index !== -1) {
        alumnos[index] = alumno;
        this.alumnoService.saveAlumnos(alumnos);
      }
    });
  }

  shareResults() {
    if (this.examen) {
      this.alumnoService.shareResults(this.examen);
    }
  }

  goBack() {
    this.router.navigate(['/alumnos']);
  }
}
