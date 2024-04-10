import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UploadMovieUploadMovieComponent extends Component {
  @tracked etiquetaCount = 1;
  @tracked etiquetaCount2 = 1;
  @tracked etiquetaCount3 = 1;
  @service dataStore;
  @tracked currentPage3 = 1;
  itemsPerPage3 = 2;
  @tracked currentPage5 = 1;
  itemsPerPage5 = 2;
  @tracked filterName3 = ''; 
  @tracked imagenSource2 ;
  @tracked selectedMovie = null;
  @tracked fechaInicio = null;
  @tracked fechaFin = null;
  @tracked selectedSala1 = '0';
  @tracked selectedSala2 = '0';
  @tracked selectedSala3 = '0';
  @tracked horaPelicula = 0 ;
  @tracked idPeliculaSeleccionada = 0;
  @tracked horarioSala1 = '11:00 am';
  @tracked horarioSala2 = '11:00 am';
  @tracked horarioSala3 = '11:00 am';
  @tracked horarioSala4 = '11:00 am';
  @tracked horarioSala5 = '11:00 am';
  @tracked horarioSala6 = '11:00 am';
  @tracked horarioSala3D = '11:00 am';

  @action
  preventDefaultSubmissionUpload(event) {
    event.preventDefault();
  }

  @action
  selectMovie(movie) {
    const selectedRow = event.target.closest('tr');
    const isSelected = selectedRow.classList.contains('selected-row');
  
    const rows = document.querySelectorAll('#registroBody tr');
    rows.forEach(row => {
      row.classList.remove('selected-row');
      document.getElementById('namePelicula').textContent = '';
      this.horaPelicula = 0;
      this.idPeliculaSeleccionada = 0;
    });
  
    if (isSelected) {
      this.selectedMovie = null;
    } else {
      selectedRow.classList.add('selected-row');
      document.getElementById('namePelicula').textContent = '"' + movie.strNombre + '"';
      this.horaPelicula = movie.intDuracion;
      this.idPeliculaSeleccionada = movie.id;
      this.selectedMovie = movie;
    }
  
    let formulario = document.getElementById('formularioUpload');
    let elementos = formulario.elements;
    document.getElementById('fechaFin').value = '';
    document.getElementById('fechaInicio').value = '';
    document.getElementById('fechaFin').setAttribute('disabled', 'disabled');
    document.getElementById('priceMovie').value = null;
    document.getElementById('selectHorarios1').value = '0';
    document.getElementById('selectHorarios2').value = '0';
    document.getElementById('selectHorarios3').value = '0';
    document.getElementById('horarios1').textContent = '00:00 ..';
    document.getElementById('horarios2').textContent = '00:00 ..';
    document.getElementById('horarios3').textContent = '00:00 ..';
    const etiquetas1 = document.querySelectorAll('.etiqueta1');
    etiquetas1.forEach(etiqueta => {
      etiqueta.remove();
    });
    const etiquetas2 = document.querySelectorAll('.etiqueta2');
    etiquetas2.forEach(etiqueta => {
      etiqueta.remove();
    });
    const etiquetas3 = document.querySelectorAll('.etiqueta3');
    etiquetas3.forEach(etiqueta => {
      etiqueta.remove();
    });


    for (let index = 0; index < elementos.length; index++) {
      if (index == 1) {
        continue;
      }
      elementos[index].disabled = !this.selectedMovie;
    }
    document.getElementById('btnAgregarHorarios1').disabled = true;
    this.salasDesactivadas(0);
  }
  

  @action
  handleDisableEditing(event) {
    event.preventDefault();
}

  @action
    async handleFechaInicio(event) {
    const selectedDateString = event.target.value;
    const [year, month, day] = selectedDateString.split('-');
    const selectedDate = new Date(year, month - 1, day);
    const currentDate = new Date();
    selectedDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    if (selectedDate < currentDate) {
        Swal.fire({
            icon: 'error',
            title: 'Seleeciona una fecha empezando desde el día de hoy',
            showConfirmButton: true,
        });
        event.target.value = '';
        this.fechaFin = null;
        document.getElementById('fechaFin').value = '';
        document.getElementById('fechaFin').setAttribute('disabled', 'disabled');
        return;
    }
    this.fechaFin = null;
    document.getElementById('fechaFin').value = '';
    this.fechaInicio = event.target.value;
    document.getElementById('fechaFin').removeAttribute('disabled');
}

  
@action
    async handleFechaFin(event) {
    if (!this.fechaInicio) {
        Swal.fire({
            icon: 'error',
            title: 'Seleccione una fecha de inicio primero',
            showConfirmButton: false,
            timer: 1500
        });
        this.fechaFin = null;
        return;
    }

    const fechaInicio = new Date(this.fechaInicio);
    const fechaFin = new Date(event.target.value);

    if (fechaFin < fechaInicio ) {
        Swal.fire({
            icon: 'error',
            title: 'La fecha de fin debe ser posterior a la fecha de inicio',
            showConfirmButton: true,
        });
        event.target.value = '';
        this.fechaFin = null;
        return;
    }

    this.fechaFin = event.target.value;
}

get totalPages3() {
    const totalMovies = this.filteredMovies2.length;
    return Math.ceil(totalMovies / this.itemsPerPage3);
}

get filteredMovies2() {
    let movies = this.dataStore.getActualizarPeliculasSubidas() || [];
    if (this.filterName3.trim() !== '') {
        movies = movies.filter(movie =>
            movie.strNombre.toLowerCase().includes(this.filterName3.toLowerCase())
        );
    }

    return movies;
}

get paginatedMovies2() {
    const startIndex = (this.currentPage3 - 1) * this.itemsPerPage3;
    const endIndex = startIndex + this.itemsPerPage3;
    return this.filteredMovies2.slice(startIndex, endIndex);
}

@action
async filterByName3(event) {
    this.filterName3 = event.target.value.trim();
    this.currentPage3 = 1;
}

@action
async nextPage3() {
    if (this.currentPage3 < this.totalPages3) {
        this.currentPage3++;
    }
}

@action
async previousPage3() {
    if (this.currentPage3 > 1) {
        this.currentPage3--;
    }
}
    
async loadData3() {
  await this.dataStore.updateUploadMovies(); 
}




get totalPages5() {
  const totalMovies = this.filteredMovies5.length;
  return Math.ceil(totalMovies / this.itemsPerPage5);
}

get filteredMovies5() {
  let movies = this.dataStore.getActualizarPeliculasPublicadas() || [];
  return movies;
}

get paginatedMovies5() {
  const startIndex = (this.currentPage5 - 1) * this.itemsPerPage5;
  const endIndex = startIndex + this.itemsPerPage5;
  return this.filteredMovies5.slice(startIndex, endIndex);
}


@action
async nextPage5() {
  if (this.currentPage5 < this.totalPages5) {
      this.currentPage5++;
  }
}

@action
async previousPage5() {
  if (this.currentPage5 > 1) {
      this.currentPage5--;
  }
}


      
@action
  handleInputMovieU(event) {
    const myInput = document.getElementById('priceMovie');
    const currentValue = myInput.value;
    let permitir6 = false;
    if(event.target === myInput){
        if (event.key === 'Backspace' || event.key === 'Tab' ) {
        return;
        }
    }
    if ((currentValue.length === 5 && event.key === '.')) {
      event.preventDefault();
      return;
  }
  if ((currentValue.length === 6 && event.key === '.')) {
    event.preventDefault();
    return;
}
    if (currentValue.length >= 5) {
        if(this.permitir6 && currentValue.length==5){
            return;
        }
        event.preventDefault();
        return;
    }
    if (currentValue.length === 2) {
        if (event.key === '.' && !currentValue.includes('.')) {
            this.permitir6 = false;
            return;
        }
    }
    
    if (currentValue.length === 3){
        if (event.key === '.' && !currentValue.includes('.')) {
            this.permitir6 = true;
            return;
        }
    }
    if ((currentValue.length === 4 && event.key === '.')) {
        event.preventDefault();
        return;
    }
   

    if (!/^\d$/.test(event.key)) {
        event.preventDefault();
        return;
    }
}

@action 
  salasDesactivadas(permiso){
    if(permiso === 0){
    document.getElementById('selectHorarios2').disabled = true;
    document.getElementById('selectHorarios2').value = '0';
    document.getElementById('horarios2').textContent = '00:00 ..'
    document.getElementById('selectHorarios3').disabled = true;
    document.getElementById('selectHorarios3').value = '0'
    document.getElementById('horarios3').textContent = '00:00 ..'
    document.getElementById('btnAgregarHorarios2').disabled = true;
    document.getElementById('btnAgregarHorarios3').disabled = true;
    this.selectedSala2 = '0';
    this.selectedSala3 = '0';
    }
    if(permiso === 1){
      document.getElementById('selectHorarios2').disabled = false;
    }
    if(permiso === 2){
      document.getElementById('selectHorarios3').disabled = true;
      document.getElementById('btnAgregarHorarios3').disabled = true;
      document.getElementById('selectHorarios3').value = '0';
      document.getElementById('horarios3').textContent = '00:00 ..'
      this.selectedSala3 = '0';
    }
    if(permiso === 3){
      document.getElementById('selectHorarios3').disabled = false;
    }

  }

@action
  handleSalaSelection1(event) {
    const selectedValue = event.target.value;
    const etiquetas1 = document.querySelectorAll('.etiqueta1');
    const etiquetas2 = document.querySelectorAll('.etiqueta2');
    const etiquetas3 = document.querySelectorAll('.etiqueta3');
    if(selectedValue == '0'){
      this.selectedSala1 = selectedValue;
    }
    else if(selectedValue == this.selectedSala2 || selectedValue == this.selectedSala3){
      event.target.value = this.selectedSala1;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Esta sala ya esta seleccionada',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }else{
      this.selectedSala1 = selectedValue;
    }

    switch (selectedValue) {
      case '0':
        document.getElementById('btnAgregarHorarios1').disabled = true;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        etiquetas2.forEach(etiqueta => {
          etiqueta.remove();
        });
        etiquetas3.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios1').textContent= '00:00 ..';
        this.salasDesactivadas(0);
      break;
      case '1':
        document.getElementById('btnAgregarHorarios1').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios1').textContent= this.horarioSala1;
        this.salasDesactivadas(1);
        break;
      case '2':
        document.getElementById('btnAgregarHorarios1').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios1').textContent= this.horarioSala2;
        this.salasDesactivadas(1);
        break;
      case '3':
        document.getElementById('btnAgregarHorarios1').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios1').textContent= this.horarioSala3;
        this.salasDesactivadas(1);
        break;
      case '4':
        document.getElementById('btnAgregarHorarios1').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios1').textContent= this.horarioSala4;
        this.salasDesactivadas(1);
        break;
      case '5':
        document.getElementById('btnAgregarHorarios1').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios1').textContent= this.horarioSala5;
        this.salasDesactivadas(1);
        break;
      case '6':
        document.getElementById('btnAgregarHorarios1').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios1').textContent= this.horarioSala6;
        this.salasDesactivadas(1);
        break;
      case '7':
        document.getElementById('btnAgregarHorarios1').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios1').textContent= this.horarioSala3D;
        this.salasDesactivadas(1);
        break;
        default:
        alert('no selecciono ninguna opción')
        break;
    }
  }

  @action
  handleSalaSelection2(event) {
    const selectedValue = event.target.value;
    const etiquetas1 = document.querySelectorAll('.etiqueta2');
    const etiquetas2 = document.querySelectorAll('.etiqueta3');
    if(selectedValue == '0'){
      this.selectedSala2 = selectedValue;
    }else if(selectedValue == this.selectedSala1 || selectedValue == this.selectedSala3){
      event.target.value = this.selectedSala2;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Esta sala ya esta seleccionada',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }else{
      this.selectedSala2 = selectedValue;
    }

    switch (selectedValue) {
      case '0':
        document.getElementById('btnAgregarHorarios2').disabled = true;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        etiquetas2.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios2').textContent= '00:00 ..';
        this.salasDesactivadas(2);
      break;
      case '1':
        document.getElementById('btnAgregarHorarios2').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios2').textContent= this.horarioSala1;
        this.salasDesactivadas(3);
        break;
      case '2':
        document.getElementById('btnAgregarHorarios2').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios2').textContent= this.horarioSala2;
        this.salasDesactivadas(3);        break;
      case '3':
        document.getElementById('btnAgregarHorarios2').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios2').textContent= this.horarioSala3;
        this.salasDesactivadas(3);        break;
      case '4':
        document.getElementById('btnAgregarHorarios2').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios2').textContent= this.horarioSala4;
        this.salasDesactivadas(3);        break;
      case '5':
        document.getElementById('btnAgregarHorarios2').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios2').textContent= this.horarioSala5;
        this.salasDesactivadas(3);        break;
      case '6':
        document.getElementById('btnAgregarHorarios2').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios2').textContent= this.horarioSala6;
        this.salasDesactivadas(3);        break;
      case '7':
        document.getElementById('btnAgregarHorarios2').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios2').textContent= this.horarioSala3D;
        this.salasDesactivadas(3);        break;
        default:
        alert('no selecciono ninguna opción')
        break;
    }
  }

  @action
  handleSalaSelection3(event) {
    const etiquetas1 = document.querySelectorAll('.etiqueta3');
    const selectedValue = event.target.value;
    if(selectedValue == this.selectedSala1 || selectedValue == this.selectedSala2){
      event.target.value = this.selectedSala3;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Esta sala ya esta seleccionada',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }else{
      this.selectedSala3 = selectedValue;
    }

    switch (selectedValue) {
      case '0':
        document.getElementById('btnAgregarHorarios3').disabled = true;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios3').textContent= '00:00 ..';
      break;
      case '1':
        document.getElementById('btnAgregarHorarios3').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios3').textContent= this.horarioSala1;
        break;
      case '2':
        document.getElementById('btnAgregarHorarios3').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios3').textContent= this.horarioSala2;        break;
      case '3':
        document.getElementById('btnAgregarHorarios3').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios3').textContent= this.horarioSala3;        break;
      case '4':
        document.getElementById('btnAgregarHorarios3').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios3').textContent= this.horarioSala4;        break;
      case '5':
        document.getElementById('btnAgregarHorarios3').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios3').textContent= this.horarioSala5;        break;
      case '6':
        document.getElementById('btnAgregarHorarios3').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios3').textContent= this.horarioSala6;        break;
      case '7':
        document.getElementById('btnAgregarHorarios3').disabled = false;
        etiquetas1.forEach(etiqueta => {
          etiqueta.remove();
        });
        document.getElementById('horarios3').textContent= this.horarioSala3D;        break;
        default:
        alert('no selecciono ninguna opción')
        break;
    }
  }

  @action
eliminarEtiqueta1(tag) {
  if(tag.id != (this.etiquetaCount - 1)){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Elimina de forma descendente',
      showConfirmButton: false,
      timer: 1500,
  });    
  return;
  }
  let horario = document.getElementById('horarios1').textContent;
  var minutosExtra = 20; // Variable para almacenar los minutos adicionales

      // Obtener el texto actual del label

      // Eliminar el texto "am" y obtener solo la hora
      var hora = horario.split(" ")[0]; // Separar por espacio y obtener la primera parte (hora)

      // Convertir la hora en minutos
      var minutos = parseInt(hora.split(":")[0]) * 60; // Convertir horas a minutos
      var minutosActuales = minutos + parseInt(hora.split(":")[1]); // Obtener los minutos actuales y convertirlos a número

      // Obtener el valor a sumar del input
      var valorASumar = parseInt(this.horaPelicula) ; // Valor por defecto 0 si no se ingresa nada

      // Sumar los minutos actuales con el valor ingresado en el input y los minutos adicionales
      var totalMinutos = minutosActuales - valorASumar - minutosExtra;

      // Convertir los minutos resultantes en horas y minutos
      var horas = Math.floor(totalMinutos / 60); // Obtener las horas
      var minutosRestantes = totalMinutos % 60; // Obtener los minutos restantes

      // Si las horas son mayores a 23, reiniciar a 11:00 am
      if (horas >= 24) {
          horas = 11;
          minutosRestantes = 0;
      }

      // Si los minutos finales están entre 1 y 4, ajustarlos a 5
      if (minutosRestantes >= 1 && minutosRestantes <= 4) {
          minutosRestantes = 5;
      }

      // Si los minutos finales están entre 6 y 9, ajustarlos a 10
      if (minutosRestantes >= 6 && minutosRestantes <= 9) {
          minutosRestantes = 10;
      }

      // Ajustar los minutos finales a multiplos de 5
      if (minutosRestantes % 5 != 0) {
          minutosRestantes += 5 - (minutosRestantes % 5);
      }

      // Si la hora final es multiplo de 5 o 10, aumentar 15 minutos más
      if ((minutosRestantes == 5 || minutosRestantes == 10) && minutosExtra == 0) {
          minutosRestantes += 15;
          minutosExtra += 15;
      }

      
        // Si los minutos restantes son 60, ajustar a 0 y sumar una hora
        if (minutosRestantes == 60) {
          minutosRestantes = 0;
          horas++;
      }


      // Ajustar las horas si es "pm"
      if (horas >= 12) {
          horas = horas % 12 || 12; // Convertir a formato de 12 horas
      }
     
      // Ajustar el formato de la hora y los minutos
      var nuevaHora = (horas < 10 ? "0" : "") + horas + ":" + (minutosRestantes < 10 ? "0" : "") + minutosRestantes;
      
      // Determinar si es "am" o "pm"
      var periodo = horas != 11 ? "pm" : "am";

  // Actualizar el texto del label
  if(horas < 0){
    document.getElementById("horarios1").textContent = '11:00 am';
  }else{
    document.getElementById("horarios1").textContent = nuevaHora + " " + periodo;
  }
  tag.remove();
