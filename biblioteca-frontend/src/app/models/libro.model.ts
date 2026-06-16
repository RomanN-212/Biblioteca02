
export interface ILibro {
  id?: number;  
  titulo: string;
  autor: string;
  publicacion?: number | null;
  genero?: string | null;
  disponibilidad: boolean;
}

export class LibroFormData implements ILibro {
  id?: number;
  titulo: string = '';
  autor: string = '';
  publicacion?: number | null = null;
  genero?: string | null = '';
  disponibilidad: boolean = true;

  constructor(libro?: ILibro) {
    if (libro) {
      this.id = libro.id;
      this.titulo = libro.titulo;
      this.autor = libro.autor;
      this.publicacion = libro.publicacion;
      this.genero = libro.genero;
      this.disponibilidad = libro.disponibilidad;
    }
  }
}