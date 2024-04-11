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
    @tracked idTicket = 0;
    @tracked folioImprimir;
    @tracked fechaImprimir;
    @tracked peliculaImprimir;
    @tracked salaImprimir;
    @tracked horarioImprimir;
    @tracked clienteImprimir;
    @tracked adultosImprimir;
    @tracked niñosImprimir;
    @tracked boletosImprimir;
    @tracked asientosImprimir;
    @tracked totalImprimir;
    

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
        const myInput = document.getElementById('idPeliculaTicketEdit');
        const myInput2 = document.getElementById('nameClientEdit');
        const myInput3 = document.getElementById('idSalaMovieEdit');
      
        const chr = String.fromCharCode(event.which);
        const validCharacters =
          '1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZáéíóü ';
        const validPelicula = 
        '1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZáéíóü" ';
        const validSala = 
        '1234567890Dd" ';
      
        if (event.target === myInput2) {
          if (event.key === 'Backspace' || event.key === 'Tab') {
            return;
          }
      
          if (myInput2.value.length >= 20 && !event.ctrlKey) {
            event.preventDefault();
          } else if (validCharacters.indexOf(chr) < 0 && !event.ctrlKey) {
            event.preventDefault();
          }
        }

        if(event.target === myInput){
          if(event.key === 'Backspace' || event.key === 'Tab' ){
            return;
          }
          if(myInput.value.length >= 50 && !event.ctrlKey){
            event.preventDefault();
          }else if(validPelicula.indexOf(chr) < 0 && !event.ctrlKey){
            event.preventDefault();
          } 
        }

        if(event.target === myInput3){
          if(event.key === 'Backspace' || event.key === 'Tab'){
            return;
          }
          if(myInput3.value.length >= 2 && !event.ctrlKey){
            event.preventDefault();
          }else if(validSala.indexOf(chr) < 0 && !event.ctrlKey){
            event.preventDefault();
          }
        }
    }


    actualizarAsientos2() {
      this.asientos2 = [];
      let letra = 'J';
      for (let i = 0; i < this.numAdultos2; i++) {
          this.asientos2.push(letra + (i + 1));
      }
      letra = 'L'; // Inicia en 'V' para los niños
      for (let i = 0; i < this.numNiños2; i++) {
          this.asientos2.push(letra + (i + 1));
      }
      this.calcularTotal2();
      this.actualizarElementosUI2();
  }

  
  calcularTotal2() {
    const totalAdultos = this.numAdultos2 * this.precioAdulto2;
    const totalNiños = this.numNiños2 * this.precioNiño2;
    const total = totalAdultos + totalNiños;
    document.getElementById('totalPrecioTicketsEdit').textContent = '$' + total.toFixed(2) + ' mx';
}