this.etiquetaCount = (this.etiquetaCount - 1)
}

@action
eliminarEtiqueta2(tag) {
  if(tag.id != (this.etiquetaCount2 - 1)){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Elimina de forma descendente',
      showConfirmButton: false,
      timer: 1500,
  });   
      return;
  }
  let horario = document.getElementById('horarios2').textContent;
  var minutosExtra = 20; // Variable para almacenar los minutos adicionales

      // Obtener el texto actual del label

      // Eliminar el texto "am" y obtener solo la hora
      var hora = horario.split(" ")[0]; // Separar por espacio y obtener la primera parte (hora)

      // Convertir la hora en minutos
      var minutos = parseInt(hora.split(":")[0]) * 60; // Convertir horas a minutos
      var minutosActuales = minutos + parseInt(hora.split(":")[1]); // Obtener los minutos actuales y convertirlos a número

      // Obtener el valor a sumar del input
      var valorASumar = parseInt(this.horaPelicula) ; // Valor por defecto 0 si no se ingresa nada

      // Sumar los minutos actuales con el valor ingresado en el input y los minutos adicionales
      var totalMinutos = minutosActuales - valorASumar - minutosExtra;

      // Convertir los minutos resultantes en horas y minutos
      var horas = Math.floor(totalMinutos / 60); // Obtener las horas
      var minutosRestantes = totalMinutos % 60; // Obtener los minutos restantes

      // Si las horas son mayores a 23, reiniciar a 11:00 am
      if (horas >= 24) {
          horas = 11;
          minutosRestantes = 0;
      }

      // Si los minutos finales están entre 1 y 4, ajustarlos a 5
      if (minutosRestantes >= 1 && minutosRestantes <= 4) {
          minutosRestantes = 5;
      }

      // Si los minutos finales están entre 6 y 9, ajustarlos a 10
      if (minutosRestantes >= 6 && minutosRestantes <= 9) {
          minutosRestantes = 10;
      }

      // Ajustar los minutos finales a multiplos de 5
      if (minutosRestantes % 5 != 0) {
          minutosRestantes += 5 - (minutosRestantes % 5);
      }

      // Si la hora final es multiplo de 5 o 10, aumentar 15 minutos más
      if ((minutosRestantes == 5 || minutosRestantes == 10) && minutosExtra == 0) {
          minutosRestantes += 15;
          minutosExtra += 15;
      }

      
        // Si los minutos restantes son 60, ajustar a 0 y sumar una hora
        if (minutosRestantes == 60) {
          minutosRestantes = 0;
          horas++;
      }


      // Ajustar las horas si es "pm"
      if (horas >= 12) {
          horas = horas % 12 || 12; // Convertir a formato de 12 horas
      }
     
      // Ajustar el formato de la hora y los minutos
      var nuevaHora = (horas < 10 ? "0" : "") + horas + ":" + (minutosRestantes < 10 ? "0" : "") + minutosRestantes;
      
      // Determinar si es "am" o "pm"
      var periodo = horas != 11 ? "pm" : "am";

  // Actualizar el texto del label
  if(horas < 0){
    document.getElementById("horarios2").textContent = '11:00 am';
  }else{
    document.getElementById("horarios2").textContent = nuevaHora + " " + periodo;
  }
  tag.remove();
