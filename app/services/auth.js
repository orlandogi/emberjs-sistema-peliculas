// app/services/auth.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AuthService extends Service {
  @tracked isAuthenticated = false;
  @tracked currentUser = null;
  @service router;

  @action
  setToken(token) {
    localStorage.setItem('token', token);
    this.isAuthenticated = true;
  }

  @action
  setAdmin(permiso) {
    localStorage.setItem('admin', permiso);
  }


  @action
  loadTypeOfUser(){
    const permiso = localStorage.getItem('admin')
    if(permiso){
      return true;
    }else{
      return false;
    }
  }

  @action
  loadTokenFromStorage() {
    // Carga el token de sesión desde el almacenamiento local al iniciar la aplicación
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticated = true;
      return true;
    }else{
      this.isAuthenticated = false;
      return false;
    }
  }

  @action
  logout() {
    // Elimina el token de sesión del almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    this.isAuthenticated = false;
    this.currentUser = null;
    this.router.transitionTo('login');
  }

  @action
  isAdmin() {
    // Verifica si el usuario es administrador
    return this.isAuthenticated && this.currentUser && this.currentUser.idTipoUsuario === 2;
  }

  @action
  isUser() {
    // Verifica si el usuario es normal
    return this.isAuthenticated && this.currentUser && this.currentUser.idTipoUsuario === 1;
  }
}
