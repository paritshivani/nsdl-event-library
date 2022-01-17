// import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewEncapsulation,
  OnChanges
} from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'sb-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class EventFilterComponent implements OnInit, OnChanges {

  @Input() filterValues: any;
  @Input() filterLayout: any;
  @Input() filterOpenStatus: boolean;
  @Input() isOpen;
  @Input() filterConfig: any;
  @Output() filterChangeEvent = new EventEmitter();
  @Output() filterSearchData: EventEmitter<any> = new EventEmitter();

  public searchFilterFormConfig: any;
  // @Input() filterConfig: any;
  // @Input() filterConfigv1: any;
  public isFilterShow = false;
  public filterFields: any;
  public currentFilters: any;
  public searchQuery: string;
  public filterSelectedValues = [];
  newLayout: any = 'horizontal-view';

  constructor( /*public translate: TranslateService*/) {
  }

  ngOnChanges() {
    this.isFilterShow = this.filterOpenStatus;

    if (this.filterLayout == true) {
      this.newLayout = 'vertical-view';
    }
  }

  ngOnInit(): void {
    this.filterFields = this.filterConfig;
    this.checkForWindowSize();
  }

  initializeForm() { }

  showfilter() {
    this.isFilterShow = !this.isFilterShow;
    this.filterChangeEvent.emit({
      action: 'filterStatusChange',
      filterStatus: this.isFilterShow
    });
  }

  resetFilter() {
    this.filterSelectedValues=[];
    // this.searchQuery = '';
    this.filterConfig=_.cloneDeep(this.filterFields);
    this.emitApplyFilter();
  }

  applyFilter() {
    this.emitApplyFilter();
  }

  emitApplyFilter() {
    this.filterChangeEvent.emit({
      action: 'filterDataChange',
      filter: this.filterValues,
      filtersSelected: this.filterSelectedValues,
      query: this.searchQuery
    });
  }

  outputData($event) { }

  onStatusChanges($event) { }

  valueChanges($event) {
    this.filterSelectedValues  = $event;
    this.emitApplyFilter();
  }

  onQueryEnter($event){
    $event.search = true;
    this.filterChangeEvent.emit($event);
  }

  applySorting($event){
    
  }
  private checkForWindowSize() {
    if (window.innerWidth <= 992) {
     this.isOpen = false;
    }
    else {
      this.isOpen = true;
    }

  }
}
