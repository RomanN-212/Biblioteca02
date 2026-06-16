import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILibro } from '../models/libro.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '/api/libros';

  constructor(private http: HttpClient) { }

  getLibros(): Observable<ILibro[]> {
    return this.http.get<ILibro[]>(this.apiUrl);
  }

  createLibro(libro: any): Observable<ILibro> {
    return this.http.post<ILibro>(this.apiUrl, libro);
  }

updateLibro(id: number, libro: any): Observable<ILibro> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.put<ILibro>(url, libro);
}

  deleteLibro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}