this.etiquetaCount2 = (this.etiquetaCount2 - 1)
}

@action
eliminarEtiqueta3(tag) {
  if(tag.id != (this.etiquetaCount3 - 1)){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Elimina de forma descendente',
      showConfirmButton: false,
      timer: 1500,
  });   
      return;
  }
  let horario = document.getElementById('horarios3').textContent;
  var minutosExtra = 20; // Variable para almacenar los minutos adicionales

      // Obtener el texto actual del label

      // Eliminar el texto "am" y obtener solo la hora
      var hora = horario.split(" ")[0]; // Separar por espacio y obtener la primera parte (hora)

      // Convertir la hora en minutos
      var minutos = parseInt(hora.split(":")[0]) * 60; // Convertir horas a minutos
      var minutosActuales = minutos + parseInt(hora.split(":")[1]); // Obtener los minutos actuales y convertirlos a número

      // Obtener el valor a sumar del input
      var valorASumar = parseInt(this.horaPelicula) ; // Valor por defecto 0 si no se ingresa nada

      // Sumar los minutos actuales con el valor ingresado en el input y los minutos adicionales
      var totalMinutos = minutosActuales - valorASumar - minutosExtra;

      // Convertir los minutos resultantes en horas y minutos
      var horas = Math.floor(totalMinutos / 60); // Obtener las horas
      var minutosRestantes = totalMinutos % 60; // Obtener los minutos restantes

      // Si las horas son mayores a 23, reiniciar a 11:00 am
      if (horas >= 24) {
          horas = 11;
          minutosRestantes = 0;
      }

      // Si los minutos finales están entre 1 y 4, ajustarlos a 5
      if (minutosRestantes >= 1 && minutosRestantes <= 4) {
          minutosRestantes = 5;
      }

      // Si los minutos finales están entre 6 y 9, ajustarlos a 10
      if (minutosRestantes >= 6 && minutosRestantes <= 9) {
          minutosRestantes = 10;
      }

      // Ajustar los minutos finales a multiplos de 5
      if (minutosRestantes % 5 != 0) {
          minutosRestantes += 5 - (minutosRestantes % 5);
      }

      // Si la hora final es multiplo de 5 o 10, aumentar 15 minutos más
      if ((minutosRestantes == 5 || minutosRestantes == 10) && minutosExtra == 0) {
          minutosRestantes += 15;
          minutosExtra += 15;
      }

      
        // Si los minutos restantes son 60, ajustar a 0 y sumar una hora
        if (minutosRestantes == 60) {
          minutosRestantes = 0;
          horas++;
      }


      // Ajustar las horas si es "pm"
      if (horas >= 12) {
          horas = horas % 12 || 12; // Convertir a formato de 12 horas
      }
     
      // Ajustar el formato de la hora y los minutos
      var nuevaHora = (horas < 10 ? "0" : "") + horas + ":" + (minutosRestantes < 10 ? "0" : "") + minutosRestantes;
      
      // Determinar si es "am" o "pm"
      var periodo = horas != 11 ? "pm" : "am";

  // Actualizar el texto del label
  if(horas < 0){
    document.getElementById("horarios3").textContent = '11:00 am';
  }else{
    document.getElementById("horarios3").textContent = nuevaHora + " " + periodo;
  }
  tag.remove();
