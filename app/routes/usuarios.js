import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UsuariosRoute extends Route {
    @service auth;
    @service router;
    beforeModel() {
      if((this.auth.loadTokenFromStorage() === true) && (this.auth.loadTypeOfUser() === false)){
        this.router.transitionTo('index');
      }
  
      if (!this.auth.loadTokenFromStorage() && !this.auth.loadTypeOfUser()) {
              this.router.transitionTo('login');
        }
      }
}
