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
    unSortedNodeSet = _.map(unSortedNodeSet, function(element) {
        return _.extend({}, element, {durationMin: parseInt(element.duration.m) +  parseInt(element.duration.h)*60,
          finalCost: element.cost * (100-element.discount)/100});
      });
    let sortedNodeSet = _.sortBy(unSortedNodeSet, type);
    let uniqueSortedNodeSet = _.uniqBy(sortedNodeSet, 'arrival');
    this.unVisitedSet = _.filter(this.unVisitedSet, (deal)=>{
      return deal.departure !== node;
    });
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
    uniqueSortedNodeSet.forEach(
      (route)=>{
        this.buildGraph(route.arrival,this.trip.type)
      }
    )
  }

  search(){
    delete this.message;
    console.log("form submitted..");
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
