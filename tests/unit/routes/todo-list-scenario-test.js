import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | todo-list-scenario', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:todo-list-scenario');
    assert.ok(route);
  });
});
