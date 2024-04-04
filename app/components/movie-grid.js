import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MovieGridComponent extends Component {
  @service dataStore;
  @tracked usuId2;
  @tracked currentPage2 = 1;
  itemsPerPage2 = 3;
  @tracked filterState2 = 'todos'; 
  @tracked filterType2 = 'todos'; 
  @tracked filterName2 = ''; 
  @tracked imagenSource ;

  @action
  preventDefaultSubmissionMovieG(event) {
    event.preventDefault();
  }

  get totalPages2() {
    const totalMovies = this.filteredMovies.length;
    return Math.ceil(totalMovies / this.itemsPerPage2);
  }

  get filteredMovies() {
    let movies = this.dataStore.getActualizarDatosMovie() || [];

    // Aplicar filtros
    if (this.filterState2 !== 'todos') {
      movies = movies.filter(movie => {
        return movie.generos.map(g => g.toLowerCase()).includes(this.filterState2.toLowerCase());
      });
    }
    if (this.filterType2 !== 'todos') {
      movies = movies.filter(movie => movie.strEstado.toLowerCase() === this.filterType2.toLowerCase());
    }
    if (this.filterName2.trim() !== '') {
      movies = movies.filter(movie =>
        movie.strNombre.toLowerCase().includes(this.filterName2.toLowerCase())
      );
    }

    return movies;
  }

  get paginatedMovies() {
    const startIndex = (this.currentPage2 - 1) * this.itemsPerPage2;
    const endIndex = startIndex + this.itemsPerPage2;
    return this.filteredMovies.slice(startIndex, endIndex);
  }

  @action
  async filterByState2(event) {
    this.filterState2 = event.target.value === 'todos' ? event.target.value : event.target.value.toLowerCase();
    this.currentPage2 = 1;
  }

  @action
  async filterByType2(event) {
    this.filterType2 = event.target.value === 'todos' ? event.target.value : event.target.value.toLowerCase();
    this.currentPage2 = 1;
  }

  @action
  async filterByName2(event) {
    this.filterName2 = event.target.value.trim();
    this.currentPage2 = 1;
  }

  @action
  async nextPage2() {
    if (this.currentPage2 < this.totalPages2) {
      this.currentPage2++;
    }
  }

  @action
  async previousPage2() {
    if (this.currentPage2 > 1) {
      this.currentPage2--;
    }
  }

  async loadData2() {
    await this.dataStore.updateListMovie(); 
  }
  
  @action async  deleteMovie(movie) {

    try {
      await axios
        .delete(`http://localhost:3000/api/pelicula/${movie}`)
        .then((response) => {
          const { data } = response;
          if (data.message === 'Película eliminada correctamente') {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Eliminado',
              showConfirmButton: false,
              timer: 850,
            });
          }
          if (response.status === 404) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Película no encontrado',
              showConfirmButton: false,
              timer: 1500,
            });
          }
          if (response.status === 'ERROR') {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Problemas de conexión',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        });
      await this.UpdateListMovies();
    } catch (error) {
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

  
 obtenerIdGenero(genero) {
  // Lógica para obtener el ID del género según su nombre
  switch (genero.toLowerCase()) {
      case 'acción':
          return 1;
      case 'aventura':
          return 2;
      case 'comedia':
          return 3;
      case 'drama':
          return 4;
      case 'fantasía':
          return 5;
      case 'misterio':
          return 6;
      case 'romance':
          return 7;
      case 'terror':
          return 8;
      case 'ciencia ficción':
          return 9;
      default:
          return null;
  }
}

  @action
async editarMovie(movie) {
    try {
        // Mostrar los datos de la película en el modal de edición
        this.usuId2 = movie.id;
        var modalEditar = document.getElementById('ocultarEdit');
        var mNombre = document.getElementById('recipient-movie2');
        var mContraseña = document.getElementById('synopsisMovie2');
        var mUsuarioNormal = document.getElementById('numberDuration2');
        var mUsuarioAdmin = document.getElementById('opDisponible2');
        var mUsuarioActivo = document.getElementById('opRetirada2');
        var imagenMovie = document.getElementById('cont-imagen2');
        
        mNombre.value = movie.strNombre;
        mContraseña.value = movie.strSinopsis;
        mUsuarioNormal.value = movie.intDuracion;
        if (movie.strEstado === 'Disponible') {
            mUsuarioAdmin.setAttribute('selected', 'selected');
        } else {
            mUsuarioActivo.setAttribute('selected', 'selected');
        }
        imagenMovie.src= "data:image/png;base64, " + movie.bloImagen;
        this.imagenSource = imagenMovie.src;
        // Generar dinámicamente elementos de género
        const tagContainer = document.getElementById('tagContainer2');
        tagContainer.innerHTML = ''; // Limpiar los elementos existentes

        movie.generos.forEach(genero => {
            const tag = document.createElement('div');
            tag.classList.add('etiqueta');
            tag.textContent = genero;

            // Agregar el ID del género como un atributo de datos
            const generoId = this.obtenerIdGenero(genero); // Función para obtener el ID del género
            if (generoId !== null) {
                tag.dataset.generoId = generoId;
            }

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
        });

        modalEditar.click();
    } catch (error) {
        await Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'ERROR',
            showConfirmButton: false,
            timer: 1500,
        });
    }
}
  
  @action async actualizarDatos() {
    
  }

  @action
