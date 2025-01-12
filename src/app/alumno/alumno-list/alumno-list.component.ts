import { Component, Signal, signal, computed } from '@angular/core';
import { Alumno } from '../../model/alumno.model';
import { AlumnoAddComponent } from '../alumno-add/alumno-add.component';
import { Router } from '@angular/router';
import { AlumnoService } from '../../services/alumno.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Examen } from '../../model/examen.model';

@Component({
  selector: 'app-alumno-list',
  imports: [AlumnoAddComponent, DecimalPipe, DatePipe],
  templateUrl: './alumno-list.component.html',
  styleUrls: ['./alumno-list.component.scss'],
})
export class AlumnoListComponent {
  // Signals para gestionar datos
  alumnos = signal<Alumno[]>([]);
  mostrarModal = signal(false);
  alumnoSeleccionado = signal<Alumno | null>(null);
  examenesAnteriores = signal<Examen[]>([]);

  // Signal para calcular el porcentaje de aprobados
  porcentajeAprobados = computed(() => {
    const examenes = this.examenesAnteriores();
    if (!examenes.length) return 0;

    const aprobados = examenes.filter((examen) => examen.resultado === 'apto').length;
    return (aprobados / examenes.length) * 100;
  });

  // Signal para calcular los errores más comunes
  topErrores = computed(() => {
    const examenes = this.examenesAnteriores();
    if (!examenes.length) return [];

    const erroresMap = new Map<string, number>();

    // Acumular las faltas en un Map
    examenes.forEach((examen) => {
      examen.faltas.forEach((falta) => {
        const count = erroresMap.get(falta.descripcion) || 0;
        erroresMap.set(falta.descripcion, count + falta.veces);
      });
    });

    // Convertir el Map a un array ordenado
    const erroresArray = Array.from(erroresMap.entries())
      .map(([descripcion, veces]) => ({ descripcion, veces }))
      .sort((a, b) => b.veces - a.veces) // Orden descendente
      .slice(0, 5); // Top 5

    return erroresArray;
  });

  constructor(private router: Router, private alumnoService: AlumnoService) {
    // Cargamos los alumnos usando signals
    this.alumnoService.getAlumnos().then((alumnos) => {
      this.alumnos.set(alumnos);
    });
  }

  onAlumnoAdded(alumno: Alumno) {
    // Actualizamos los alumnos cuando se añade uno nuevo
    const updatedAlumnos = [...this.alumnos(), alumno];
    this.alumnos.set(updatedAlumnos);
    this.alumnoService.saveAlumnos(updatedAlumnos);
  }

  comprobarExamen(alumno: Alumno) {
    const examenes = alumno.examenes;
    if (examenes && examenes.length > 0) {
      this.alumnoSeleccionado.set(alumno);
      this.examenesAnteriores.set(examenes);
      this.mostrarModal.set(true);
    } else {
      this.iniciarExamen(alumno);
    }
  }

  iniciarExamen(alumno: Alumno | null = this.alumnoSeleccionado()) {
    if (alumno) {
      this.router.navigate(['/examen'], { state: { alumno } });
    }
    this.cerrarModal();
  }

  verResultado(examen: Examen) {
    this.router.navigate(['/resultado'], { state: { examen, alumno: this.alumnoSeleccionado() } });
    this.cerrarModal();
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.alumnoSeleccionado.set(null);
    this.examenesAnteriores.set([]);
  }
}
