import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {take, map, tap} from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class Authguard2Service implements CanActivate{
  constructor(private afAuth: AngularFireAuth, private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (loggedIn) {
          this.router.navigate(['itens']);
        }
      })
    )
  }
}
