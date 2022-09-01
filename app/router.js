import EmberRouter from '@ember/routing/router';
import config from 'solid-list-test/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('todo-list-scenario');
});
