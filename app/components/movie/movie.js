import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import axios from 'axios';
import Swal from 'sweetalert2';
import { inject as service } from '@ember/service';

export default class MovieMovieComponent extends Component {
  @service dataStore;

  @action
  preventDefaultSubmissionMovie(event) {
    event.preventDefault();
  }

  @action
  changeImage(event) {
    const defaultFile = '../images/pelicula-icon.jpg';
    const img = document.getElementById('cont-imagen');

    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      Swal.fire({
        position: 'top-center',
        title: 'No seleccionaste una imagen nueva',
        showConfirmButton: true,
      });
    }
  }

  @action
  handleInputMovie(event) {
    const myInput3 = document.getElementById('recipient-movie');
    const myInput4 = document.getElementById('synopsisMovie');
    const myInput5 = document.getElementById('numberDuration');

    const chr = String.fromCharCode(event.which);
    const validMovie =
      "1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZáéíóü'-!?:;()/ ";
    const validSinopsis =
      "1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZ@áéíóü.,!?:;-'()[]{}/ ";
    const validDuration = '1234567890';

    if (event.target === myInput3) {
      if (
        event.key === 'Backspace' ||
        event.key === 'Tab' ||
        event.key === '-' ||
        event.key === "'" ||
        event.key === '?' ||
        event.key === ';' ||
        event.key === ':' ||
        event.key === '"' ||
        event.key === 'ñ'
      ) {
        return;
      }
      if (validMovie.indexOf(chr) < 0 && !event.ctrlKey) {
        event.preventDefault();
      }
    }

    if (event.target === myInput4) {
      if (
        event.key === 'Backspace' ||
        event.key === 'Tab' ||
        event.key === ',' ||
        event.key === '.' ||
        event.key === '?' ||
        event.key === ';' ||
        event.key === ':' ||
        event.key === '-' ||
        event.key === "'" ||
        event.key === '[' ||
        event.key === ']' ||
        event.key === '{' ||
        event.key === '}' ||
        event.key === 'ñ'
      ) {
        return;
      }
      if (validSinopsis.indexOf(chr) < 0 && !event.ctrlKey) {
        event.preventDefault();
      }
    }

    if (event.target === myInput5) {
      if (event.key === 'Backspace' || event.key === 'Tab') {
        return;
      }

      if (myInput5.value.length >= 3 && !event.ctrlKey) {
        event.preventDefault();
      } else if (validDuration.indexOf(chr) < 0 && !event.ctrlKey) {
        event.preventDefault();
      }
    }
  }

  @action
  removeDataMovie() {
    document.getElementById('recipient-movie').value = '';
    document.getElementById('synopsisMovie').value = '';
    document.getElementById('numberDuration').value = null;
    const etiquetas = document.querySelectorAll('.etiqueta');
    etiquetas.forEach((etiqueta) => {
      etiqueta.remove();
    });
    document.getElementById('opDisponible').selected = false;
    document.getElementById('opRetirada').selected = false;
    document.getElementById('opDisponible').selected = true;
    document.getElementById('cont-imagen').src = '../images/pelicula-icon.jpg';
  }

  @action
  selectOption(option) {
    const tagContainer = document.getElementById('tagContainer');

    // Verificar si ya hay 4 elementos creados
    const etiquetas = document.querySelectorAll('.etiqueta');
    if (etiquetas.length >= 4) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Máximo 4 géneros seleccionados',
        showConfirmButton: true,
      });
      return;
    }

    // Obtener el ID del género
    let generoId;
    switch (option) {
      case 'Acción':
        generoId = 1;
        break;
      case 'Aventura':
        generoId = 2;
        break;
      case 'Comedia':
        generoId = 3;
        break;
      case 'Drama':
        generoId = 4;
        break;
      case 'Fantasía':
        generoId = 5;
        break;
      case 'Misterio':
        generoId = 6;
        break;
      case 'Romance':
        generoId = 7;
        break;
      case 'Terror':
        generoId = 8;
        break;
      case 'Ciencia ficción':
        generoId = 9;
        break;
      default:
        generoId = null;
    }

    if (generoId !== null) {
      // Verificar si el género ya está presente
      let generoExistente = false;
      etiquetas.forEach((etiqueta) => {
        if (
          etiqueta.textContent.trim().toLowerCase().endsWith('x') &&
          etiqueta.textContent.trim().toLowerCase().slice(0, -1) ===
            option.toLowerCase()
        ) {
          generoExistente = true;
          return;
        }
      });

      // Si el género no está presente, agregarlo
      if (!generoExistente) {
        // Crear una nueva etiqueta
        const tag = document.createElement('div');
        tag.classList.add('etiqueta');
        tag.textContent = option;

        // Establecer el ID del género como atributo data
        tag.dataset.generoId = generoId;

        // Crear el botón de cierre
        const closeButton = document.createElement('span');
        closeButton.classList.add('etiqueta-close');
        closeButton.textContent = 'x';
        closeButton.addEventListener('click', function () {
          tag.remove();
        });

        // Adjuntar el botón de cierre a la etiqueta
        tag.appendChild(closeButton);

        // Agregar la etiqueta al contenedor
        tagContainer.appendChild(tag);
      }
    }
  }

  async UpdateListAllMovies() {
    try {
      const response = await axios.get(
        'https://backend-express-production-be7d.up.railway.app/api/peliculas',
      );
      const { data } = response;
      this.dataStore.setActualizarDatosMovies(data);
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

  async UpdateListAllMoviesUpd() {
    try {
      const response = await axios.get(
        'https://backend-express-production-be7d.up.railway.app/api/peliculasDisponibles',
      );
      const { data } = response;
      this.dataStore.setActualizarPeliculasSubidas(data);
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

  @action
  async insertarMovie() {
    const movie = document.getElementById('recipient-movie').value;
    const synopsis = document.getElementById('synopsisMovie').value;
    const duration = document.getElementById('numberDuration').value;
    const etiquetas = document.querySelectorAll('.etiqueta');
    const valorimagen = document.getElementById('cont-imagen').src;

    if (movie.length >= 1) {
      if (synopsis.length >= 76) {
        if (duration.length >= 2) {
          if (etiquetas.length >= 1) {
            if (!valorimagen.includes('images/pelicula-icon.jpg')) {
              await this.insertMovie(event);
            } else {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Selecciona una imagen para la película',
                showConfirmButton: false,
                timer: 1500,
              });
            }
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Selecciona al menos 1 género',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Duración de la película no valida',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Escribe una sinopsis concreta',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Escribe el nombre de la película',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  @action
  async insertMovie(event) {
    try {
      const formData = new FormData();
      formData.append(
        'strNombre',
        document.getElementById('recipient-movie').value,
      );
      formData.append(
        'strSinopsis',
        document.getElementById('synopsisMovie').value,
      );
      formData.append(
        'intDuracion',
        document.getElementById('numberDuration').value,
      );
      if (document.getElementById('opDisponible').selected) {
        formData.append(
          'idEstadoPelicula',
          document.getElementById('opDisponible').value,
        );
      } else {
        formData.append(
          'idEstadoPelicula',
          document.getElementById('opRetirada').value,
        );
      }

      // Obtener los IDs de los géneros desde los elementos etiqueta
      const generosTags = document.querySelectorAll('.etiqueta');
      const generosIds = Array.from(generosTags).map(
        (tag) => tag.dataset.generoId,
      );

      // Agregar los IDs de los géneros al formData
      generosIds.forEach((generoId) => {
        formData.append('generos[]', generoId);
      });

      // Agregar la imagen seleccionada
      const fileInput = document.getElementById('foto-input');
      if (fileInput.files && fileInput.files[0]) {
        formData.append('imagen', fileInput.files[0]);
      }

      // Agregar el nombre del archivo
      formData.append('nombreArchivo', fileInput.files[0].name);

      // Realizar la solicitud POST al backend
      const response = await ((document.getElementById('enviarMovie').disabled =
        true),
      (document.getElementById('cerrarMovie2').disabled = true),
      (document.getElementById('cerrarMovie1').disabled = true),
      axios.post(
        'https://backend-express-production-be7d.up.railway.app/api/pelicula',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      ));
      await this.UpdateListAllMovies();
      await this.UpdateListAllMoviesUpd();
      document.getElementById('enviarMovie').disabled = false;
      document.getElementById('cerrarMovie2').disabled = false;
      document.getElementById('cerrarMovie1').disabled = false;
      document.getElementById('recipient-movie').value = '';
      document.getElementById('synopsisMovie').value = '';
      document.getElementById('numberDuration').value = null;
      const etiquetas = document.querySelectorAll('.etiqueta');
      etiquetas.forEach((etiqueta) => {
        etiqueta.remove();
      });
      document.getElementById('opDisponible').selected = false;
      document.getElementById('opRetirada').selected = false;
      document.getElementById('opDisponible').selected = true;
      document.getElementById('cont-imagen').src =
        '../images/pelicula-icon.jpg';
      document.getElementById('cerrarMovie2').click();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Película insertada exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      document.getElementById('enviarMovie').disabled = false;
      document.getElementById('cerrarMovie2').disabled = false;
      document.getElementById('cerrarMovie1').disabled = false;
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
          title: 'Pelicula repetida',
          showConfirmButton: false,
          timer: 1500,
        }); // Manejar errores
      }
    }
  }
}
