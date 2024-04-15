// app/components/login-form.js
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import axios from 'axios';
import Swal from 'sweetalert2';

export default class LoginFormComponent extends Component {
  @service auth;
  @service router;

  username = '';
  password = '';
  error = '';


  @action handleInputLogin(event) {
    const myInput = document.getElementById('passwordLogin');
    const myInput2 = document.getElementById('usernameLogin');

    const chr = String.fromCharCode(event.which);
    const validCharacters =
      '1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZ_';
    const validCharactersPassword =
      '1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZ!#$%=+*_-@';

    if (event.target === myInput) {
      if (
        event.key === 'Backspace' ||
        event.key === 'Tab' ||
        event.key === '_'
      ) {
        return;
      }

      if (myInput.value.length >= 16 && !event.ctrlKey) {
        event.preventDefault();
      } else if (validCharactersPassword.indexOf(chr) < 0 && !event.ctrlKey) {
        event.preventDefault();
      }
    }

    if (event.target === myInput2) {
      if (
        event.key === 'Backspace' ||
        event.key === 'Tab' ||
        event.key === '_'
      ) {
        return;
      }

      if (myInput2.value.length >= 20 && !event.ctrlKey) {
        event.preventDefault();
      } else if (validCharacters.indexOf(chr) < 0 && !event.ctrlKey) {
        event.preventDefault();
      }
    }
  }

  @action
  updateUsername(event) {
    this.username = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }

  @action
  async login(event) {
    event.preventDefault();
    try {
      const response = await (document.getElementById('btn-submit-login').disabled = true, axios.post('https://backend-express-production-be7d.up.railway.app/api/login', {
        username: this.username,
        password: this.password
      }));
      document.getElementById('btn-submit-login').disabled = false;
      const userData = response.data[0];
      const { token } = response.data[1];
      this.auth.setToken(token);

      this.auth.isAuthenticated = true;
      this.auth.currentUser = userData;

      if (this.auth.isAdmin()) {
        this.auth.setAdmin(true);
        await this.router.transitionTo('usuarios');
       } else if (this.auth.isUser()) {
        await this.router.transitionTo('taquillero');
         }
    } catch (error) {
        document.getElementById('btn-submit-login').disabled = false;
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Credenciales inválidas. Por favor, intenta de nuevo.',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
