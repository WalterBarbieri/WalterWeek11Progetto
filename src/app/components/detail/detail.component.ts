import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthData } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { Movie } from 'src/app/models/movie.interface';
import { MovieService } from 'src/app/service/movie.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  movieId!: number;
  user!: AuthData | null;
  movie!: Movie;
  sub!: Subscription;

  constructor(private route: ActivatedRoute, private authSrv: AuthService, private movieSrv: MovieService) { }

  ngOnInit(): void {
    this.authSrv.user$.subscribe((_user) => {
      this.user = _user;
    });

    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
    })

    this.sub = this.movieSrv.recuperaMovie(this.movieId).subscribe((movie: Movie) =>{
      this.movie = movie;
      console.log(this.movie);

    })
  }

}
