import { MangolLayer } from './../../core/layer';
import { Component, OnInit, OnDestroy, Input, IterableDiffer, IterableDiffers, DoCheck, HostBinding } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MangolFeatureInfoTableElement } from './feature-info-table-element.interface';

import * as ol from 'openlayers';

@Component({
  selector: 'mangol-feature-info-table',
  templateUrl: './feature-info-table.component.html'
})
export class MangolFeatureInfoTableComponent implements OnInit, DoCheck, OnDestroy {
  @HostBinding('class') class = 'mat-feature-info-table';

  @Input() features: ol.Feature[];
  @Input() layer: MangolLayer;

  displayedColumns: string[];
  // Blacklist of columns to omit from the table
  excludeColumns: string[];
  dataSource = new MangolFeatureInfoTableDataSource();

  iterableDiffer: IterableDiffer<any>;

  constructor(private iterableDiffers: IterableDiffers) {
    this.iterableDiffer = this.iterableDiffers.find([]).create();
    this.displayedColumns = [];
    this.excludeColumns = ['geometry'];
  }

  ngOnInit() {
  }

  ngDoCheck() {
    const changes = this.iterableDiffer.diff(this.features);
    if (changes) {
      this._processFeatures();
    }
  }

  ngOnDestroy() {

  }

  getColumnLabel(column: string): string {
    let label = column;
    const attrCols = this.layer.getAttrColumns();
    for (let i = 0; i < attrCols.length; i++) {
      if (attrCols[i].name === column && attrCols[i].hasOwnProperty('label')) {
        label = attrCols[i].label;
        break;
      }
    }
    return label;
  }

  private _processFeatures() {
    data = [];
    this.displayedColumns = [];
    this.features.forEach((feat: ol.Feature) => {
      const props = { ...feat.getProperties() };
      for (const key in props) {
        if (props.hasOwnProperty(key)) {
          if (this.excludeColumns.indexOf(key) !== -1) {
            delete props[key];
          } else {
            // Populate the table columns
            if (this.displayedColumns.indexOf(key) === -1) {
              this.displayedColumns.push(key);
            }
          }
        }
      }
      data.push({ ...props } as MangolFeatureInfoTableElement);
    });
  }
}

let data: MangolFeatureInfoTableElement[] = [];

export class MangolFeatureInfoTableDataSource extends DataSource<any> {

  connect(): Observable<MangolFeatureInfoTableElement[]> {
    return Observable.of(data);
  }

  disconnect() { }

}

