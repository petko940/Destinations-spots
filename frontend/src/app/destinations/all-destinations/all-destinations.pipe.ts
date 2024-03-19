import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { map } from 'rxjs';

@Pipe({
  name: 'allDestinations'
})
export class AllDestinationsPipe implements PipeTransform {

  constructor(private authService: AuthService) { }

  transform(userId: number) {
    return this.authService.getUsername(userId).pipe(
      map(data => data.username));
  }

}
