import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import axios from 'axios';
import Swal from 'sweetalert2'
export default class CrearCrearComponent extends Component {

  

  @action
  async insertUser() {
      try {
        
        const username = document.getElementById('recipient-name').value;
        const validUsername = /^[0-9A-Za-z]{6,16}$/;
        const password = document.getElementById('inputPassword5').value;
        const validPassword = /^(?!.*[<>&:^()'"])[a-zA-Z0-9!@#$%^&*_=+-]{8,16}$/;
        if((validUsername.test(username))){
        if((validPassword.test(password))){

            await axios.post('http://localhost:3000/api/usuario', {
            strNombreUsuario: document.getElementById('recipient-name').value,
            strContraseña: document.getElementById('inputPassword5').value,
            idTipoUsuario: parseInt(document.querySelector('input[name="select2"]:checked').value),
            idTipoEstado: parseInt(document.querySelector('input[name="select"]:checked').value),

            
          });

          await Swal.fire({
            icon: "success",
            title: "Terminado!",
            text: "Se registro correctamente"
          });
          
        }else{
          await Swal.fire({
            icon: "error",
            title: "Algo salio mal!",
            text: "La contraseña no cumple con los parametros"
          });
        }

        }else{
          await Swal.fire({
            icon: "error",
            title: "Algo salio mal!",
            text: "El nombre no cumple con los parametros"
          });        }
        } catch (error) {
          console.error(error);
      }
  }
  

@action validarBoton(){

  
  
}
  @tracked isLarge = false;
  @action toggleSize() {
    this.isLarge = !this.isLarge;
  }
}