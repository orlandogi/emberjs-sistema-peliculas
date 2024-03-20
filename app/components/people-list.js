import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';


export default class PeopleListComponent extends Component {
  @service dataStore;
  @tracked usuarios;
  @tracked usuId;

  @action async deleteUser(user) {
    try {
      await (axios.delete(`http://localhost:3000/api/usuario/${user}`)
      .then((response) =>{
        const {data} = response;
        if(data.message === 'Se elimino correctamente'){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Eliminado',
            showConfirmButton: false,
            timer: 850,
          })
        }
        if(response.status ===  404){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Usuario no encontrado',
            showConfirmButton: false,
            timer: 1500,
          });
        }
        if(response.status === 'ERROR'){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Problemas de conexión',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }))
      this.dataStore.setInsertedSuccessfully(false);
      await this.UpdateList2();
    } catch (error) {
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Problemas de conexión',
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(error);
    }
  }

  @action async editarDatos(userId){
    try {
      this.usuId = userId;
      var modalEditar = document.getElementById('ocultar');
      var mNombre = document.getElementById('recipient-name2');
      var mContraseña = document.getElementById('inputPassword52');
      var mUsuarioNormal = document.getElementById('option-5');
      var mUsuarioAdmin = document.getElementById('option-6');
      var mUsuarioActivo = document.getElementById('option-7');
      var mUsuarioInactivo = document.getElementById('option-8');

      const response = await axios.get(`http://localhost:3000/api/usuario/${userId}`);
      const { data } = response;
      mNombre.value = data.strNombreUsuario;
      mContraseña.value = data.strContraseña;
      if(data.idTipoUsuario === 1){
        mUsuarioNormal.checked = true;
        document.getElementById("descripci2").innerHTML='<b>🔒 Tiene acceso limitado al sistema 🔒</b>';
      }else{
        mUsuarioAdmin.checked = true;
         document.getElementById("descripci2").innerHTML='<b>🌟 Tiene control total del sistema 🌟</b>';
      }
      if(data.idTipoEstado=== 1){
        mUsuarioActivo.checked = true;
      }else{
        mUsuarioInactivo.checked = true;
      }
      letter22.classList.remove("invalid");
      letter22.classList.add("valid");
      capital22.classList.remove("invalid");
      capital22.classList.add("valid");
      number22.classList.remove("invalid");
      number22.classList.add("valid");
      length22.classList.remove("invalid");
      length22.classList.add("valid");
      val55 = true;
      val11 = true;
      val22 = true;
      val33 = true;
      val44 = true;
      buttonSend2.disabled = false;
      modalEditar.click();
    } catch (error) {
      
    }
  
  }
  @action async actualizarDatos(){
    const validar = true;
    await (axios.put(`http://localhost:3000/api/usuario/${this.usuId}`, {
          strNombreUsuario: document.getElementById('recipient-name2').value,
          strContraseña: document.getElementById('inputPassword52').value,
          idTipoUsuario: parseInt(
            document.querySelector('input[name="select3"]:checked').value,
          ),
          idTipoEstado: parseInt(
            document.querySelector('input[name="select4"]:checked').value,
          ),
})
.then(function (response) {
  const {data} = response;
  if(data.message === 'El nombre de usuario o la contraseña ya están registrados'){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'El nombre o la contraseña estan registrados',
      showConfirmButton: false,
      timer: 2000,
    });  
    validar = false;
  }
  if(response.status === 404){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Usuario no encontrado',
      showConfirmButton: false,
      timer: 2000,
    });  
   validar = false;
  }
  if(response.status === 408 || response.status === 504  || response.status === 'ERROR'){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Problemas de conexión',
      showConfirmButton: false,
      timer: 2000,
    }); 
    validar = false;
  }


})
.catch(function (error) {
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'El nombre o la contraseña estan registrados',
    showConfirmButton: false,
    timer: 2000,
  })
  validar = false;
console.log(error)
}) )
  if(validar){
    this.dataStore.setInsertedSuccessfully(false);
   await this.UpdateList2();
   Swal.fire({
     position: 'center',
     icon: 'success',
     title: 'Datos actualizados',
     showConfirmButton: false,
     timer: 900,
   });  
  }
  }

  async UpdateList2() {
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
}
