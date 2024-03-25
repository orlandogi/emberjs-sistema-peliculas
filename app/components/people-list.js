import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';


export default class PeopleListComponent extends Component {
  @service dataStore;
  @tracked usuId;

  @action async deleteUser(user) {
    try {
      await (axios.delete(`https://backend-express-production-be7d.up.railway.app/api/usuario/${user}`)
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
      var mUsuarioNormal = document.getElementById('opNormal2');
      var mUsuarioAdmin = document.getElementById('opAdmin2');
      var mUsuarioActivo = document.getElementById('opActivo2');
      var mUsuarioInactivo = document.getElementById('opInactivo2');

      const response = await axios.get(`https://backend-express-production-be7d.up.railway.app/api/usuario/${userId}`);
      const { data } = response;
      mNombre.value = data.strNombreUsuario;
      mContraseña.value = data.strContraseña;
      if(data.idTipoUsuario === 1){
        mUsuarioNormal.setAttribute("selected", "selected");
      }else{
        mUsuarioAdmin.setAttribute("selected", "selected");
      }
      if(data.idTipoEstado === 1){
        mUsuarioActivo.setAttribute("selected", "selected");
      }else{
        mUsuarioInactivo.setAttribute("selected", "selected");
      }
      modalEditar.click();
    } catch (error) {
      await Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'ERROR',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  
  }
  @action async actualizarDatos(){
    const validar = true;
    const username = document.getElementById('recipient-name2').value;
    const validUsername = /^[0-9A-Za-z_]{6,20}$/;
    const password = document.getElementById('inputPassword52').value;
    const validPassword = /^(?!.*[<>&:^()'"\s])[a-zA-Z0-9!@#$%*_=+-]{8,16}$/;
    if (validUsername.test(username)) {
      if (validPassword.test(password)) {
        if(username.length >= 6 && username.length <=20){
          if(password.length >= 8 && password.length <= 16){
            let tipoUser;
            let tipoEstado;
            if(document.getElementById('opNormal2').selected){
              tipoUser = 1;
            }else{
              tipoUser = 2;
            }
            if(document.getElementById('opActivo2').selected){
              tipoEstado = 1;
            }else{
              tipoEstado = 2;
            }
            await (axios.put(`https://backend-express-production-be7d.up.railway.app/api/usuario/${this.usuId}`, {
                  strNombreUsuario: document.getElementById('recipient-name2').value,
                  strContraseña: document.getElementById('inputPassword52').value,
                  idTipoUsuario: tipoUser,
                  idTipoEstado: tipoEstado,
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
           await this.UpdateList2();
           document.getElementById('cerrar3').click();
           Swal.fire({
             position: 'center',
             icon: 'success',
             title: 'Datos actualizados',
             showConfirmButton: false,
             timer: 900,
           });  
          }
        }else{
            await Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'La contraseña debe ser mayor a 8 caracteres',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }else{
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

  }

  async UpdateList2() {
    try {
      const response = await axios.get('https://backend-express-production-be7d.up.railway.app/api/usuarios');
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
}
