import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import axios from 'axios';
import Swal from 'sweetalert2';
import { inject as service } from '@ember/service';

export default class CrearCrearComponent extends Component {
  @service dataStore;
  
  @action async insertar() {
    try {
      await axios
        .post('http://localhost:3000/api/usuario', {
          strNombreUsuario: document.getElementById('recipient-name').value,
          strContraseña: document.getElementById('inputPassword5').value,
          idTipoUsuario: parseInt(
            document.querySelector('input[name="select2"]:checked').value,
          ),
          idTipoEstado: parseInt(
            document.querySelector('input[name="select"]:checked').value,
          ),
        })
        .then((response) => {
          const { data } = response;
          if (data.message === 'El usuario ya está registrado') {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Usuario Repetido',
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Hecho',
              showConfirmButton: false,
              timer: 900,
            });
          }
        })
        .catch((error) => {
          if (error.message === 'Network Error') {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Problemas de conexión',
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Usuario Repetido',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });

      await this.UpdateList();
      this.dataStore.setInsertedSuccessfully(true);
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'No se pudo insertar',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  @tracked usuarios = this.UpdateList();

  async UpdateList() {
    try {
      const response = await axios.get('http://localhost:3000/api/usuarios');
      const { data } = response;
      this.usuarios = data;
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      console.log(error.config);
      return [];
    }
  }

  @action
  async insertUser() {
    try {
      const username = document.getElementById('recipient-name').value;
      const validUsername = /^[0-9A-Za-z_]{6,20}$/;
      const password = document.getElementById('inputPassword5').value;
      const validPassword = /^(?!.*[<>&:^()'"\s])[a-zA-Z0-9!@#$%*_=+-]{8,16}$/;
      if (validUsername.test(username)) {
        if (validPassword.test(password)) {
          this.insertar();
        } else {
          await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'La contraseña no cumple con los parametros',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        await Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El nombre no cumple con los parametros',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