this.etiquetaCount3 = (this.etiquetaCount3 - 1)
}

@action
selectTime1() {
  const tagContainer = document.getElementById('tagTime1');

  // Verificar si ya hay 4 elementos creados
  const etiquetas = document.querySelectorAll('.etiqueta1');
  if (etiquetas.length >= 4) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Máximo 4 horarios",
      showConfirmButton: true,
    });
    return;
  }
 
let horario = document.getElementById('horarios1').textContent;



      // Crear una nueva etiqueta
      const tag = document.createElement('div');
      tag.classList.add('etiqueta1');
      tag.textContent = horario;   
      const uniqueId = `${this.etiquetaCount}`;
      this.etiquetaCount++; // Incrementa el contador para el próximo ID único
      tag.id = uniqueId;   
        // Eliminar el texto "am" y obtener solo la hora
  // Eliminar el texto "am" y obtener solo la hora
  var minutosExtra = 15; // Variable para almacenar los minutos adicionales

      // Obtener el texto actual del label

      // Eliminar el texto "am" y obtener solo la hora
      var hora = horario.split(" ")[0]; // Separar por espacio y obtener la primera parte (hora)

      // Convertir la hora en minutos
      var minutos = parseInt(hora.split(":")[0]) * 60; // Convertir horas a minutos
      var minutosActuales = minutos + parseInt(hora.split(":")[1]); // Obtener los minutos actuales y convertirlos a número

      // Obtener el valor a sumar del input
      var valorASumar = parseInt(this.horaPelicula) ; // Valor por defecto 0 si no se ingresa nada

      // Sumar los minutos actuales con el valor ingresado en el input y los minutos adicionales
      var totalMinutos = minutosActuales + valorASumar + minutosExtra;

      // Convertir los minutos resultantes en horas y minutos
      var horas = Math.floor(totalMinutos / 60); // Obtener las horas
      var minutosRestantes = totalMinutos % 60; // Obtener los minutos restantes

      // Si las horas son mayores a 23, reiniciar a 11:00 am
      if (horas >= 24) {
          horas = 11;
          minutosRestantes = 0;
      }

      // Si los minutos finales están entre 1 y 4, ajustarlos a 5
      if (minutosRestantes >= 1 && minutosRestantes <= 4) {
          minutosRestantes = 5;
      }

      // Si los minutos finales están entre 6 y 9, ajustarlos a 10
      if (minutosRestantes >= 6 && minutosRestantes <= 9) {
          minutosRestantes = 10;
      }

      // Ajustar los minutos finales a multiplos de 5
      if (minutosRestantes % 5 != 0) {
          minutosRestantes += 5 - (minutosRestantes % 5);
      }

      // Si la hora final es multiplo de 5 o 10, aumentar 15 minutos más
      if ((minutosRestantes == 5 || minutosRestantes == 10) && minutosExtra == 0) {
          minutosRestantes += 15;
          minutosExtra += 15;
      }

      
        // Si los minutos restantes son 60, ajustar a 0 y sumar una hora
        if (minutosRestantes == 60) {
          minutosRestantes = 0;
          horas++;
      }


      // Ajustar las horas si es "pm"
      if (horas >= 12) {
          horas = horas % 12 || 12; // Convertir a formato de 12 horas
      }

      // Ajustar el formato de la hora y los minutos
      var nuevaHora = (horas < 10 ? "0" : "") + horas + ":" + (minutosRestantes < 10 ? "0" : "") + minutosRestantes;

      // Determinar si es "am" o "pm"
      var periodo = horas != 11 ? "pm" : "am";
