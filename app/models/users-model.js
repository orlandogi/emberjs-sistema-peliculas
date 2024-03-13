import Model, { attr, belongsTo } from '@ember-data/model';

export default class UsersModel extends Model {
  @attr('string') strNombreUsuario;
  @attr('string') strContrasena;
  @belongsTo('type-users') TipoEstado;
  @belongsTo('states-users') TipoUsuario;
}
