import Model, { attr, hasMany } from '@ember-data/model';

export default class StatesUsers extends Model {
  @attr('string') strEstado;
  @hasMany('users-model') usuarios;
}
