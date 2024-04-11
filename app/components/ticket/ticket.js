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
    @tracked numAdultos2 = 0;
    @tracked numNiños2 = 0;
    @tracked precioAdulto2 = 0;
    @tracked precioNiño2 = 0;
    @tracked asientos2 = [];
    

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

      @action handleInputTicket(event){
        const myInput2 = document.getElementById('nameClientEdit');
      
        const chr = String.fromCharCode(event.which);
        const validCharacters =
          '1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZáéíóü ';
      
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

    @action sumarAdulto2(){
      alert('d')
    }

    @action restarAdulto2(){
      alert('')
    }

    @action restarNiño2(){
      alert('')
    }
    
    @action sumarNiño2(){
      alert('')
    }
    
  @action editarTicket(edit){

    document.getElementById('btnTicket').click();
    document.getElementById('folioTicket').textContent = edit.folio;
    document.getElementById('fechaHoyEdit').textContent = edit.fecha;
    document.getElementById('idPeliculaTicketEdit').value = edit.pelicula;
    document.getElementById('idSalaMovieEdit').value = edit.sala;
    document.getElementById('idHorarioMovieEdit').value = edit.horario;
    document.getElementById('nameClientEdit').value = edit.cliente
    document.getElementById('numAdultosEdit').textContent = edit.adultos;
    document.getElementById('numNiñosEdit').textContent = edit.niños;
    document.getElementById('totalAsientosEdit').textContent = edit.boletos;
    document.getElementById('codigoAsientosEdit').textContent = edit.asientos;
    document.getElementById('totalPrecioTicketsEdit').textContent = edit.total;

    
    }


 @action cerrarEditTicket(){
  alert('d')


 }


 @action prueba2(){
  alert('sd')
 }

 @action comprar2(){
  alert('')
 }
}