if(horas >=10 ){
  if(periodo.includes('am')){
  Swal.fire({
    position: "center",
    icon: "error",
    title: "No se pueden publicar películas despues de las 10 pm",
    showConfirmButton: true,
  });
  return;
}
}
      // Actualizar el texto del label
  // Actualizar el texto del label
  document.getElementById("horarios1").textContent = nuevaHora + " " + periodo;

      // Crear el botón de cierre
      const closeButton = document.createElement('span');
      closeButton.classList.add('etiqueta-close');
      closeButton.textContent = 'x';
      closeButton.addEventListener('click', () => this.eliminarEtiqueta1(tag));


      // Adjuntar el botón de cierre a la etiqueta
      tag.appendChild(closeButton);

      // Agregar la etiqueta al contenedor
      tagContainer.appendChild(tag);
}

@action
selectTime2() {
  const tagContainer = document.getElementById('tagTime2');

  // Verificar si ya hay 4 elementos creados
  const etiquetas = document.querySelectorAll('.etiqueta2');
  if (etiquetas.length >= 4) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Máximo 4 horarios",
      showConfirmButton: true,
    });
    return;
  }
 
let horario = document.getElementById('horarios2').textContent;



      // Crear una nueva etiqueta
      const tag = document.createElement('div');
      tag.classList.add('etiqueta2');
      tag.textContent = horario;   
      const uniqueId = `${this.etiquetaCount2}`;
      this.etiquetaCount2++; // Incrementa el contador para el próximo ID único
      tag.id = uniqueId;   
        // Eliminar el texto "am" y obtener solo la hora
  // Eliminar el texto "am" y obtener solo la hora
  var minutosExtra = 15; // Variable para almacenar los minutos adicionales

  // Obtener el texto actual del label

  // Eliminar el texto "am" y obtener solo la hora
  var hora = horario.split(" ")[0]; // Separar por espacio y obtener la primera parte (hora)

  // Convertir la hora en minutos
  var minutos = parseInt(hora.split(":")[0]) * 60; // Convertir horas a minutos
  var minutosActuales = minutos + parseInt(hora.split(":")[1]); // Obtener los minutos actuales y convertirlos a número

  // Obtener el valor a sumar del input
  var valorASumar = parseInt(this.horaPelicula) ; // Valor por defecto 0 si no se ingresa nada

  // Sumar los minutos actuales con el valor ingresado en el input y los minutos adicionales
  var totalMinutos = minutosActuales + valorASumar + minutosExtra;

  // Convertir los minutos resultantes en horas y minutos
  var horas = Math.floor(totalMinutos / 60); // Obtener las horas
  var minutosRestantes = totalMinutos % 60; // Obtener los minutos restantes

  // Si las horas son mayores a 23, reiniciar a 11:00 am
  if (horas >= 24) {
      horas = 11;
      minutosRestantes = 0;
  }

  // Si los minutos finales están entre 1 y 4, ajustarlos a 5
  if (minutosRestantes >= 1 && minutosRestantes <= 4) {
      minutosRestantes = 5;
  }

  // Si los minutos finales están entre 6 y 9, ajustarlos a 10
  if (minutosRestantes >= 6 && minutosRestantes <= 9) {
      minutosRestantes = 10;
  }

  // Ajustar los minutos finales a multiplos de 5
  if (minutosRestantes % 5 != 0) {
      minutosRestantes += 5 - (minutosRestantes % 5);
  }

  // Si la hora final es multiplo de 5 o 10, aumentar 15 minutos más
  if ((minutosRestantes == 5 || minutosRestantes == 10) && minutosExtra == 0) {
      minutosRestantes += 15;
      minutosExtra += 15;
  }

  
    // Si los minutos restantes son 60, ajustar a 0 y sumar una hora
    if (minutosRestantes == 60) {
      minutosRestantes = 0;
      horas++;
  }


  // Ajustar las horas si es "pm"
  if (horas >= 12) {
      horas = horas % 12 || 12; // Convertir a formato de 12 horas
  }

  // Ajustar el formato de la hora y los minutos
  var nuevaHora = (horas < 10 ? "0" : "") + horas + ":" + (minutosRestantes < 10 ? "0" : "") + minutosRestantes;

  if(horas >=10 ){
    Swal.fire({
      position: "center",
      icon: "error",
      title: "No se pueden publicar películas despues de las 10 pm",
      showConfirmButton: true,
    });
    return;
  }
  // Determinar si es "am" o "pm"
  var periodo = horas != 11 ? "pm" : "am";

  document.getElementById("horarios2").textContent = nuevaHora + " " + periodo;

      // Crear el botón de cierre
      const closeButton = document.createElement('span');
      closeButton.classList.add('etiqueta-close');
      closeButton.textContent = 'x';
      closeButton.addEventListener('click', () => this.eliminarEtiqueta2(tag));


      // Adjuntar el botón de cierre a la etiqueta
      tag.appendChild(closeButton);

      // Agregar la etiqueta al contenedor
      tagContainer.appendChild(tag);
}

