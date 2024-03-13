// app/controllers/tu-componente.js
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class Crear extends Controller {
  strNombreUsuario = '';
  strContraseña = '';
  idTipoUsuario = 1;
  idTipoEstado = 1;

  @action
  async insertUser() {
    alert('asdfsaf')
    try {
      const response = await axios.post('http://localhost:3000/api/usuario', {
        strNombreUsuario: this.strNombreUsuario,
        strContraseña: this.strContraseña,
        idTipoUsuario: parseInt(this.idTipoUsuario),
        idTipoEstado: parseInt(this.idTipoEstado),
      });

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
}
