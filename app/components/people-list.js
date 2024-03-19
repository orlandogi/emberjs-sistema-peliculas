import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';


export default class PeopleListComponent extends Component {
  @service dataStore;
  @tracked usuarios;

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

  async UpdateList2() {
    try {
      const response = await axios.get('https://backend-express-production-be7d.up.railway.app/api/usuarios');
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


    @action actualizar(){
    axios.put('http://localhost:3000/api/usuario/1', {
  
        strNombreUsuario: "Vicente",
        strContraseña: "Darmixista4",
        idTipoUsuario: 2,
        idTipoEstado: 1
      
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  

}
