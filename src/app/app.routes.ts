import { Routes } from '@angular/router';
import { AlumnoListComponent } from './alumno/alumno-list/alumno-list.component';
import { ExamenComponent } from './examen/examen/examen.component';
import { ResultadoComponent } from './examen/resultado/resultado.component';

export const routes: Routes = [
    { path: '', redirectTo: 'alumnos', pathMatch: 'full' },
    { path: 'alumnos', component: AlumnoListComponent },
    { path: 'examen', component: ExamenComponent },
    { path: 'resultado', component: ResultadoComponent },
];
