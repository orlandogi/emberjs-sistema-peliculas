import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import axios from 'axios';
import Swal from 'sweetalert2';
import { inject as service } from '@ember/service';

export default class CrearCrearComponent extends Component {
  @service dataStore;

  @action
  preventDefaultSubmission(event) {
    event.preventDefault();
  }

  @action async insertar() {
    try {
      let tipoUser;
      let tipoEstado;
      if (document.getElementById('opNormal').selected) {
        tipoUser = 1;
      } else {
        tipoUser = 2;
      }
      if (document.getElementById('opActivo').selected) {
        tipoEstado = 1;
      } else {
        tipoEstado = 2;
      }
      await axios
        .post('http://localhost:3000/api/usuario', {
          strNombreUsuario: document.getElementById('recipient-name').value,
          strContraseña: document.getElementById('inputPassword5').value,
          idTipoUsuario: tipoUser,
          idTipoEstado: tipoEstado,
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
            document.getElementById('cerrar').click();
            document.getElementById('inputPassword5').value = '';
            document.getElementById('recipient-name').value = '';
            document.getElementById('opNormal').removeAttribute('selected');
            document.getElementById('opAdmin').removeAttribute('selected');
            document.getElementById('opActivo').removeAttribute('selected');
            document.getElementById('opInactivo').removeAttribute('selected');
            document
              .getElementById('opNormal')
              .setAttribute('selected', 'selected');
            document
              .getElementById('opActivo')
              .setAttribute('selected', 'selected');
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

  async UpdateList() {
    try {
      const response = await axios.get('http://localhost:3000/api/usuarios');
      const { data } = response;
      this.dataStore.setActualizarDatos(data);
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
          if (username.length >= 6 && username.length <= 20) {
            if (password.length >= 8 && password.length <= 16) {
              this.insertar();
            } else {
              await Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'La contraseña debe ser mayor a 8 caracteres',
                showConfirmButton: false,
                timer: 1500,
              });
            }
          } else {
            await Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'El nombre debe ser mayor a 6 caracteres',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } else {
          await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'La contraseña debe ser mayor a 8 caracteres',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        await Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El nombre debe ser mayor a 6 caracteres',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  @action
  changeImage(event) {
    const defaultFile = '../images/pelicula-icon.jpg';
    const img = document.getElementById('cont-imagen');

    event.target.removeEventListener('change', this.changeImage);

    if (event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      img.src = defaultFile;
    }
  }

  @action
  handleInput(event) {
    const myInput = document.getElementById('inputPassword5');
    const myInput2 = document.getElementById('recipient-name');
  
    const chr = String.fromCharCode(event.which);
    const validCharacters =
      '1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZ_';
    const validCharactersPassword =
      '1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZ!#$%=+*_-@';
  
    if (event.target === myInput) {
      if (event.key === 'Backspace' || event.key === 'Tab' || event.key === '_') {
        return;
      }
  
      if (myInput.value.length >= 16 && !event.ctrlKey) {
        event.preventDefault();
      } else if (validCharactersPassword.indexOf(chr) < 0 && !event.ctrlKey) {
        event.preventDefault();
      }
    }
  
    if (event.target === myInput2) {
      if (event.key === 'Backspace' || event.key === 'Tab' || event.key === '_') {
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
  removeData(){
    document.getElementById("inputPassword5").value = '';
    document.getElementById('recipient-name').value = '';
    document.getElementById('opNormal').removeAttribute("selected");
    document.getElementById('opAdmin').removeAttribute("selected");
    document.getElementById('opActivo').removeAttribute("selected");
    document.getElementById('opInactivo').removeAttribute("selected");
    document.getElementById('opNormal').setAttribute("selected", "selected");
    document.getElementById('opActivo').setAttribute("selected", "selected");

  }

  @action
  selectOption(option) {
    const tagContainer = document.getElementById('tagContainer');

    // Crear una nueva etiqueta
    const tag = document.createElement('div');
    tag.classList.add('etiqueta');
    tag.textContent = option;

    // Crear el botón de cierre
    const closeButton = document.createElement('span');
    closeButton.classList.add('etiqueta-close');
    closeButton.textContent = 'x';
    closeButton.addEventListener('click', function () {
        tag.remove();
    });

    // Adjuntar el botón de cierre a la etiqueta
    tag.appendChild(closeButton);

    // Agregar la etiqueta al contenedor
    tagContainer.appendChild(tag);
  }

}
