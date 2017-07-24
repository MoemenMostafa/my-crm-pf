import { Component } from '@angular/core';
import { AppService } from "./app.service";
import * as _ from "lodash";

import { Dijkstra } from "./dijkstra";

import {ITrip, IDeal, IData, Duration} from "./types";


export interface IMessage{
  title: string;
  type: string;
  body: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'app';
  trip: ITrip = {
    from: "",
    to: "",
    type: "finalCost"
  };
  currency: string;
  deals: IDeal[];
  departureList: IDeal[];
  arrivalList: IDeal[];
  unVisitedSet: IDeal[];
  graph: Dijkstra;
  result: IDeal[];
  message: IMessage;
  totalCost: number;
  totalDuration: Duration;

  constructor(public appService: AppService){
    this.graph = new Dijkstra();
    this.start();
  }

  start() {
    this.appService.getData().then(
      (data: IData) => {
        this.currency = data.currency;
        this.deals = data.deals;
        this.departureList = this.getDepartureList();
        this.arrivalList = this.getArrivalList();
      }
    );
  }

  getDepartureList(): IDeal[]{
    let unSortedDepartureList = _.uniqBy(this.deals, 'departure');
    return _.sortBy(unSortedDepartureList, 'departure');
  }
  getArrivalList(): IDeal[]{
    let unSortedArrivalList = _.uniqBy(this.deals, 'arrival');
    return _.sortBy(unSortedArrivalList, 'arrival');
  }


  calculateRoute(){
    this.unVisitedSet = this.deals;
    this.buildGraph(this.trip.from,this.trip.type);
    this.result = this.graph.shortestPath(this.trip.from, this.trip.to, this.trip.type);
    this.totalCost = _.sumBy(this.result, "finalCost");
    let totalDurationMin = _.sumBy(this.result, "durationMin");
    this.totalDuration = new Duration(totalDurationMin);
  }

  buildGraph(node, type){
    let unSortedNodeSet = _.filter(this.unVisitedSet, {'departure': node});
    // ToDo: move the following to be handled by a class
    unSortedNodeSet = _.map(unSortedNodeSet, function(element) {
        return _.extend({}, element, {durationMin: parseInt(element.duration.m) +  parseInt(element.duration.h)*60,
          finalCost: element.cost * (100-element.discount)/100});
      });
    let uniqueSortedNodeSet = this.getUniqueRoutes(unSortedNodeSet, type);
    this.unVisitedSet = this.excludeVisitedNodes(this.unVisitedSet, node);
    this.addVertexToGraph(uniqueSortedNodeSet);
    // Loop trough all nodes
    uniqueSortedNodeSet.forEach(
      (route)=>{
        this.buildGraph(route.arrival,this.trip.type);
      }
    )
  }

  /**
   * Returns a unique set of routes from a node to all its neighbors
   * @param {IDeal[]} unVisitedSet  [description]
   * @param {string} type  [finalCost || durationMin]
   */
  private getUniqueRoutes(unSortedNodeSet: IDeal[], type: string){
    let sortedNodeSet = _.sortBy(unSortedNodeSet, type);
    return _.uniqBy(sortedNodeSet, 'arrival');
  }

  /**
   * Removes node from a nodelist the Vertex and Add it to the graph
   * @param {IDeal[]} unVisitedSet  [description]
   * @param {string} nodeName  [description]
   */
  private excludeVisitedNodes(unVisitedSet: IDeal[], nodeName:string){
    return _.filter(unVisitedSet, (deal)=>{
      return deal.departure !== nodeName;
    });
  }

  /**
   * Creates the Vertex and Add it to the graph
   * @param {IDeal[]} uniqueSortedNodeSet  [description]
   */
  private addVertexToGraph(uniqueSortedNodeSet: IDeal[]){
    let neighbors= [];
    let i = 0;
    uniqueSortedNodeSet.forEach(
      (route)=>{
        neighbors[route.arrival] = route;
        i++;
        if(i === uniqueSortedNodeSet.length) {
          this.graph.addVertex(route.departure, neighbors);
        }
      }
    )
  }

  search(){
    delete this.message;
    // ToDo: move this to a form validation method or use Angular 2 form validation
    if (this.trip.from == this.trip.to || this.trip.from == "" || this.trip.to == ""){
      this.message = {
        title: 'Error!',
        type: 'danger',
        body: 'You should select a different distention than departure',
      };
      if (this.trip.from == "" || this.trip.to == ""){
      }
    }else {
      this.calculateRoute();
    }

  }

  reset(){
    delete this.result;
    delete this.message;
    this.trip = {
      from: "",
      to: "",
      type: "finalCost"
    };
  }

}
