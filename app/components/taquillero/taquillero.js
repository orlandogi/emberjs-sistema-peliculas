import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TaquilleroTaquilleroComponent extends Component {
  @service dataStore;
  @tracked currentPage6 = 1;
  itemsPerPage6 = 2;
  @tracked imagenSource2;
  @tracked numAdultos = 0;
  @tracked numNiños = 0;
  @tracked precioAdulto = 0;
  @tracked precioNiño = 0;
  @tracked asientos = [];
  @tracked precioPeli = '';

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

  @action
  preventDefaultSubmissionTaquillero(event) {
    event.preventDefault();
  }

  @action
  cerrarTaquilla() {
    document.getElementById('nameClient').value = '';
    this.numAdultos = 0;
    this.numNiños = 0;
    document.getElementById('totalAsientos').textContent = '0';
    document.getElementById('codigoAsientos').textContent = '';
    document.getElementById('totalPrecioTickets').textContent = '$0.00 mx';
  }

  async UpdateListAllTickets() {
    try {
      const response = await axios.get(
        'https://backend-express-production-be7d.up.railway.app/api/tickets',
      );
      const { data } = response;
      this.dataStore.setActualizarTickets(data);
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

  @action async comprar() {
    const nameCliente = document.getElementById('nameClient').value;
    const tickets = document.getElementById('totalAsientos').textContent;

    if (nameCliente != '') {
      if (parseInt(tickets) > 0) {
        try {
          const formData = new FormData();
          formData.append(
            'dteFechaCompra',
            document.getElementById('fechaHoy').textContent,
          );
          formData.append(
            'strFolio',
            document.getElementById('folioTicket').textContent,
          );
          formData.append(
            'pelicula',
            document.getElementById('idPeliculaTicket').textContent,
          );
          formData.append(
            'idSala',
            parseInt(document.getElementById('idSalaMovie').textContent),
          );
          formData.append(
            'horario',
            document.getElementById('idHorarioMovie').textContent,
          );
          formData.append(
            'strNombreCliente',
            document.getElementById('nameClient').value,
          );
          formData.append(
            'boletosAdultos',
            parseInt(document.getElementById('numAdultos').textContent),
          );
          formData.append(
            'boletosNiños',
            parseInt(document.getElementById('numNiños').textContent),
          );
          formData.append(
            'totalBoletos',
            parseInt(document.getElementById('totalAsientos').textContent),
          );
          formData.append(
            'curTotal',
            document.getElementById('totalPrecioTickets').textContent,
          );
          formData.append(
            'asientos',
            document.getElementById('codigoAsientos').textContent,
          );

          await ((document.getElementById('ComprarBoletoTick').disabled = true),
          (document.getElementById('cerrarModalTaquillero').disabled = true),
          (document.getElementById('cerrarTaquillero').disabled = true),
          axios({
            method: 'post',
            url: 'https://backend-express-production-be7d.up.railway.app/api/ticket',
            data: {
              dteFechaCompra: document.getElementById('fechaHoy').textContent,
              strFolio: document.getElementById('folioTicket').textContent,
              pelicula: document.getElementById('idPeliculaTicket').textContent,
              idSala: parseInt(
                document.getElementById('idSalaMovie').textContent,
              ),
              horario: document.getElementById('idHorarioMovie').textContent,
              strNombreCliente: document.getElementById('nameClient').value,
              boletosAdultos: parseInt(
                document.getElementById('numAdultos').textContent,
              ),
              boletosNiños: parseInt(
                document.getElementById('numNiños').textContent,
              ),
              totalBoletos: parseInt(
                document.getElementById('totalAsientos').textContent,
              ),
              curTotal:
                document.getElementById('totalPrecioTickets').textContent,
              asientos: document.getElementById('codigoAsientos').textContent,
              precio: this.precioPeli,
            },
          }));
          await this.UpdateListAllTickets();
          document.getElementById('ComprarBoletoTick').disabled = false;
          document.getElementById('cerrarModalTaquillero').disabled = false;
          document.getElementById('cerrarTaquillero').disabled = false;

          // Crear el PDF
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
          y += 5; // Incrementar más la distancia después del título

          // Agregar línea divisora
          pdf.setLineWidth(0.2);
          pdf.line(10, y, pageWidth - 10, y);
          y += lineHeight + 3;

          // Obtener los datos del HTML
          const folio = document.getElementById('folioTicket').textContent;
          const fecha = document.getElementById('fechaHoy').textContent;
          const pelicula =
            document.getElementById('idPeliculaTicket').textContent;
          const sala = document.getElementById('idSalaMovie').textContent;
          const horario = document.getElementById('idHorarioMovie').textContent;
          const cliente = document.getElementById('nameClient').value;
          const adultos = document.getElementById('numAdultos').textContent;
          const niños = document.getElementById('numNiños').textContent;
          const total =
            document.getElementById('totalPrecioTickets').textContent;
          const asientos =
            document.getElementById('codigoAsientos').textContent;
          const boleto = document.getElementById('totalAsientos').textContent;

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
          y += lineHeight;

          pdf.setFontSize(12);
          pdf.text(`Total: ${total}`, 10, y);
          y += lineHeight;

          // Guardar el PDF
          pdf.save('Ticket_compra.pdf');

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Ticket registrado',
            showConfirmButton: false,
            timer: 1500,
          });

          document.getElementById('cerrarModalTaquillero').click();
        } catch (error) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            showConfirmButton: false,
            timer: 1800,
          });
        }
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Agrega un boleto',
          showConfirmButton: false,
          timer: 1800,
        });
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Escribe el nombre del cliente',
        showConfirmButton: false,
        timer: 1800,
      });
    }
  }

  @action prueba() {
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
    const fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia} `;
    document.getElementById('fechaHoy').textContent = fechaFormateada;

    const fecha = new Date();

    // Formatear la hora actual en formato HHMMSS
    const horaActual = fecha.getSeconds().toString().padStart(2, '0');

    // Generar el folio combinando el prefijo, la hora actual y un número aleatorio
    const folio = `${''}${horaActual}-${Math.floor(Math.random() * 1000)}`;

    document.getElementById('folioTicket').textContent = folio;
  }

  @action handleInputTaquillero(event) {
    const myInput2 = document.getElementById('nameClient');

    const chr = String.fromCharCode(event.which);
    const validCharacters =
      '1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZáéíóü ';

    if (event.target === myInput2) {
      if (
        event.key === 'Backspace' ||
        event.key === 'Tab' ||
        event.key === '_'
      ) {
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
  restarAdulto() {
    if (this.numAdultos > 0) {
      this.numAdultos--;
      this.actualizarAsientos();
    }
  }

  @action
  sumarAdulto() {
    if (this.numAdultos + this.numNiños < 10) {
      this.numAdultos++;
      this.actualizarAsientos();
    }
  }

  @action
  restarNiño() {
    if (this.numNiños > 0) {
      this.numNiños--;
      this.actualizarAsientos();
    }
  }

  @action
  sumarNiño() {
    if (this.numAdultos + this.numNiños < 10) {
      this.numNiños++;
      this.actualizarAsientos();
    }
  }

  @action
  showSala(idsSala, index, movie, horario, precio) {
    document.getElementById('btnTaquillero').click();
    document.getElementById('idPeliculaTicket').textContent = movie;
    document.getElementById('idHorarioMovie').textContent = horario;
    document.getElementById('idSalaMovie').textContent = idsSala[index];
    this.precioAdulto = precio;
    this.precioNiño = parseFloat(precio) - 14;
    document.getElementById('precioAdulto').textContent =
      '$' + this.precioAdulto + ' mx';
    document.getElementById('precioNiño').textContent =
      '$' + this.precioNiño + '.00 mx';
    this.actualizarAsientos();
    this.precioPeli = precio;
  }

  actualizarAsientos() {
    this.asientos = [];
    let letra = 'J';
    for (let i = 0; i < this.numAdultos; i++) {
      this.asientos.push(letra + (i + 1));
    }
    letra = 'L'; // Inicia en 'V' para los niños
    for (let i = 0; i < this.numNiños; i++) {
      this.asientos.push(letra + (i + 1));
    }
    this.calcularTotal();
    this.actualizarElementosUI();
  }

  calcularTotal() {
    const totalAdultos = this.numAdultos * this.precioAdulto;
    const totalNiños = this.numNiños * this.precioNiño;
    const total = totalAdultos + totalNiños;
    document.getElementById('totalPrecioTickets').textContent =
      '$' + total.toFixed(2) + ' mx';
  }

  actualizarElementosUI() {
    // Actualizar el total de asientos
    document.getElementById('totalAsientos').textContent =
      this.numAdultos + this.numNiños;

    // Actualizar los códigos de asientos
    document.getElementById('codigoAsientos').textContent =
      this.asientos.join(', ');
  }
}