@action
selectTime3() {
  const tagContainer = document.getElementById('tagTime3');

  // Verificar si ya hay 4 elementos creados
  const etiquetas = document.querySelectorAll('.etiqueta3');
  if (etiquetas.length >= 4) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Máximo 4 horarios",
      showConfirmButton: true,
    });
    return;
  }
 
let horario = document.getElementById('horarios3').textContent;



      // Crear una nueva etiqueta
      const tag = document.createElement('div');
      tag.classList.add('etiqueta3');
      tag.textContent = horario;   
      const uniqueId = `${this.etiquetaCount3}`;
      this.etiquetaCount3++; // Incrementa el contador para el próximo ID único
      tag.id = uniqueId;   
        // Eliminar el texto "am" y obtener solo la hora
  // Eliminar el texto "am" y obtener solo la hora
  var minutosExtra = 15; // Variable para almacenar los minutos adicionales

      // Obtener el texto actual del label

      // Eliminar el texto "am" y obtener solo la hora
      var hora = horario.split(" ")[0]; // Separar por espacio y obtener la primera parte (hora)

      // Convertir la hora en minutos
      var minutos = parseInt(hora.split(":")[0]) * 60; // Convertir horas a minutos
      var minutosActuales = minutos + parseInt(hora.split(":")[1]); // Obtener los minutos actuales y convertirlos a número

      // Obtener el valor a sumar del input
      var valorASumar = parseInt(this.horaPelicula) ; // Valor por defecto 0 si no se ingresa nada

      // Sumar los minutos actuales con el valor ingresado en el input y los minutos adicionales
      var totalMinutos = minutosActuales + valorASumar + minutosExtra;

      // Convertir los minutos resultantes en horas y minutos
      var horas = Math.floor(totalMinutos / 60); // Obtener las horas
      var minutosRestantes = totalMinutos % 60; // Obtener los minutos restantes

      // Si las horas son mayores a 23, reiniciar a 11:00 am
      if (horas >= 24) {
          horas = 11;
          minutosRestantes = 0;
      }

      // Si los minutos finales están entre 1 y 4, ajustarlos a 5
      if (minutosRestantes >= 1 && minutosRestantes <= 4) {
          minutosRestantes = 5;
      }

      // Si los minutos finales están entre 6 y 9, ajustarlos a 10
      if (minutosRestantes >= 6 && minutosRestantes <= 9) {
          minutosRestantes = 10;
      }

      // Ajustar los minutos finales a multiplos de 5
      if (minutosRestantes % 5 != 0) {
          minutosRestantes += 5 - (minutosRestantes % 5);
      }

      // Si la hora final es multiplo de 5 o 10, aumentar 15 minutos más
      if ((minutosRestantes == 5 || minutosRestantes == 10) && minutosExtra == 0) {
          minutosRestantes += 15;
          minutosExtra += 15;
      }

      
        // Si los minutos restantes son 60, ajustar a 0 y sumar una hora
        if (minutosRestantes == 60) {
          minutosRestantes = 0;
          horas++;
      }


      // Ajustar las horas si es "pm"
      if (horas >= 12) {
          horas = horas % 12 || 12; // Convertir a formato de 12 horas
      }

      // Ajustar el formato de la hora y los minutos
      var nuevaHora = (horas < 10 ? "0" : "") + horas + ":" + (minutosRestantes < 10 ? "0" : "") + minutosRestantes;

      if(horas >=10 ){
        Swal.fire({
          position: "center",
          icon: "error",
          title: "No se pueden publicar películas despues de las 10 pm",
          showConfirmButton: true,
        });
        return;
      }

      // Determinar si es "am" o "pm"
      var periodo = horas != 11 ? "pm" : "am";

  // Actualizar el texto del label
  document.getElementById("horarios3").textContent = nuevaHora + " " + periodo;

      // Crear el botón de cierre
      const closeButton = document.createElement('span');
      closeButton.classList.add('etiqueta-close');
      closeButton.textContent = 'x';
      closeButton.addEventListener('click', () => this.eliminarEtiqueta3(tag));


      // Adjuntar el botón de cierre a la etiqueta
      tag.appendChild(closeButton);

      // Agregar la etiqueta al contenedor
      tagContainer.appendChild(tag);
}

