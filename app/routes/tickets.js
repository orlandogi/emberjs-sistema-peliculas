import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MoviesRoute extends Route {
    @service auth;
    @service router;
    beforeModel() {
    
        if((this.auth.loadTokenFromStorage() === true) && (this.auth.loadTypeOfUser() === true)){
            this.router.transitionTo('tickets');
          }

      if((this.auth.loadTokenFromStorage() === true) && (this.auth.loadTypeOfUser() === false)){
        this.router.transitionTo('taquillero');
      }
  
      if (!this.auth.loadTokenFromStorage() && !this.auth.loadTypeOfUser()) {
              this.router.transitionTo('login');
        }
      }
}
