// Copyright 2019 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utils service for the interaction.
 */

import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class GraphUtilsService {
  GRAPH_ADJACENCY_MODE = {
    DIRECTED: 'directed',
    INVERTED: 'inverted',
    UNDIRECTED: 'undirected'
  };

  DFS_STATUS = {
    VISITED: 'visited',
    UNVISITED: 'unvisited',
    STILL_VISITING: 'still visiting'
  };

  /**
   * @param {object} graph - A graph object.
   * @param {string} adjacencyListMode - A string indicating the mode.
   * @return {array} An adjacency list. Depending on the mode, the list has
   *   all edges (directed),
   *   all edges inverted (inverted),
   *   or all edges in both directions, as though the graph were undirected
   *   (undirected)
   */
  // TODO(#7165): Replace 'any' with the exact type. This has been typed
  // as 'any' since 'graph' is a dict with 'answer' type object which is itself
  // typed 'any'.
  constructAdjacencyLists(
      graph: any, adjacencyListMode: string): Array<number[]> {
    var adjacencyLists = [];
    for (var i = 0; i < graph.vertices.length; i++) {
      adjacencyLists.push([]);
    }

    // If a graph is undirected, all modes work the same way anyway
    if (!graph.isDirected) {
      adjacencyListMode = this.GRAPH_ADJACENCY_MODE.UNDIRECTED;
    }
    for (var i = 0; i < graph.edges.length; i++) {
      var edge = graph.edges[i];
      if (adjacencyListMode === this.GRAPH_ADJACENCY_MODE.DIRECTED ||
          adjacencyListMode === this.GRAPH_ADJACENCY_MODE.UNDIRECTED) {
        adjacencyLists[edge.src].push(edge.dst);
      }
      if (adjacencyListMode === (
        this.GRAPH_ADJACENCY_MODE.INVERTED) || adjacencyListMode === (
        this.GRAPH_ADJACENCY_MODE.UNDIRECTED)) {
        adjacencyLists[edge.dst].push(edge.src);
      }
    }
    return adjacencyLists;
  }

  /**
   * @param {integer} startVertex - The index of the starting vertex.
   * @param {array} adjacencyLists - An array of arrays.
   * @param {array} isVisited - An array with length equal to the number of
   *     vertices. All the values should be false initially.
   * This function modifies the isVisited array and changes the values at
   * the indices of the vertices reachable from the starting vertex to true.
   */
  // TODO(#7165): Replace 'any' with the exact type. This has been typed
  // as 'any' since 'isVisited' is an array with both string and boolean values;
  // a thorough check needs to be done to assure its exact type.
  markAccessible(
      startVertex: number, adjacencyLists: Array<number[]>,
      isVisited: any[]): void {
    isVisited[startVertex] = true;
    for (var i = 0; i < adjacencyLists[startVertex].length; i++) {
      var nextVertex = adjacencyLists[startVertex][i];
      if (!isVisited[nextVertex]) {
        this.markAccessible(nextVertex, adjacencyLists, isVisited);
      }
    }
  }

  // TODO(#7165): Replace 'any' with the exact type. This has been typed
  // as 'any' since 'isVisited' is an array with both string and boolean values;
  // A thorough check needs to be done to assure of its exact type.
  findCycle(
      currentVertex: number, previousVertex: number,
      adjacencyLists: Array<number[]>, isVisited: any[],
      isDirected: boolean): boolean {
    isVisited[currentVertex] = this.DFS_STATUS.STILL_VISITING;
    for (var i = 0; i < adjacencyLists[currentVertex].length; i++) {
      var nextVertex = adjacencyLists[currentVertex][i];
      if (nextVertex === previousVertex && !isDirected) {
        continue;
      }
      if (isVisited[nextVertex] === (
        this.DFS_STATUS.STILL_VISITING)) {
        return true;
      }
      if (isVisited[nextVertex] === this.DFS_STATUS.UNVISITED &&
          this.findCycle(
            nextVertex, currentVertex, adjacencyLists, isVisited,
            isDirected)) {
        return true;
      }
    }
    isVisited[currentVertex] = this.DFS_STATUS.VISITED;
    return false;
  }

  // TODO(#7165): Replace 'any' with the exact type. This has been typed
  // as 'any' since 'graph' is a dict with 'answer' type object which is itself
  // typed 'any'.
  constructAdjacencyMatrix(graph: any): Array<number[]> {
    var adjMatrix = [];
    for (var i = 0; i < graph.vertices.length; i++) {
      var adjMatrixRow = [];
      for (var j = 0; j < graph.vertices.length; j++) {
        adjMatrixRow.push(null);
      }
      adjMatrix.push(adjMatrixRow);
    }
    // TODO(#7165): Replace 'any' with the exact type. This has been typed
    // as 'any' since 'edge' is a dict with various keys. A thorough research
    // needs to be carried out to determine exact type.
    graph.edges.map((edge: any) => {
      var weight = graph.isWeighted ? edge.weight : 1;
      adjMatrix[edge.src][edge.dst] = weight;
      if (!graph.isDirected) {
        adjMatrix[edge.dst][edge.src] = weight;
      }
    });
    return adjMatrix;
  }

  nextPermutation(permutation: number[]): number | number[] {
    // Generates (in place) the next lexicographical permutation.
    // permutation is a permutation of [0, 1, 2, ..., permutation.length - 1]

    // Find the pivot to longest decreasing suffix and successor
    var pivot = null;
    var successor = null;
    permutation.reduce((
        previousValue: number, currentValue: number, currentIndex: number) => {
      if (previousValue < currentValue) {
        pivot = currentIndex - 1;
      }
      if (pivot !== null && currentValue > permutation[pivot]) {
        successor = currentIndex;
      }
      return currentValue;
    });

    if (pivot === null) {
      return null;
    }

    // Swap the pivot and successor and reverse the suffix
    var tmp = permutation[pivot];
    permutation[pivot] = permutation[successor];
    permutation[successor] = tmp;
    permutation = permutation.concat(permutation.splice(pivot + 1).reverse());
    return permutation;
  }

  areAdjacencyMatricesEqualWithPermutation(
      adj1: Array<number[]>, adj2: Array<number[]>,
      permutation: number[]): boolean {
    var numVertices = adj1.length;
    for (var i = 0; i < numVertices; i++) {
      for (var j = 0; j < numVertices; j++) {
        if (adj1[permutation[i]][permutation[j]] !== adj2[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}

angular.module('oppia').factory(
  'GraphUtilsService', downgradeInjectable(GraphUtilsService));
