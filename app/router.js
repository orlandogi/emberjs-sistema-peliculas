import EmberRouter from '@ember/routing/router';
import config from 'sistema-peliculas/config/environment';
import { inject as service } from '@ember/service';

export default class Router extends EmberRouter {
  @service auth;

  location = config.locationType;
  rootURL = config.rootURL;

  constructor() {
    super(...arguments);

    this.on('routeDidChange', () => {
      window.scrollTo(0, 0);
    });
  }
}

Router.map(function () {
  this.route('movies');
  this.route('publicar');
  this.route('taquillero');
  this.route('tickets');
  this.route('login');
  this.route('usuarios')
});

