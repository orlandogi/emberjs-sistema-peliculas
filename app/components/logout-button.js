// app/components/logout-button.js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LogoutButtonComponent extends Component {
  @service auth;

  @action
  logout() {
    this.auth.logout();
  }
}
