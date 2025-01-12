import { Component, signal } from '@angular/core';
import { Alumno } from '../../model/alumno.model';
import { Falta } from '../../model/falta.model';
import { Router } from '@angular/router';
import { Examen } from '../../model/examen.model';

@Component({
  selector: 'app-examen',
  imports: [],
  templateUrl: './examen.component.html',
  styleUrl: './examen.component.scss'
})
export class ExamenComponent {
  alumno: Alumno | null = null;
  erroresDGT: Falta[] = [];
  filtros: string[] = ['Todas', 'leve', 'deficiente', 'eliminatoria'];
  filtroActivo: string = 'Todas';
  faltasFiltradas = signal<Falta[]>([]);
  resultado = signal<'apto' | 'no-apto'>('apto');

  constructor(private router: Router) {
    const navState = this.router.getCurrentNavigation()?.extras.state as { examen: Examen; alumno: Alumno };
    this.alumno = navState?.alumno ?? null;
    this.inicializarErrores();
  }

  inicializarErrores() {
    this.erroresDGT = [
      { tipo: 'leve', descripcion: 'No ajustar correctamente el asiento antes de iniciar la marcha', veces: 0, icon: '🪑' },
      { tipo: 'leve', descripcion: 'No regular los espejos retrovisores adecuadamente', veces: 0, icon: '🪞' },
      { tipo: 'leve', descripcion: 'No colocarse el cinturón de seguridad antes de arrancar', veces: 0, icon: '🔒' },
      { tipo: 'leve', descripcion: 'No observar los espejos retrovisores con la frecuencia adecuada durante la conducción', veces: 0, icon: '👀' },
      { tipo: 'leve', descripcion: 'Circular a una velocidad ligeramente inadecuada para las condiciones de la vía', veces: 0, icon: '🏎️' },
      { tipo: 'leve', descripcion: 'Uso ineficiente del cambio de marchas', veces: 0, icon: '⚙️' },
      { tipo: 'leve', descripcion: 'No señalizar una maniobra con suficiente antelación', veces: 0, icon: '✋' },
      { tipo: 'leve', descripcion: 'Frenar de manera brusca sin motivo justificado', veces: 0, icon: '❗' },
      { tipo: 'leve', descripcion: 'No mantener una distancia lateral adecuada al adelantar vehículos estacionados', veces: 0, icon: '↔️' },
      { tipo: 'leve', descripcion: 'No utilizar correctamente las luces indicadoras de dirección', veces: 0, icon: '💡' },
    
      { tipo: 'deficiente', descripcion: 'No ceder el paso en una intersección con señal de "Ceda el paso"', veces: 0, icon: '🚸' },
      { tipo: 'deficiente', descripcion: 'Incorporarse a la circulación sin observar adecuadamente el tráfico', veces: 0, icon: '👀' },
      { tipo: 'deficiente', descripcion: 'No mantener la distancia de seguridad con el vehículo precedente', veces: 0, icon: '↔️' },
      { tipo: 'deficiente', descripcion: 'Adelantar sin comprobar los espejos retrovisores', veces: 0, icon: '🪞' },
      { tipo: 'deficiente', descripcion: 'No respetar la prioridad de paso en una rotonda', veces: 0, icon: '🔄' },
      { tipo: 'deficiente', descripcion: 'Realizar un cambio de carril sin señalizar la maniobra', veces: 0, icon: '↔️' },
      { tipo: 'deficiente', descripcion: 'Detener el vehículo invadiendo un paso de peatones', veces: 0, icon: '🚶' },
      { tipo: 'deficiente', descripcion: 'No adaptarse a la velocidad máxima permitida en la vía', veces: 0, icon: '⚡' },
      { tipo: 'deficiente', descripcion: 'Circular por el carril izquierdo sin justificación en una vía de varios carriles', veces: 0, icon: '🛣️' },
      { tipo: 'deficiente', descripcion: 'No facilitar el adelantamiento a otro vehículo cuando es seguro hacerlo', veces: 0, icon: '🤝' },
    
      { tipo: 'eliminatoria', descripcion: 'Saltarse un semáforo en rojo', veces: 0, icon: '🚦' },
      { tipo: 'eliminatoria', descripcion: 'No detenerse ante una señal de "STOP"', veces: 0, icon: '🛑' },
      { tipo: 'eliminatoria', descripcion: 'Conducir en sentido contrario al establecido', veces: 0, icon: '↩️' },
      { tipo: 'eliminatoria', descripcion: 'Invadir un carril reservado para el sentido opuesto en una vía de doble sentido', veces: 0, icon: '↔️' },
      { tipo: 'eliminatoria', descripcion: 'No respetar la señalización de un paso a nivel', veces: 0, icon: '🚂' },
      { tipo: 'eliminatoria', descripcion: 'Adelantar en lugares prohibidos, como curvas o cambios de rasante sin visibilidad', veces: 0, icon: '⛔' },
      { tipo: 'eliminatoria', descripcion: 'No ceder el paso a peatones en un paso de peatones', veces: 0, icon: '🚶' },
      { tipo: 'eliminatoria', descripcion: 'Realizar una maniobra que obligue a otros conductores a frenar o desviarse bruscamente', veces: 0, icon: '⚠️' },
      { tipo: 'eliminatoria', descripcion: 'Conducir bajo los efectos del alcohol o drogas', veces: 0, icon: '🍺' },
      { tipo: 'eliminatoria', descripcion: 'Poner en peligro la integridad física propia o de otros usuarios de la vía', veces: 0, icon: '❗' },
    ];
    

    this.filtroActivo = 'Todas';
    this.faltasFiltradas.set(this.obtenerFaltasFiltradas());
  }

