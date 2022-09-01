import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class TodoListScenarioRoute extends Route {
  @service solidAuth;
  @service store;

  async model() {
    await this.solidAuth.ensureLogin();
    await this.store.fetchGraphForType('todo-list');
    return this.store.peekInstance(
      'todo-list',
      'http://mu.semte.ch/vocabularies/ext/tests/todo-list-1'
    );
  }
}