async updateMovie() {
    const cerrar = document.getElementById('cerrarMovieG');
    const movie = document.getElementById('recipient-movie2').value;
    const synopsis = document.getElementById('synopsisMovie2').value;
    const duration = document.getElementById('numberDuration2').value;
    const etiquetas = document.querySelectorAll('.etiqueta');
    const valorimagen = document.getElementById('cont-imagen2');

    if (movie.length >= 1) {
        if (synopsis.length >= 76) {
            if (duration.length >= 2) {
                if (etiquetas.length >= 1) {
                    if (!valorimagen.src.includes('images/pelicula-icon.jpg')) {

                        try {
                            const formData = new FormData();
                            formData.append('strNombre', document.getElementById('recipient-movie2').value);
                            formData.append('strSinopsis', document.getElementById('synopsisMovie2').value);
                            formData.append('intDuracion', document.getElementById('numberDuration2').value);
                            if (document.getElementById('opDisponible2').selected) {
                                formData.append('idEstadoPelicula', document.getElementById('opDisponible2').value);
                            } else {
                                formData.append('idEstadoPelicula', document.getElementById('opRetirada2').value);
                            }

                            // Obtener los IDs de los géneros desde los elementos etiqueta
                            const generosTags = document.querySelectorAll('.etiqueta');
                            const generosIds = Array.from(generosTags).map(tag => tag.dataset.generoId);

                            // Agregar los IDs de los géneros al formData
                            generosIds.forEach(generoId => {
                                formData.append('generos[]', generoId);
                            });


                            // Validar si se ha seleccionado una nueva imagen
                            const fileInput = document.getElementById('foto-input2');
                            if (fileInput.files && fileInput.files[0] && this.imagenSource != valorimagen.src) {
                                formData.append('imagen', fileInput.files[0]);
                                formData.append('nombreArchivo', fileInput.files[0].name);

                            } else {
                                formData.append('imagen', 'no');
                            }

                            // Realizar la solicitud POST al backend
                            const response = await (document.getElementById('enviarMovie2').disabled = true, document.getElementById('cerrarMovieG').disabled = true,
                            document.getElementById('cerrarGMovie').disabled = true, axios.put(`http://localhost:3000/api/pelicula/${this.usuId2}`, formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }));
                            document.getElementById('enviarMovie2').disabled = false;
                            document.getElementById('cerrarMovieG').disabled = false;
                            document.getElementById('cerrarGMovie').disabled = false;
                            await this.UpdateListMovies();
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Película actualizada exitosamente',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            cerrar.click();

                        } catch (error) {
                          document.getElementById('enviarMovie2').disabled = false;
                            document.getElementById('cerrarMovieG').disabled = false;
                            document.getElementById('cerrarGMovie').disabled = false;
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
                                    timer: 1500
                                }); // Manejar errores
                            }
                        }
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


  async UpdateListMovies() {
    try {
      const response = await axios.get('http://localhost:3000/api/peliculas');
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

  @action
  handleInputMovieG(event) {
    const myInput3 = document.getElementById('recipient-movie2');
    const myInput4 = document.getElementById('synopsisMovie2');
    const myInput5 = document.getElementById('numberDuration2');
  
    const chr = String.fromCharCode(event.which);
    const validMovie = 
      "1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZáéíóü'-!?:;()/ ";
    const validSinopsis =
      "1234567890qwertyuiopasdfghjklñzxcvbnmQWERTYUIOPASDFGHJKLÑMNBVCXZ@áéíóü.,!?:;-'()[]{}/ ";
    const validDuration =
      "1234567890"
  
    if(event.target === myInput3){
      if (event.key === 'Backspace' || event.key === 'Tab' || event.key === '-' || event.key === "'" || event.key === '?' || event.key === ';' || event.key === ':' || event.key === '"' || event.key === 'ñ') {
      return;
      }
    if(validMovie.indexOf(chr) < 0 && !event.ctrlKey){
      event.preventDefault();
    }
  }

  if(event.target === myInput4){
    if (event.key === 'Backspace' || event.key === 'Tab' || event.key === ',' || event.key === '.' || event.key === '?' || event.key === ';' || event.key === ':' || event.key === '-' || event.key === "'" || event.key === '[' || event.key === ']' || event.key === '{' || event.key === '}' || event.key === 'ñ') {
    return;
    }
  if(validSinopsis.indexOf(chr) < 0 && !event.ctrlKey){
    event.preventDefault();
  }
}

  if(event.target === myInput5){
    if (event.key === 'Backspace' || event.key === 'Tab'){
      return;
    }

    if(myInput5.value.length >=3 && !event.ctrlKey){
      event.preventDefault();
    }else if(validDuration.indexOf(chr) < 0 && !event.ctrlKey){
      event.preventDefault();
    }
  }
  }

  @action
  changeImage2(event) {
    const defaultFile = '../images/pelicula-icon.jpg';
    const img = document.getElementById('cont-imagen2');
  
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        img.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      Swal.fire({
        position: "top-center",
        title: "No seleccionaste una imagen nueva",
        showConfirmButton: true,
      });
    }
  }

  @action
selectOption2(option) {
  const tagContainer = document.getElementById('tagContainer2');

  // Verificar si ya hay 4 elementos creados
  const etiquetas = document.querySelectorAll('.etiqueta');
  if (etiquetas.length >= 4) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Máximo 4 géneros seleccionados",
      showConfirmButton: true,
    });
    return;
  }

  // Obtener el ID del género
  let generoId;
  switch(option) {
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
    etiquetas.forEach(etiqueta => {
      if (etiqueta.textContent.trim().toLowerCase().endsWith('x') && etiqueta.textContent.trim().toLowerCase().slice(0, -1) === option.toLowerCase()) {
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

  @action 
  removeDataGMovie(){
    document.getElementById('recipient-movie2').value = '';
    document.getElementById('synopsisMovie2').value = '';;
   document.getElementById('numberDuration2').value = null;
   const etiquetas = document.querySelectorAll('.etiqueta');
   etiquetas.forEach(etiqueta => {
     etiqueta.remove();
   });
   document.getElementById('opDisponible2').selected = false;
   document.getElementById('opRetirada2').selected = false;
   document.getElementById('opDisponible2').selected = true;
document.getElementById('cont-imagen2').src='../images/pelicula-icon.jpg';
  }
}
