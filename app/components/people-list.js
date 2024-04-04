import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class PeopleListComponent extends Component {
  @service dataStore;
  @tracked usuId;
  @tracked currentPage = 1;
  itemsPerPage = 5;
  @tracked filterState = 'todos'; // Estado inicial del filtro
  @tracked filterType = 'todos'; // Estado inicial del filtro por tipo
  @tracked filterName = ''; // Agregar esta línea para el filtro por nombre

  @action
  preventDefaultSubmission2(event) {
    event.preventDefault();
  }

  get totalPages() {
    const totalUsers = this.filteredUsers.length;
    return Math.ceil(totalUsers / this.itemsPerPage);
  }

  get filteredUsers() {
    const data = this.dataStore.getActualizarDatos();
    if (!data) return [];
    let filteredData = data;
    if (this.filterState !== 'todos') {
      filteredData = filteredData.filter(
        (user) => user.Estado.toLowerCase() === this.filterState,
      );
    }
    if (this.filterType !== 'todos') {
      filteredData = filteredData.filter(
        (user) => user.TipoUsuario === this.filterType,
      );
    }
    if (this.filterName.trim() !== '') {
      // Filtrar por nombre si se ha ingresado algún texto
      filteredData = filteredData.filter((user) =>
        user.strNombreUsuario
          .toLowerCase()
          .includes(this.filterName.toLowerCase()),
      );
    }
    return filteredData;
  }

  get paginatedUsers() {
    if (
      !this.filteredUsers ||
      this.currentPage < 1 ||
      this.currentPage > this.totalPages
    )
      return [];
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.filteredUsers.length,
    );
    return this.filteredUsers.slice(startIndex, endIndex);
  }
  @action async filterByState(event) {
    this.filterState = event.target.value;
    this.currentPage = 1;
  }

  @action async filterByType(event) {
    this.filterType = event.target.value;
    this.currentPage = 1;
  }

  @action async filterByName(event) {
    this.filterName = event.target.value;
    this.currentPage = 1;
  }

  @action async nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      await this.loadData();
    }
  }

  @action async previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      await this.loadData();
    }
  }

  async loadData() {
    await this.dataStore.updateList223(); // Asegurarse de que los datos estén actualizados
  }

  @action async deleteUser(user) {
    try {
      await (document.getElementById('userDelete').disabled = true, 
      document.getElementById('userEdit').disabled = true, axios
        .delete(`https://backend-express-production-be7d.up.railway.app/api/usuario/${user}`))
        await this.UpdateList2();
          document.getElementById('userDelete').disabled = false;
          document.getElementById('userEdit').disabled = false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Eliminado',
              showConfirmButton: false,
              timer: 850,
            });
    } catch (error) {
          document.getElementById('userDelete').disabled = false;
          document.getElementById('userEdit').disabled = false;
          if (error.data.status === 404) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Usuario no encontrado',
              showConfirmButton: false,
              timer: 1500,
            });
          }
          if (error.status === 'ERROR') {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Problemas de conexión',
              showConfirmButton: false,
              timer: 1500,
            });
          }      
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

  @action async editarDatos(userId) {
    try {
      this.usuId = userId.id;
      var modalEditar = document.getElementById('ocultar');
      var mNombre = document.getElementById('recipient-name2');
      var mContraseña = document.getElementById('inputPassword52');
      var mUsuarioNormal = document.getElementById('opNormal2');
      var mUsuarioAdmin = document.getElementById('opAdmin2');
      var mUsuarioActivo = document.getElementById('opActivo2');
      var mUsuarioInactivo = document.getElementById('opInactivo2');

      mNombre.value = userId.strNombreUsuario;
      mContraseña.value = userId.strContraseña;
      if (userId.TipoUsuario === 'Normal') {
        mUsuarioNormal.setAttribute('selected', 'selected');
      } else {
        mUsuarioAdmin.setAttribute('selected', 'selected');
      }
      if (userId.Estado === 'Activo') {
        mUsuarioActivo.setAttribute('selected', 'selected');
      } else {
        mUsuarioInactivo.setAttribute('selected', 'selected');
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
  
  @action async actualizarDatos() {
    const validar = true;
    const username = document.getElementById('recipient-name2').value;
    const validUsername = /^[0-9A-Za-z_]{6,20}$/;
    const password = document.getElementById('inputPassword52').value;
    const validPassword = /^(?!.*[<>&:^()'"\s])[a-zA-Z0-9!@#$%*_=+-]{8,16}$/;
    if (validUsername.test(username)) {
      if (validPassword.test(password)) {
        if (username.length >= 6 && username.length <= 20) {
          if (password.length >= 8 && password.length <= 16) {
            let tipoUser;
            let tipoEstado;
            if (document.getElementById('opNormal2').selected) {
              tipoUser = 1;
            } else {
              tipoUser = 2;
            }
            if (document.getElementById('opActivo2').selected) {
              tipoEstado = 1;
            } else {
              tipoEstado = 2;
            }
            await (document.getElementById('enviar2').disabled = true, 
            document.getElementById('cerrarmd').disabled = true,
            document.getElementById('cerrar3').disabled = true, axios
              .put(`https://backend-express-production-be7d.up.railway.app/api/usuario/${this.usuId}`, {
                strNombreUsuario:
                  document.getElementById('recipient-name2').value,
                strContraseña: document.getElementById('inputPassword52').value,
                idTipoUsuario: tipoUser,
                idTipoEstado: tipoEstado,
              }))
              .then(function (response) {
                const { data } = response;
                if (
                  data.message ===
                  'El nombre de usuario o la contraseña ya están registrados'
                ) {
                  document.getElementById('enviar2').disabled = false; 
            document.getElementById('cerrarmd').disabled = false;
            document.getElementById('cerrar3').disabled = false;
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'El nombre o la contraseña estan registrados',
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  validar = false;
                }
                if (response.status === 404) {
                  document.getElementById('enviar2').disabled = false; 
            document.getElementById('cerrarmd').disabled = false;
            document.getElementById('cerrar3').disabled = false;
                  Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Usuario no encontrado',
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  validar = false;
                }
                if (
                  response.status === 408 ||
                  response.status === 504 ||
                  response.status === 'ERROR'
                ) {
                  document.getElementById('enviar2').disabled = false; 
            document.getElementById('cerrarmd').disabled = false;
            document.getElementById('cerrar3').disabled = false;
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
                document.getElementById('enviar2').disabled = false; 
                document.getElementById('cerrarmd').disabled = false;
                document.getElementById('cerrar3').disabled = false;
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'El nombre o la contraseña estan registrados',
                  showConfirmButton: false,
                  timer: 2000,
                });
                validar = false;
                console.log(error);
              });
            if (validar) {
              await this.UpdateList2();
              document.getElementById('enviar2').disabled = false; 
            document.getElementById('cerrarmd').disabled = false;
            document.getElementById('cerrar3').disabled = false;
              document.getElementById('cerrar3').click();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Datos actualizados',
                showConfirmButton: false,
                timer: 900,
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

  @action
  handleInput2(event) {
    const myInput = document.getElementById('inputPassword52');
    const myInput2 = document.getElementById('recipient-name2');
  
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
  removeData2(){
    document.getElementById("inputPassword52").value = '';
    document.getElementById('recipient-name2').value = '';
    document.getElementById('opNormal2').removeAttribute("selected");
    document.getElementById('opAdmin2').removeAttribute("selected");
    document.getElementById('opActivo2').removeAttribute("selected");
    document.getElementById('opInactivo2').removeAttribute("selected");
  }
}