async UpdateListAllMoviesUpload() {
  try {
    const response = await axios.get('https://backend-express-production-be7d.up.railway.app/api/uploadMovies');
    const { data } = response;
    this.dataStore.setActualizarPeliculasPublicadas(data);
  } catch (error) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Problemas de conexión al actualizar',
      showConfirmButton: false,
      timer: 1500,
  });
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

@action async publicarPelicula(){
    let fechaInicio = document.getElementById('fechaInicio');
    let fechaFin = document.getElementById('fechaFin');
    let priceMovie = document.getElementById('priceMovie');
    const etiquetas1 = document.querySelectorAll('.etiqueta1');
    const etiquetas2 = document.querySelectorAll('.etiqueta2');
    const etiquetas3 = document.querySelectorAll('.etiqueta3');
    
    if(this.horaPelicula != 0){
    if( fechaInicio.value != ''){
      if(fechaFin.value != ''){
      if(priceMovie.value.length >= 4 && !priceMovie.value.includes('.')){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El boleto es muy caro',
          showConfirmButton: false,
          timer: 1500,
      });        
      return;
      }else if(priceMovie.value <30){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El boleto es muy barato',
          showConfirmButton: false,
          timer: 1500,
      });   
      }else if(priceMovie.value >300){
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El boleto es muy caro',
          showConfirmButton: false,
          timer: 1500,
      });   
      }
      
      else if(priceMovie.value.length >=2){

        if(etiquetas1.length >=1 || etiquetas2.length >=1 || etiquetas3.length >=1){

        
          
          try {
            
          var numero = priceMovie.value;
          if (numero.indexOf('.') === -1) {
              numero += '.00';
          } else {
              var partes = numero.split('.');
              if (partes[1].length === 1) {
                  partes[1] = partes[1] + '0';
              }
              numero = partes.join('.');
          }
      
            const formData = new FormData();
            formData.append('fechaInicio', document.getElementById('fechaInicio').value);
            formData.append('fechaFin', document.getElementById('fechaFin').value);
            formData.append('curPrecio', numero);
            formData.append('idPelicula', this.idPeliculaSeleccionada);
            formData.append('sala1', document.getElementById('selectHorarios1').value);
            formData.append('sala2', document.getElementById('selectHorarios2').value);
            formData.append('sala3', document.getElementById('selectHorarios3').value);
  
  
            const horarios1 = document.querySelectorAll('.etiqueta1');
            const textoHorarios1 = Array.from(horarios1).map(tag => tag.textContent);
            let horarios11 =[];
            textoHorarios1.forEach(generoId => {
              var palabraSinUltimaLetra = generoId.slice(0, -1);
              horarios11.push(palabraSinUltimaLetra);
            });
  
            let horarios22 = [];
            if(document.querySelectorAll('.etiqueta2').length == 0){
              horarios22 = 0;
            }else{
            const horarios2 = document.querySelectorAll('.etiqueta2');
            const textoHorarios2 = Array.from(horarios2).map(tag => tag.textContent);
            textoHorarios2.forEach(generoId => {
              var palabraSinUltimaLetra = generoId.slice(0, -1);
              horarios22.push( palabraSinUltimaLetra);
            });
          }
  
          let horarios33 = [];
            if(document.querySelectorAll('.etiqueta3').length == 0){
              horarios33 = 0;
            }else{
            const horarios3 = document.querySelectorAll('.etiqueta3');
            const textoHorarios3 = Array.from(horarios3).map(tag => tag.textContent);
            textoHorarios3.forEach(generoId => {
              var palabraSinUltimaLetra = generoId.slice(0, -1);
              horarios33.push(palabraSinUltimaLetra);
            });
          }
            // Realizar la solicitud POST al backend
            await(document.getElementById('cerrarUpload').disabled = true, document.getElementById('publicarMovie').disabled = true, document.getElementById('cerrarUploadMovie').disabled = true,
             axios({
              method: 'post',
              url: 'https://backend-express-production-be7d.up.railway.app/api/uploadMovie',
              data: {
                fechaInicio: document.getElementById('fechaInicio').value,
                fechaFin: document.getElementById('fechaFin').value,
                curPrecio: numero,
                idPelicula: this.idPeliculaSeleccionada,
                sala1:document.getElementById('selectHorarios1').value,
                sala2:document.getElementById('selectHorarios2').value,
                sala3:document.getElementById('selectHorarios3').value,
                horarios1: horarios11,
                horarios2: horarios22,
                horarios3: horarios33,
              }
            }));

            await this.UpdateListAllMoviesUpload();
            document.getElementById('publicarMovie').disabled = false;
            document.getElementById('cerrarUpload').disabled = false;
            document.getElementById('cerrarUploadMovie').disabled = false;
            document.getElementById('cerrarUpload').click();
            if(document.getElementById('selectHorarios1').value == '1'){
              this.horarioSala1 = document.getElementById('horarios1').textContent;
            }else if(document.getElementById('selectHorarios1').value == '2'){
              this.horarioSala2 = document.getElementById('horarios1').textContent;
            }else if(document.getElementById('selectHorarios1').value == '3'){
              this.horarioSala3 = document.getElementById('horarios1').textContent;
            }else if(document.getElementById('selectHorarios1').value == '4'){
              this.horarioSala4 = document.getElementById('horarios1').textContent;
            }else if(document.getElementById('selectHorarios1').value == '5'){
              this.horarioSala5 = document.getElementById('horarios1').textContent;
            }else if(document.getElementById('selectHorarios1').value == '6'){
              this.horarioSala6 = document.getElementById('horarios1').textContent;
            }else if(document.getElementById('selectHorarios1').value == '7'){
              this.horarioSala3D = document.getElementById('horarios1').textContent;
            }
            if(document.getElementById('selectHorarios2').value == '1'){
              this.horarioSala1 = document.getElementById('horarios2').textContent;
            }else if(document.getElementById('selectHorarios2').value == '2'){
              this.horarioSala2 = document.getElementById('horarios2').textContent;
            }else if(document.getElementById('selectHorarios2').value == '3'){
              this.horarioSala3 = document.getElementById('horarios2').textContent;
            }else if(document.getElementById('selectHorarios2').value == '4'){
              this.horarioSala4 = document.getElementById('horarios2').textContent;
            }else if(document.getElementById('selectHorarios2').value == '5'){
              this.horarioSala5 = document.getElementById('horarios2').textContent;
            }else if(document.getElementById('selectHorarios2').value == '6'){
              this.horarioSala6 = document.getElementById('horarios2').textContent;
            }else if(document.getElementById('selectHorarios2').value == '7'){
              this.horarioSala3D = document.getElementById('horarios2').textContent;
            }
            if(document.getElementById('selectHorarios3').value == '1'){
              this.horarioSala1 = document.getElementById('horarios3').textContent;
            }else if(document.getElementById('selectHorarios3').value == '2'){
              this.horarioSala2 = document.getElementById('horarios3').textContent;
            }else if(document.getElementById('selectHorarios3').value == '3'){
              this.horarioSala3 = document.getElementById('horarios3').textContent;
            }else if(document.getElementById('selectHorarios3').value == '4'){
              this.horarioSala4 = document.getElementById('horarios3').textContent;
            }else if(document.getElementById('selectHorarios3').value == '5'){
              this.horarioSala5 = document.getElementById('horarios3').textContent;
            }else if(document.getElementById('selectHorarios3').value == '6'){
              this.horarioSala6 = document.getElementById('horarios3').textContent;
            }else if(document.getElementById('selectHorarios3').value == '7'){
              this.horarioSala3D = document.getElementById('horarios3').textContent;
            }
            const rows = document.querySelectorAll('#registroBody tr');
            rows.forEach(row => {
              row.classList.remove('selected-row');
              document.getElementById('namePelicula').textContent = '';
              this.horaPelicula = 0;
              this.idPeliculaSeleccionada = 0;
            });
            const etiquetas1 = document.querySelectorAll('.etiqueta1');
    etiquetas1.forEach(etiqueta => {
      etiqueta.remove();
    });
    const etiquetas2 = document.querySelectorAll('.etiqueta2');
    etiquetas2.forEach(etiqueta => {
      etiqueta.remove();
    });
    const etiquetas3 = document.querySelectorAll('.etiqueta3');
    etiquetas3.forEach(etiqueta => {
      etiqueta.remove();
    });
            document.getElementById('fechaInicio').value = null;
            document.getElementById('fechaFin').value = null;
            document.getElementById('fechaInicio').disabled = true;
            document.getElementById('fechaFin').disabled = true;
            document.getElementById('priceMovie').value = null;
            document.getElementById('priceMovie').disabled = true;
            document.getElementById('selectHorarios1').value = '0'
            document.getElementById('selectHorarios2').value = '0'
            document.getElementById('selectHorarios3').value = '0'
            document.getElementById('selectHorarios1').disabled = true;
            document.getElementById('selectHorarios2').disabled = true;
            document.getElementById('selectHorarios3').disabled = true;
            document.getElementById('horarios1').textContent = '00:00 ..';
            document.getElementById('horarios2').textContent = '00:00 ..';
            document.getElementById('horarios3').textContent = '00:00 ..';
            document.getElementById('btnAgregarHorarios1').disabled = true;
            document.getElementById('btnAgregarHorarios2').disabled = true;
            document.getElementById('btnAgregarHorarios3').disabled = true;



            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Película actualizada exitosamente',
                showConfirmButton: false,
                timer: 1500
            });
           
        } catch (error) {
          document.getElementById('publicarMovie').disabled = false;
          document.getElementById('cerrarUpload').disabled = false;
          document.getElementById('cerrarUploadMovie').disabled = false;
            if(error.message === 'En estreno'){
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'La fecha de inicio de esta pelicula ya esta en estreno',
                showConfirmButton: false,
                timer: 2000,
            });
            }
            if (error.message === 'Network Error') {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Problemas de conexión',
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
  
                console.error(error);
                Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'La fecha de inicio de esta pelicula ya esta en estreno',
                  showConfirmButton: true,
                 });
            }
        }
      
          
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Agrega al menos 1 horario',
            showConfirmButton: false,
            timer: 1500,
        });
        }
      }else{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'El boleto es muy barato',
          showConfirmButton: false,
          timer: 1500,
      });
      }
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Selecciona una fecha de fin',
        showConfirmButton: false,
        timer: 1500,
    });
    }
    }else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Selecciona una fecha de inicio',
        showConfirmButton: false,
        timer: 1500,
    });
    }
  }else{
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Selecciona una película',
      showConfirmButton: false,
      timer: 1500,
  });
  }
}

@action showSala(idsSala, index, movie, horario) {
  Swal.fire(movie + ' - ' + horario + ' en Sala' + idsSala[index]); 
}

@action async movieDeleteUpload(id){
  try {
    alert(id)
    await (document.getElementById('publicarMovie').disabled = true, document.querySelectorAll('btnEliminarMovieUpload').disabled = true,
     axios.delete(`https://backend-express-production-be7d.up.railway.app/api/uploadMoviePublish/${id}`))
     await this.UpdateListAllMoviesUpload();
     document.getElementById('publicarMovie').disabled = false;
     document.querySelectorAll('btnEliminarMovieUpload').disabled = false;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Eliminado',
            showConfirmButton: false,
            timer: 850,
          });
        
  } catch (error) {
        if(error.response.data.status === 404){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Película no encontrado',
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
}