actualizarElementosUI2() {
  // Actualizar el total de asientos
  document.getElementById('totalAsientosEdit').textContent = this.numAdultos2 + this.numNiños2;

  // Actualizar los códigos de asientos
  document.getElementById('codigoAsientosEdit').textContent = this.asientos2.join(', ');
}


    @action
    restarAdulto2() {
        if (this.numAdultos2 > 0) {
            this.numAdultos2--;
            this.actualizarAsientos2();
        }
    }
    
    @action
    sumarAdulto2() {
        if (this.numAdultos2 + this.numNiños2 < 10) {
            this.numAdultos2++;
            this.actualizarAsientos2();
        }
    }

    @action
  restarNiño2() {
      if (this.numNiños2 > 0) {
          this.numNiños2--;
          this.actualizarAsientos2();
      }
  }
  
  @action
  sumarNiño2() {
      if (this.numAdultos2 + this.numNiños2 < 10) {
          this.numNiños2++;
          this.actualizarAsientos2();
      }
  }
   
  @action async imprimirTick(){
    const pdf = new jsPDF('p', 'mm', 'a6');

    // Definir tamaño de página y posición inicial
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    let y = 15;
    const lineHeight = 8;

    // Establecer el borde
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);

    // Establecer la fuente y tamaño de fuente para el contenido
    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(12);

    // Agregar encabezado con el nombre del cine (como título)
    const cineName = 'SuperCool';
    pdf.setFontSize(18); // Aumentar el tamaño de la fuente para el título
    pdf.text(cineName, pageWidth / 2, y, { align: 'center' });
    y += 5 ; // Incrementar más la distancia después del título

    // Agregar línea divisora
    pdf.setLineWidth(0.2);
    pdf.line(10, y, pageWidth - 10, y);
    y += lineHeight + 3;


    pdf.setFontSize(12);
    pdf.text(`Fecha: ${this.fechaImprimir}`, 10, y);
    pdf.text(`Folio: ${this.folioImprimir}`, pageWidth / 2, y);
    y += lineHeight + 3;

    pdf.setFontSize(12);
    pdf.text(`Película: ${this.peliculaImprimir}`, 10, y);
    y += lineHeight + 1;
   
    pdf.setFontSize(12);
    pdf.text(`Sala: ${this.salaImprimir}`, 10, y);
    pdf.text(`Horario: ${this.horarioImprimir}`, pageWidth / 2, y);
    y += lineHeight + 1;

    pdf.setFontSize(12);
    pdf.text(`Cliente: ${this.clienteImprimir}`, 10, y);
    y += lineHeight + 1;

    pdf.setFontSize(12);
    pdf.text(`Num. adultos: ${this.adultosImprimir}`, 10, y);
    y += lineHeight + 1;

    pdf.setFontSize(12);
    pdf.text(`Num. niños: ${this.niñosImprimir}`, 10, y);
    y += lineHeight + 1;

    pdf.setFontSize(12);
    pdf.text(`Boletos: ${this.boletosImprimir}`, 10, y);
    y += lineHeight + 1;
    
    pdf.setFontSize(12);
    pdf.text(`Asientos: ${this.asientosImprimir}`, 10, y);
    y += lineHeight + 3;
   
    // Agregar línea divisora
    pdf.setLineWidth(0.2);
    pdf.line(10, y, pageWidth - 25, y);
    y += lineHeight ;

    pdf.setFontSize(12);
    pdf.text(`Total: ${this.totalImprimir}`, 10, y);
    y += lineHeight  ;
    // Guardar el PDF
    pdf.save('Ticket_compra.pdf');
  }
    
  @action editarTicket(edit){

    this.folioImprimir = edit.folio;
    this.fechaImprimir = edit.fecha;
    this.peliculaImprimir = edit.pelicula;
    this.salaImprimir = edit.sala;
    this.horarioImprimir = edit.horario;
    this.clienteImprimir = edit.cliente;
    this.adultosImprimir = edit.adultos;
    this.niñosImprimir = edit.niños;
    this.boletosImprimir = edit.boletos;
    this.asientosImprimir = edit.asientos;
    this.totalImprimir = edit.total;
    document.getElementById('btnTicket').click();
    document.getElementById('folioTicket').textContent = edit.folio;
    document.getElementById('fechaHoyEdit').textContent = edit.fecha;
    document.getElementById('idPeliculaTicketEdit').value = edit.pelicula;
    document.getElementById('idSalaMovieEdit').value = edit.sala;
    document.getElementById('idHorarioMovieEdit').value = edit.horario;
    document.getElementById('nameClientEdit').value = edit.cliente
   
    this.numAdultos2 = edit.adultos;
    this.numNiños2 = edit.niños;
    document.getElementById('totalAsientosEdit').textContent = edit.boletos;
    document.getElementById('codigoAsientosEdit').textContent = edit.asientos;
    document.getElementById('totalPrecioTicketsEdit').textContent = edit.total;
    this.precioAdulto2 = edit.precio;
    this.precioNiño2 = (parseFloat(edit.precio) - 14);
    document.getElementById('precioAdulto22').textContent = '$' + this.precioAdulto2 + ' mx';
    document.getElementById('precioNiñoEdit').textContent = '$' + this.precioNiño2 + '.00 mx';
    this.idTicket = edit.id;
    }


 @action cerrarEditTicket(){
  let cerrado;


 }


 @action prueba2(){
let cerrado;
}

 @action async comprar2(){
  try{

  await(document.getElementById('cerrarModalTicket').disabled = true, document.getElementById('ComprarBoletoTickEdit').disabled = true,
  document.getElementById('cerrarTicketEdit').disabled = true, document.getElementById('imprimirTicket').disabled = true,
  axios({
   method: 'put',
   url: `https://backend-express-production-be7d.up.railway.app/api/ticket/${this.idTicket}`,
   data: {
    fecha: document.getElementById('fechaHoyEdit').textContent,
    folio: document.getElementById('folioTicket').textContent,
    pelicula: document.getElementById('idPeliculaTicketEdit').value,
    sala:parseInt(document.getElementById('idSalaMovieEdit').value),
    horario:document.getElementById('idHorarioMovieEdit').value,
    nombre:document.getElementById('nameClientEdit').value,
    adultos: parseInt(document.getElementById('numAdultos22').textContent),
    niños: parseInt(document.getElementById('numNiñosEdit').textContent),
    boletos: parseInt(document.getElementById('totalAsientosEdit').textContent),
    total: document.getElementById('totalPrecioTicketsEdit').textContent,
    asientos: document.getElementById('codigoAsientosEdit').textContent,
    id: this.idTicket,
  }
 }));
 await this.updateALLTickets();
 document.getElementById('cerrarModalTicket').disabled = false;
 document.getElementById('ComprarBoletoTickEdit').disabled = false;
  document.getElementById('cerrarTicketEdit').disabled = false;
  document.getElementById('imprimirTicket').disabled = false;
  document.getElementById('cerrarTicketEdit').click();

  const pdf = new jsPDF('p', 'mm', 'a6');

  // Definir tamaño de página y posición inicial
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  let y = 15;
  const lineHeight = 8;

  // Establecer el borde
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.5);
  pdf.rect(5, 5, pageWidth - 10, pageHeight - 10);

  // Establecer la fuente y tamaño de fuente para el contenido
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(12);

  // Agregar encabezado con el nombre del cine (como título)
  const cineName = 'SuperCool';
  pdf.setFontSize(18); // Aumentar el tamaño de la fuente para el título
  pdf.text(cineName, pageWidth / 2, y, { align: 'center' });
  y += 5 ; // Incrementar más la distancia después del título

  // Agregar línea divisora
  pdf.setLineWidth(0.2);
  pdf.line(10, y, pageWidth - 10, y);
  y += lineHeight + 3;



  // Obtener los datos del HTML
  const folio = document.getElementById('folioTicket').textContent;
  const fecha = document.getElementById('fechaHoyEdit').textContent;
  const pelicula = document.getElementById('idPeliculaTicketEdit').value;
  const sala = document.getElementById('idSalaMovieEdit').value;
  const horario = document.getElementById('idHorarioMovieEdit').value;
  const cliente = document.getElementById('nameClientEdit').value;
  const adultos = document.getElementById('numAdultos22').textContent;
  const niños = document.getElementById('numNiñosEdit').textContent;
  const total = document.getElementById('totalPrecioTicketsEdit').textContent;
  const asientos = document.getElementById('codigoAsientosEdit').textContent;
  const boleto = document.getElementById('totalAsientosEdit').textContent;
  
  pdf.setFontSize(12);
  pdf.text(`Fecha: ${fecha}`, 10, y);
  pdf.text(`Folio: ${folio}`, pageWidth / 2, y);
  y += lineHeight + 3;

  pdf.setFontSize(12);
  pdf.text(`Película: ${pelicula}`, 10, y);
  y += lineHeight + 1;
 
  pdf.setFontSize(12);
  pdf.text(`Sala: ${sala}`, 10, y);
  pdf.text(`Horario: ${horario}`, pageWidth / 2, y);
  y += lineHeight + 1;

  pdf.setFontSize(12);
  pdf.text(`Cliente: ${cliente}`, 10, y);
  y += lineHeight + 1;

  pdf.setFontSize(12);
  pdf.text(`Num. adultos: ${adultos}`, 10, y);
  y += lineHeight + 1;

  pdf.setFontSize(12);
  pdf.text(`Num. niños: ${niños}`, 10, y);
  y += lineHeight + 1;

  pdf.setFontSize(12);
  pdf.text(`Boletos: ${boleto}`, 10, y);
  y += lineHeight + 1;
  
  pdf.setFontSize(12);
  pdf.text(`Asientos: ${asientos}`, 10, y);
  y += lineHeight + 3;
 
  // Agregar línea divisora
  pdf.setLineWidth(0.2);
  pdf.line(10, y, pageWidth - 25, y);
  y += lineHeight ;

  pdf.setFontSize(12);
  pdf.text(`Total: ${total}`, 10, y);
  y += lineHeight  ;
 
 

  // Guardar el PDF
  pdf.save('Ticket_compra.pdf');

 await Swal.fire({
  position: 'center',
  icon: 'success',
  title: 'Ticket actualizado',
  showConfirmButton: false,
  timer: 1500,
});


}catch(error){
  document.getElementById('cerrarModalTicket').disabled = false;
  document.getElementById('ComprarBoletoTickEdit').disabled = false;
   document.getElementById('cerrarTicketEdit').disabled = false;
   document.getElementById('imprimirTicket').disabled = false;
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'Problemas de conexion',
    showConfirmButton: false,
    timer: 1500,
  });
}
}
}
