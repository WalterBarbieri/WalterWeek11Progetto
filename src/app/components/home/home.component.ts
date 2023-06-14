import { Component, OnInit } from '@angular/core';
import { AuthData } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Movie } from 'src/app/models/movie.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MovieService } from 'src/app/service/movie.service';
import { Favourite } from 'src/app/models/favourite.interface';
import { Genre } from 'src/app/models/genre.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  sub!: Subscription;
  user!: AuthData | null;
  movies: Movie[] = [];
  favMovie!: Favourite | null;
  myFavMov: Favourite[] | undefined;
  favSub!: Subscription;
  genreSub!: Subscription;
  genres!: Genre[] | undefined;
  selectedGenre: string = 'Tutti i Generi';
  filteredMovies!: Movie[] | undefined;

  constructor(private authSrv: AuthService, private movieSrv: MovieService) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((_user) => {
      this.user = _user;
    });
    this.sub = this.movieSrv.recupera().subscribe((movies: Movie[]) => {
      this.movies = movies;
      this.filterMoviesByGenre();
    });

    this.favSub = this.movieSrv
      .recuperaFav(this.user?.user?.id!)
      .subscribe((myFavMov: Favourite[]) => {
        this.myFavMov = myFavMov;
      });

    this.genreSub = this.movieSrv
      .recuperaGenere()
      .subscribe((genere: Genre[]) => {
        this.genres = genere;
      });
  }

  likeIt(movieId: number, userId: number) {
    const alreadyLiked = this.movieLiked(movieId);
    const favMovieId = this.myFavMov?.find(
      (fav) => fav.movieId === movieId
    )?.id;
    this.favMovie = {
      movieId: movieId,
      userId: userId,
      id: favMovieId,
    };

    if (alreadyLiked) {
      if (this.favMovie.id !== undefined) {
        this.movieSrv.eliminaFav(this.favMovie.id).subscribe(() => {
          this.myFavMov = this.myFavMov?.filter(
            (fav) => fav.movieId !== movieId
          );
        });
      }
    } else {
      this.movieSrv
        .miPiace(this.favMovie)
        .subscribe((newFavMovie: Favourite) => {
          this.myFavMov?.push(newFavMovie);
        });
    }
  }

  movieLiked(movieId: number): boolean {
    return this.myFavMov?.some((fav) => fav.movieId === movieId) || false;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.favSub) {
      this.favSub.unsubscribe();
    }
  }

  onGenreChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedGenre = target.value || 'Tutti i Generi';
    this.filterMoviesByGenre();
  }

  filterMoviesByGenre() {
    if (this.selectedGenre === 'Tutti i Generi') {
      this.filteredMovies = this.movies;
    } else {
      this.filteredMovies = this.movies.filter(movie =>
        movie.genre_ids.includes(this.getGenreIdByName(this.selectedGenre))
      );
    }
  }

  getGenreIdByName(genreName: string): number  {
    const genre = this.genres?.find(genre => genre.name === genreName);
    return genre?.id!
  }
}
