import { Component, OnInit, Sanitizer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthData } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { Movie } from 'src/app/models/movie.interface';
import { MovieService } from 'src/app/service/movie.service';
import { Genre } from 'src/app/models/genre.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  movieId!: number;
  user!: AuthData | null;
  movie!: Movie;
  sub!: Subscription;
  genreSub!: Subscription;
  genres!: Genre[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private authSrv: AuthService,
    private movieSrv: MovieService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.authSrv.user$.subscribe((_user) => {
      this.user = _user;
    });

    this.route.params.subscribe((params) => {
      this.movieId = +params['id'];
    });

    this.sub = this.movieSrv
      .recuperaMovie(this.movieId)
      .subscribe((movie: Movie) => {
        this.movie = movie;
      });

    this.genreSub = this.movieSrv
      .recuperaGenere()
      .subscribe((genere: Genre[]) => {
        this.genres = genere;
      });
  }

  getGenreName(genreId: number): string {
    const genre = this.genres?.find((g) => g.id === genreId);
    return genre?.name || '';
  }

  getBackdropUrl(): SafeResourceUrl {
    const backdropUrl = `https://image.tmdb.org/t/p/w500${this.movie.backdrop_path}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(backdropUrl);
  }

  getVideoUrl(): SafeResourceUrl {
    const videoUrl = this.movie.video;
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl)
  }

}
