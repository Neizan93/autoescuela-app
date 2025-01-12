
export interface Falta {
    tipo: 'leve' | 'deficiente' | 'eliminatoria';
    descripcion: string;
    veces: number;
    icon: string;
}
