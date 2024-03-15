import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2'

export default class PeopleListComponent extends Component {
  async deleteUser(user) {
    try {
      await (
        axios.delete(`http://localhost:3000/api/usuario/${user}`),
        Swal.fire("Eliminado!", "", "success")
     )
     location.reload();
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Algo salio mal!",
        text: "No se elimino"
      });    }
  }
}
