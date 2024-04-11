import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TicketTicketComponent extends Component {
   
    @service dataStore;
    @tracked currentPage9 = 1;
    itemsPerPage9 = 7;

    @action
    preventDefaultSubmissionTicket(event) {
      event.preventDefault();
    }
    
  get totalPages9() {
    const totalMovies = this.filteredMovies9.length;
    return Math.ceil(totalMovies / this.itemsPerPage9);
  }
  
  get filteredMovies9() {
    let movies = this.dataStore.getActualizarTickets() || [];
    return movies;
  }
  
  get paginatedMovies9() {
    const startIndex = (this.currentPage9 - 1) * this.itemsPerPage9;
    const endIndex = startIndex + this.itemsPerPage9;
    return this.filteredMovies9.slice(startIndex, endIndex);
  }
  
  
  @action
  async nextPage9() {
    if (this.currentPage9 < this.totalPages9) {
        this.currentPage9++;
    }
  }
  
  @action
  async previousPage9() {
    if (this.currentPage9 > 1) {
        this.currentPage9--;
    }
  }
  
  async loadData9() {
    await this.dataStore.updateALLTickets(); 
  }

  async updateALLTickets() {
    try {
      const response = await axios.get('https://backend-express-production-be7d.up.railway.app/api/tickets');
      const { data } = response;
      this.dataStore.setActualizarTickets(data) ;
    } catch (error) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Problemas de conexión al actualizar',
        showConfirmButton: false,
        timer: 1500,
    });
      throw new Error(`Error al actualizar los datos: ${error.message}`);
    }
  }

  @action async movieDeleteTicket(id){
    try {
        await (document.getElementById('movieEditTicket').disabled = true, 
        document.getElementById('editTicket').disabled = true,
         axios
          .delete(`https://backend-express-production-be7d.up.railway.app/api/ticket/${id}`))
            await this.updateALLTickets();
            document.getElementById('movieDelete').disabled = false;
            document.getElementById('movieEdit').disabled = false;
             await Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Eliminado',
                showConfirmButton: false,
                timer: 1000,
              });
            
      } catch (error) {
            document.getElementById('movieEditTicket').disabled = false;
            document.getElementById('editTicket').disabled = false;
            if(error.response.data.status === 404){
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ticket no encontrado',
                showConfirmButton: false,
                timer: 1500,
              });
            }
            if (error.response.data.status === 'ERROR') {
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

    
  @action editarTicket(){
        alert('')
  }

 
}
