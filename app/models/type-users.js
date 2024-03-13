import Model, { attr, hasMany } from '@ember-data/model';

export default class TypeUsers extends Model {
  @attr('string') strNombre;
  @attr('string') strDescripcion;
  @hasMany('users-model') usuarios;
}
