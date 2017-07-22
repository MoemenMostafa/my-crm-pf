/**
 * A node for priority linked list / stack and such
 */
class PriorityNode {
  key:number;
  priority:number;

  constructor(key: number,priority: number){
    this.key = key;
    this.priority = priority;
  }
}

/**
 * A priority queue with highest priority always on top
 * This queue is sorted by priority for each enqueue
 */
class PriorityQueue {

  nodes:PriorityNode[] = [];

  /**
   * Enqueue a new node
   * @param {[type]} priority
   * @param {[type]} key
   */
  enqueue(priority:number, key:number){
    this.nodes.push(new PriorityNode(key, priority));
    this.nodes.sort(
      function(a, b) {
        return a.priority - b.priority;
      }
    )
  }

  /**
   * Dequeue the highest priority key
   */
  dequeue():number{
    return this.nodes.shift().key;
  }

  /**
   * Checks if empty
   */
  empty():boolean{
    return !this.nodes.length;
  }
}

/**
 * Computes the shortest path between two node
 */
export class Dijkstra{

  infinity = 1/0;
  vertices = {};

  /**
   * Add a new vertex and related edges
   * @param {[type]} name  [description]
   * @param {[type]} neighbours [description]
   */
  addVertex(name:string, neighbours:any){
    this.vertices[name] = neighbours;
  }

  /**
   * Computes the shortest path from start to finish
   * @param {[type]} start  [description]
   * @param {[type]} finish [description]
   */
  shortestPath(start:string, finish:string, type:any){

    let nodes = new PriorityQueue(),
      value = {},
      previous = {},
      path = [],
      smallest,
      vertex,
      neighbor,
      alt;

    //Init the value and queues variables
    for(vertex in this.vertices){
      if(vertex === start){
        value[vertex] = 0;
        nodes.enqueue(0, vertex);
      }else{
        value[vertex] = this.infinity;
        nodes.enqueue(this.infinity, vertex);
      }

      previous[vertex] = null;
    }

    //continue as long as the queue hasn't been emptied.

    while(!nodes.empty()){


      smallest = nodes.dequeue();

      //we are the last node
      if(smallest === finish){

        //Compute the path
        while(previous[smallest]){
          path.push(this.vertices[previous[smallest]][smallest]);
          smallest = previous[smallest];
        }
        break;
      }

      //No price/duration known. Skip.
      if(!smallest || value[smallest] === this.infinity){
        continue;
      }


      //Compute the price/duration for each neighbor
      for(neighbor in this.vertices[smallest]){
        alt = value[smallest] + this.vertices[smallest][neighbor][type];


        if(alt < value[neighbor]){
          value[neighbor] = alt;
          previous[neighbor] = smallest;
          nodes.enqueue(alt, neighbor);
        }
      }
    }
    //the starting point isn't in the solution &
    //the solution is from end to start.
    return path.reverse();
  }
}
