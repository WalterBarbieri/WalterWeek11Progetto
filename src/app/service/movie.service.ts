import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Movie } from '../models/movie.interface';
import { Favourite } from '../models/favourite.interface';
import { Genre } from '../models/genre.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {



  baseURL = environment.baseURL;

  constructor(private http: HttpClient) { }
  recupera() {
    return this.http.get<Movie[]>(`${this.baseURL}movies-popular`);
  }
  miPiace(favMovie: Favourite) {
    return this.http.post<Favourite>(`${this.baseURL}favorites`, favMovie)
  }

  recuperaFav(id: number) {
    return this.http.get<Favourite[]>(`${this.baseURL}favorites?userId=${id}`);
  }

  eliminaFav(id: number) {
    return this.http.delete(`${this.baseURL}favorites/${id}`)
  }

  recuperaMovie(id: number){
    return this.http.get<Movie>(`${this.baseURL}movies-popular/${id}`);
  }
  recuperaGenere() {
    return this.http.get<Genre[]>(`${this.baseURL}genres`)
  }

}
