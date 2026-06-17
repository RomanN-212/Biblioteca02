import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { ILibro, LibroFormData } from '../../models/libro.model';
import { LibroModalComponent } from '../Modal/modal-registro.components';

@Component({
  selector: 'app-libro-list',
  standalone: true,
  imports: [CommonModule, LibroModalComponent],
  templateUrl: './libro-list.component.html',
  styleUrls: ['./libro-list.component.scss']
})
export class LibroListComponent implements OnInit {
  libros: ILibro[] = [];
  librosPaginados: ILibro[] = []; 
  cargando = true;
  
  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;

  mostrarModal: boolean = false;
  libroSeleccionado: LibroFormData = new LibroFormData();
  modoModal: 'ver' | 'editar' | 'crear' = 'crear';

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef  
  ) {}

  ngOnInit() {
    this.cargarLibros();
  }
  
  cargarLibros() {
    this.apiService.getLibros().subscribe({
      next: (data: ILibro[]) => {
        this.libros = data;
        this.totalPaginas = Math.ceil(this.libros.length / this.elementosPorPagina);
        this.actualizarPagina();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar libros:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }



  
  actualizarPagina() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.librosPaginados = this.libros.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarPagina();
    }
  }

  siguientePagina() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPagina();
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPagina();
    }
  }

  get paginas(): number[] {
    return Array(this.totalPaginas).fill(0).map((_, i) => i + 1);
  }

  get rangoMostrado(): string {
    if (this.libros.length === 0) return '0 - 0';
    const inicio = ((this.paginaActual - 1) * this.elementosPorPagina) + 1;
    const fin = Math.min(this.paginaActual * this.elementosPorPagina, this.libros.length);
    return `${inicio} - ${fin}`;
  }

  


  
  abrirModalCrear() {
    this.libroSeleccionado = new LibroFormData(); 
    this.modoModal = 'crear';
    this.mostrarModal = true;
  }

  abrirModalVer(libro: ILibro) {
    const libroForm = new LibroFormData();
    libroForm.id = libro.id;
    libroForm.titulo = libro.titulo;
    libroForm.autor = libro.autor;
    libroForm.publicacion = libro.publicacion;
    libroForm.genero = libro.genero;
    libroForm.disponibilidad = libro.disponibilidad;
    
    this.libroSeleccionado = libroForm;
    this.modoModal = 'ver';
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.libroSeleccionado = new LibroFormData();  
    this.cdr.detectChanges();
  }


  

actualizarLibro(libroForm: LibroFormData) {
  
  if (!libroForm.id) {
    console.error(' No hay ID para actualizar');
    return;
  }
  
  const libroActualizado = {
    titulo: libroForm.titulo,
    autor: libroForm.autor,
    publicacion: libroForm.publicacion,
    genero: libroForm.genero,
    disponibilidad: libroForm.disponibilidad
  };
  
  
  this.apiService.updateLibro(libroForm.id, libroActualizado).subscribe({
    next: (libroModificado: ILibro) => {
      const index = this.libros.findIndex(l => l.id === libroModificado.id);
      if (index !== -1) {
        this.libros[index] = libroModificado;
        this.actualizarPagina();
      }
      this.cerrarModal();
    },
    error: (err: any) => {
      console.error(' Error en la petición:', err);
      console.error('Status:', err.status);
      console.error('Mensaje:', err.message);
      console.error('Respuesta:', err.error);
    }
  });
}

  guardarLibro(libroForm: LibroFormData) {
  if (!libroForm.id) {
    const nuevoLibro = {
      titulo: libroForm.titulo,
      autor: libroForm.autor,
      publicacion: libroForm.publicacion,
      genero: libroForm.genero,
      disponibilidad: libroForm.disponibilidad
    };
    
    this.apiService.createLibro(nuevoLibro).subscribe({
      next: (libroCreado: ILibro) => {
        this.libros.push(libroCreado);
        this.totalPaginas = Math.ceil(this.libros.length / this.elementosPorPagina);
        this.paginaActual = this.totalPaginas;
        this.actualizarPagina();
        this.cerrarModal();
      },
      error: (err: any) => {
        console.error(' Error al crear:', err);
      }
    });
  } else {
    this.actualizarLibro(libroForm);
  }
}

eliminarLibro(id: number) {
  console.log('🗑️ Eliminando libro ID:', id);
  
  this.apiService.deleteLibro(id).subscribe({
    next: () => {
      this.libros = this.libros.filter(l => l.id !== id);
      
      this.totalPaginas = Math.ceil(this.libros.length / this.elementosPorPagina);
      
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = this.totalPaginas || 1;
      }
      
      this.actualizarPagina();
      this.cerrarModal();
      console.log('✅ Libro eliminado correctamente');
    },
    error: (err: any) => {
      console.error('❌ Error al eliminar:', err);
      alert('Error al eliminar el libro');
    }
  });
}
}