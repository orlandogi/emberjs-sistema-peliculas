import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import axios from 'axios';
export default class CrearCrearComponent extends Component {

  @action
  async insertUser() {
      try {
          const response = await axios.post('http://localhost:3000/api/usuario', {
              strNombreUsuario: document.getElementById('recipient-name').value,
              strContraseña: document.getElementById('inputPassword5').value,
              idTipoUsuario: parseInt(document.querySelector('input[name="select2"]:checked').value),
              idTipoEstado: parseInt(document.querySelector('input[name="select"]:checked').value),
          });
  
          console.log(response);
      } catch (error) {
          console.error(error);
      }
  }
  

  @action datos(){
    const nombre = document.getElementById('recipient-name').value;
    const contraseña = document.getElementById('inputPassword5').value;
    const tipoUsuario = parseInt(document.querySelector('input[name="select2"]:checked').value);
    const tipoEstado = parseInt(document.querySelector('input[name="select"]:checked').value);

    alert(nombre + ' ' + contraseña + ' ' + tipoUsuario + ' ' + tipoEstado);
  }
  @tracked isLarge = false;
  @action toggleSize() {
    this.isLarge = !this.isLarge;
  }
}