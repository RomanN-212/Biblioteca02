import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ILibro, LibroFormData } from '../../models/libro.model';



@Component({
  selector: 'app-libro-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-registro.components.html',
  styleUrls: ['./modal-registro.components.scss']
})
export class LibroModalComponent implements OnChanges {
  @Input() libro: LibroFormData = new LibroFormData();
  @Input() modo: 'ver' | 'editar' | 'crear' = 'crear';
  @Output() guardar = new EventEmitter<LibroFormData>();
  @Output() cerrar = new EventEmitter<void>();
  @ViewChild('libroForm') libroForm!: NgForm;
  @Output() eliminar = new EventEmitter<number>();

  libroEditando: LibroFormData = new LibroFormData();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['libro'] && this.libro) {
      this.libroEditando = new LibroFormData();
      this.libroEditando.id = this.libro.id;
      this.libroEditando.titulo = this.libro.titulo;
      this.libroEditando.autor = this.libro.autor;
      this.libroEditando.publicacion = this.libro.publicacion;
      this.libroEditando.genero = this.libro.genero;
      this.libroEditando.disponibilidad = this.libro.disponibilidad;
    }
  }

  get tituloModal(): string {
    const titulos = {
      'ver': '📖 Detalles del Libro',
      'editar': '✏️ Editar Libro',
      'crear': '➕ Nuevo Libro'
    };
    return titulos[this.modo];
  }

  get esSoloLectura(): boolean {
    return this.modo === 'ver';
  }

  get mostrandoVer(): boolean {
    return this.modo === 'ver';
  }

  get mostrandoEditar(): boolean {
    return this.modo === 'editar';
  }

  get mostrandoCrear(): boolean {
    return this.modo === 'crear';
  }

  activarEdicion() {
    this.modo = 'editar';
  }

  cancelarEdicion() {
    this.libroEditando.id = this.libro.id;
    this.libroEditando.titulo = this.libro.titulo;
    this.libroEditando.autor = this.libro.autor;
    this.libroEditando.publicacion = this.libro.publicacion;
    this.libroEditando.genero = this.libro.genero;
    this.libroEditando.disponibilidad = this.libro.disponibilidad;
    this.modo = 'ver';
  }

  onSubmit() {
    this.guardar.emit(this.libroEditando);
  }

  onCerrar() {
    this.cerrar.emit();
  }

  onEliminar() {
  console.log('🗑️ Solicitud de eliminación para libro ID:', this.libro.id);
  if (this.libro.id && confirm('¿Estás seguro de eliminar este libro?')) {
    this.eliminar.emit(this.libro.id);
  }
}

}