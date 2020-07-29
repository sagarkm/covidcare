import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Hospital } from 'src/app/models/hospitaldatamodel';
import * as _ from 'lodash';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit {
  @Input() hospitalList: Hospital[];
  @Input() filterData: [];

  filterTypes = [
    {
      id: 'ward',
      name: 'Ward'
    }, {
      id: 'service',
      name: 'Service Type'
    }];
  selectedFilter = 'ward';
  selectedFilterItems = [];
  filterItems = [];
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    let wards = _.uniqBy(this.hospitalList, 'ward');

    wards.forEach(wardItem => {
      let filters = {
        filterType: '',
        filterValue: '',
        isChecked: false
      };
      filters.filterType = 'ward';
      filters.filterValue = wardItem.ward;
      let alreadyCheckedItem = _.find(this.filterData, { 'filterType': 'ward', 'filterValue': wardItem.ward });
      if (alreadyCheckedItem) {
        filters.isChecked = true;
      }
      this.filterItems.push(filters);
    });

    let serviceList = _.uniqBy(this.hospitalList, 'service');

    serviceList.forEach(serviceItem => {
      let filters = {
        filterType: '',
        filterValue: '',
        isChecked: false
      };
      filters.filterType = 'service';
      filters.filterValue = serviceItem.service;
      let alreadyCheckedItem = _.find(this.filterData, { 'filterType': 'service', 'filterValue': serviceItem.service });
      if (alreadyCheckedItem) {
        filters.isChecked = true;
      }
      this.filterItems.push(filters);
    });
    this.setFilterItems(this.selectedFilter);
  }

  clearClicked() {
    this.filterItems.forEach(items => {
      if (items.isChecked) {
        items.isChecked = false;
      }
    });
  }

  setFilterItems(filterType: string) {
    this.selectedFilter = filterType;
    this.selectedFilterItems = _.filter(this.filterItems, { 'filterType': filterType });
  }

  segmentChanged = (segmentData) => {
    if (segmentData.target.value === 'apply') {
      // console.log('selectedFilterItems = ', this.filterItems);
      let filterData = _.filter(this.filterItems, { 'isChecked': true })
      this.modalController.dismiss({
        'filterData': filterData
      });
    } else {
      this.modalController.dismiss();
    }
  }
}
