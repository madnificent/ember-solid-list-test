import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { getOwner } from '@ember/application';
import rdflib from 'rdflib';

export default class TodoListScenarioController extends Controller {
  @service store;

  @tracked taskList;

  @action
  importFromStore() {
    this.taskList = this.model;
  }

  @action
  saveToPod() {
    this.store.persist();
  }

  @action
  makeTaskList() {
    this.taskList = this.store.create('todo-list', {
      uri: 'http://mu.semte.ch/vocabularies/ext/tests/todo-list-1',
      title: 'My best todo list',
    });
  }

  @tracked serializedData;

  @action
  updateSerializedData() {
    this.serializedData = this.store.match();
  }

  @action
  addTask() {
    const todo = this.store.create('todo');
    todo.title = `${new Date()}`;
    this.taskList.todos = [...(this.taskList.todos || []), todo];
  }

  @tracked ttl;

  @action
  ttlParts() {
    const graph = rdflib.namedNode(
      'https://solid.redpencil.io/aad//private/tests/todos.ttl'
    );
    this.ttl = {
      graph: [...this.store.match(null,null,null,graph)],
      additions: [...this.store.match(null,null,null,addGraphFor(graph))],
      removals: [...this.store.match(null,null,null,delGraphFor(graph))],
    };
  }
}

const BASE_GRAPH_STRING = "http://mu.semte.ch/libraries/rdf-store";
const {namedNode} = rdflib;
/**
 * Yields the graph variant which contains triples to be added
 * @param {NamedNode} graph NamedNode of the base graph from which a new `addition` graph will be derived.
 * @returns {NamedNode} NamedNode graph containing the triples to be added to the base graph.
 */
function addGraphFor(graph) {
  const graphValue = graph.termType == 'NamedNode' ? graph.value : graph;
  const base = `${BASE_GRAPH_STRING}/graphs/add`;
  const graphQueryParam = encodeURIComponent(graphValue);
  return namedNode(`${base}?for=${graphQueryParam}`);
}

/**
 * Yields the graph variant which contains removals.
 * @param {NamedNode} graph NamedNode of the base graph from which a new `removal` graph will be derived.
 * @returns {NamedNode} NamedNode graph containing the triples to be removed from the base graph.
 */
function delGraphFor(graph) {
  const graphValue = graph.termType == 'NamedNode' ? graph.value : graph;
  const base = `${BASE_GRAPH_STRING}/graphs/del`;
  const graphQueryParam = encodeURIComponent(graphValue);
  return namedNode(`${base}?for=${graphQueryParam}`);
}
