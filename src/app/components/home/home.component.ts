import { Component, OnInit } from '@angular/core';
import { AuthData } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Movie } from 'src/app/models/movie.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/service/movie.service';
import { Favourite } from 'src/app/models/favourite.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  sub!: Subscription;
  user!: AuthData | null;
  movies: Movie[] | undefined;
  favMovie!: Favourite | null;
  myFavMov: Favourite[] | undefined;

  constructor(private authSrv: AuthService, private movieSrv: MovieService) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((_user) => {
      this.user = _user;
    });
    this.sub = this.movieSrv.recupera().subscribe((movies: Movie[]) => {
      this.movies = movies;
      console.log(this.movies);
    });

    this.sub = this.movieSrv
      .recuperaFav(this.user?.user?.id!)
      .subscribe((myFavMov: Favourite[]) => {
        this.myFavMov = myFavMov;
        console.log(this.myFavMov);
      });
  }

  likeIt(movieId: number, userId: number) {
    const alreadyLiked = this.movieLiked(movieId);
    const favMovieId = this.myFavMov?.find((fav) => fav.movieId === movieId)?.id;
    this.favMovie = {
      movieId: movieId,
      userId: userId,
      id: favMovieId
    };
    console.log(this.favMovie);
    console.log(favMovieId);



    if (alreadyLiked) {
      if (this.favMovie.id !== undefined) {
      this.movieSrv.eliminaFav(this.favMovie.id).subscribe(() => {
        this.myFavMov = this.myFavMov?.filter(fav => fav.movieId !== movieId);
      })};
    } else {
      this.movieSrv.miPiace(this.favMovie).subscribe(() => {
        this.myFavMov?.push(this.favMovie!);
      });
    }
  }

  movieLiked(movieId: number): boolean {
    return this.myFavMov?.some((fav) => fav.movieId === movieId) || false;
  }
}