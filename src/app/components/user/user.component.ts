import { Component, OnInit } from '@angular/core';
import { AuthData } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription, forkJoin } from 'rxjs';
import { Favourite } from 'src/app/models/favourite.interface';
import { MovieService } from 'src/app/service/movie.service';
import { Movie } from 'src/app/models/movie.interface';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user.interface';
declare var window: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user!: AuthData | null;
  sub!: Subscription;
  myFavMov: Favourite[] = [];
  movies!: Movie[] | undefined;
  favMovies: Movie[] = [];
  formModal: any;
  nameValue: string | undefined;
  emailValue: string | undefined;
  editUser!: User | null;

  constructor(private authSrv: AuthService, private movieSrv: MovieService) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((_user) => {
      this.user = _user;
      this.nameValue = this.user?.user?.name;
      this.emailValue = this.user?.user?.email;
    });

    const movieRequest = this.movieSrv.recupera();
    const favMoviesRequest = this.movieSrv.recuperaFav(this.user?.user?.id!);

    this.sub = forkJoin([movieRequest, favMoviesRequest]).subscribe(
      ([movies, myFavMov]) => {
        this.myFavMov = myFavMov;
        this.favMovies = movies.filter((movie) =>
          this.myFavMov?.some((fav) => fav.movieId === movie.id)
        );
      }
    );

    this.formModal = new window.bootstrap.Modal(
      document.getElementById('modifyModal')
    );

    this.sub = this.movieSrv
      .recuperaUser(this.user?.user?.id!)
      .subscribe((user: User) => {
        this.editUser = user;
        console.log(this.editUser);
      });
  }

  rimuoviFav(favMovieId: number) {
    const index = this.myFavMov?.findIndex((fav) => fav.movieId === favMovieId);
    if (index !== undefined && index !== -1) {
      const movieId = this.myFavMov[index].id;
      this.movieSrv.eliminaFav(movieId!).subscribe(() => {
        this.favMovies = this.favMovies?.filter((fav) => fav.id !== favMovieId);
      });
    }
  }

  openModal() {
    this.formModal.show();
  }

  modifica(form: NgForm) {
    let userId = this.editUser?.id;
    if (this.editUser) {
      this.editUser = {
        email: form.value.email,
        name: form.value.name,
        password: form.value.password,
        id: userId
      };
      console.log(this.editUser);

      if (userId) {
        this.sub = this.movieSrv
          .modificaUser(this.editUser, userId)
          .subscribe((user: User) => {
            this.editUser = user;
            if (this.user) {
              this.user.user.name = user.name;
              this.user.user.email = user.email;
              this.authSrv.authSubj.next(this.user)
            }
          },(error) =>{
            console.error(error)
          });
      }
    }
  }
}
