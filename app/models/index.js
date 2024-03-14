// app/models/usuario.js
import Model, { attr } from '@ember-data/model';

export default class UsuUsuarioModel extends Model {
  @attr('number') id;
  @attr('string') strNombreUsuario;
  @attr('string') strContraseña;
  @attr('number') idTipoUsuario;
  @attr('number') idTipoEstado;
  // Agrega más atributos según la estructura de tus objetos JSON
}