  cambiarFiltro(filtro: string) {
    this.filtroActivo = filtro;
    this.faltasFiltradas.set(this.obtenerFaltasFiltradas());
  }

  obtenerFaltasFiltradas(): Falta[] {
    if (this.filtroActivo === 'Todas') {
      return this.erroresDGT;
    }
    return this.erroresDGT.filter(f => f.tipo === this.filtroActivo);
  }

  agregarFalta(error: Falta) {
    error.veces++;
    this.calcularResultado();
  }

  finalizarExamen() {
    const faltas: Falta[] = this.erroresDGT.filter(error => error.veces > 0);

    this.calcularResultado(faltas);

    // Crear el nuevo examen
    const nuevoExamen: Examen = {
      fecha: new Date(),
      faltas,
      resultado: this.resultado(),
    };

    // Añadir el examen al historial del alumno
    this.alumno?.examenes.push(nuevoExamen);

    console.log('Examen finalizado', nuevoExamen);
    this.router.navigate(['/resultado'], { state: { examen: nuevoExamen, alumno: this.alumno } });
  }

  calcularResultado(faltas: Falta[] = this.erroresDGT.filter(error => error.veces > 0)): 'apto' | 'no-apto' {
    // Contar el número total de faltas por tipo
    const leves = faltas
      .filter(f => f.tipo === 'leve')
      .reduce((sum, f) => sum + f.veces, 0);

    const deficientes = faltas
      .filter(f => f.tipo === 'deficiente')
      .reduce((sum, f) => sum + f.veces, 0);

    const eliminatorias = faltas
      .filter(f => f.tipo === 'eliminatoria')
      .reduce((sum, f) => sum + f.veces, 0);

    // Determinar el resultado del examen siguiendo el baremo
    let resultado: 'apto' | 'no-apto';

    if (eliminatorias >= 1) {
      // Caso 1: Una falta eliminatoria
      resultado = 'no-apto';
    } else if (deficientes >= 2) {
      // Caso 2: Dos faltas deficientes
      resultado = 'no-apto';
    } else if (deficientes >= 1 && leves >= 5) {
      // Caso 3: Una falta deficiente y cinco leves
      resultado = 'no-apto';
    } else if (leves >= 10) {
      // Caso 4: Diez faltas leves
      resultado = 'no-apto';
    } else {
      // Si no entra en ninguno de los casos anteriores
      resultado = 'apto';
    }

    this.resultado.set(resultado);
    return resultado;
  }

  goBack() {
    this.router.navigate(['/alumnos']);
  }

}
