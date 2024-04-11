import EmberRouter from '@ember/routing/router';
import config from 'sistema-peliculas/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('movies');
  this.route('publicar');
  this.route('taquillero');
  this.route('tickets');
});
