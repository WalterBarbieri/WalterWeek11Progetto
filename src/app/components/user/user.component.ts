import { Component, OnInit } from '@angular/core';
import { AuthData } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, forkJoin } from 'rxjs';
import { Favourite } from 'src/app/models/favourite.interface';
import { MovieService } from 'src/app/service/movie.service';
import { Movie } from 'src/app/models/movie.interface';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  user!: AuthData | null;
  sub!: Subscription;
  myFavMov: Favourite[] | undefined;
  movies!: Movie[] | undefined;
  favMovies: Movie[] = [];

  constructor(private authSrv: AuthService, private movieSrv: MovieService) { }

  ngOnInit(): void {
    this.authSrv.user$.subscribe((_user) => {
      this.user = _user;
    })

    const movieRequest = this.movieSrv.recupera();
    const favMoviesRequest = this.movieSrv.recuperaFav(this.user?.user?.id!);

    this.sub = forkJoin([movieRequest, favMoviesRequest]).subscribe(
      ([movies, myFavMov]) => {
        this.myFavMov = myFavMov;
        this.favMovies = movies.filter((movie) =>
          this.myFavMov?.some((fav) => fav.movieId === movie.id)
        );
        console.log(this.favMovies);
      }
    );

    this.sub = this.movieSrv
      .recuperaFav(this.user?.user?.id!)
      .subscribe((myFavMov: Favourite[]) => {
        this.myFavMov = myFavMov;
        console.log(this.myFavMov);
      });
  }

}
