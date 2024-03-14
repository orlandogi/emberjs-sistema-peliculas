import Component from '@glimmer/component';
import axios from 'axios';

export default class PeopleListComponent extends Component {
  async deleteUser(user) {
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${user}`);
      console.log('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  }
}
