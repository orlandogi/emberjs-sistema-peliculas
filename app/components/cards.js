import Component from '@glimmer/component';
import axios from 'axios';
import Swal from 'sweetalert2';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MovieGridComponent extends Component {
  @service dataStore;

  get cardsIndex() {
    return this.dataStore.getActualizarPeliculasPublicadas()
  }
}