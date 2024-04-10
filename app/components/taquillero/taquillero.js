import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TaquilleroTaquilleroComponent extends Component {
    @service dataStore;
    @tracked currentPage6 = 1;
    itemsPerPage6 = 2;
    @tracked imagenSource2 ;
  
    
  get totalPages6() {
    const totalMovies = this.filteredMovies6.length;
    return Math.ceil(totalMovies / this.itemsPerPage6);
  }
  
  get filteredMovies6() {
    let movies = this.dataStore.getActualizarPeliculasPublicadas() || [];
    return movies;
  }
  
  get paginatedMovies6() {
    const startIndex = (this.currentPage6 - 1) * this.itemsPerPage6;
    const endIndex = startIndex + this.itemsPerPage6;
    return this.filteredMovies6.slice(startIndex, endIndex);
  }
  
  
  @action
  async nextPage6() {
    if (this.currentPage6 < this.totalPages6) {
        this.currentPage6++;
    }
  }
  
  @action
  async previousPage6() {
    if (this.currentPage6 > 1) {
        this.currentPage6--;
    }
  }
  
  async loadData6() {
    await this.dataStore.updatePeliculasPublicadas(); 
  }

  @action showSala(idsSala, index, movie, horario) {
    
    Swal.fire(movie + ' - ' + horario + ' en Sala' + idsSala[index]); 
  }

  @action
  preventDefaultSubmissionTaquillero(event) {
    event.preventDefault();
  }
  @action comprar(){

  }

  @action prueba(){
// Obtener la fecha actual
const fechaActual = new Date();

// Obtener el año
const año = fechaActual.getFullYear();

// Obtener el mes (se suma 1 porque los meses van de 0 a 11)
const mes = fechaActual.getMonth() + 1;

// Obtener el día del mes
const dia = fechaActual.getDate();

// Obtener la hora
const hora = fechaActual.getHours();

// Obtener los minutos
const minutos = fechaActual.getMinutes();

// Formatear la fecha en el formato deseado (añadir ceros si es necesario)
const fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia} ${hora < 10 ? '0' : ''}${hora}:${minutos < 10 ? '0' : ''}${minutos}`;

    document.getElementById('fechaHoy').textContent = fechaFormateada;

    const fecha = new Date();
    
    // Formatear la hora actual en formato HHMMSS
    const horaActual = fecha.getSeconds().toString().padStart(2, '0');
    
    // Generar el folio combinando el prefijo, la hora actual y un número aleatorio
    const folio = `${''}${horaActual}-${Math.floor(Math.random() * 1000)}`;
    
    document.getElementById('folioTicket').textContent = folio;
  }

  @action handleInputTaquillero(event){
      const myInput2 = document.getElementById('nameClient');
    
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

}
