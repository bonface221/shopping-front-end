import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';
import { Observable, shareReplay, tap } from 'rxjs';

import jwtDecode from 'jwt-decode';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiRoot = 'http://localhost:8000/auth/';

  constructor(private http: HttpClient, private router: Router) {}

  private setSession(authResult: string) {
    const token = authResult;
    const payload = jwtDecode<JWTPayload>(token);
    // console.log(payload)
    const expiresAt = moment.unix(payload.exp);

    localStorage.setItem('token', token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  get token(): string {
    return localStorage.getItem('token')!;
  }
  get tokenRefresh(): string {
    return localStorage.getItem('tokenRefresh')!;
  }

  login(username: string, password: string) {
    return this.http
      .post<Tokens>(this.apiRoot.concat('login/'), { username, password })
      .pipe(
        tap((response) => {
          this.setSession(response.access_token);
          localStorage.setItem('tokenRefresh', response.refresh_token);
          // console.log(response)
        }),
        shareReplay()
      );
  }
  signup(
    username: string,
    email: string,
    password1: string,
    password2: string
  ) {
    // implement signup
    return this.http
      .post<Tokens>(this.apiRoot.concat('signup/'), {
        username,
        email,
        password1,
        password2,
      })
      .pipe(
        tap((response) => {
          console.log(response);
          // this.setSession(response.access_token)
          // localStorage.setItem('tokenRefresh',response.refresh_token)
        }),
        shareReplay()
      );
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenRefresh');
    localStorage.removeItem('expires_at');
  }
  refreshToken() {
    if (
      moment().isBetween(
        this.getExpiration().subtract(1, 'day'),
        this.getExpiration()
      )
    ) {
      return this.http
        .post<Refresh>(this.apiRoot.concat('refresh-token/'), {
          refresh: this.tokenRefresh,
        })
        .pipe(
          tap((response) => {
            this.setSession(response.access);
          }),
          shareReplay()
        )
        .subscribe();
    }
    return;
  }
  // {
  // 'access':iejeiejijeifjiejiejfiejfie
  // }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration!);

    return moment(expiresAt);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log(token);

    if (token) {
      const cloned = req.clone({
        //Authorization : Bearer kkkdjijfidjsdksjskjfkdj
        headers: req.headers.set('Authorization', 'Bearer '.concat(token)),
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.authService.refreshToken();

      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['login']);

      return false;
    }
  }
}
interface JWTPayload {
  user_id: number;
  username: string;
  email: string;
  exp: number;
}
interface Tokens {
  access_token: string;
  refresh_token: string;
  user: {
    pk: number;
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}
interface Refresh {
  access: string;
}
