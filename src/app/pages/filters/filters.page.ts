import { Component, OnInit, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { Hospital } from 'src/app/models/hospitaldatamodel'
import * as _ from 'lodash'
import { FILTER_TYPE, FILTER_NAME, FILTER_BUTTON_TYPE } from 'src/app/globals/app.enum'
import { FilterType, FilterData } from 'src/app/models/filterdatamodel'

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
})
export class FiltersPage implements OnInit {
  @Input() hospitalList: Hospital[]
  @Input() filterData: FilterData[]

  filterTypes: FilterType[] = [
    {
      id: FILTER_TYPE.WARD,
      name: FILTER_NAME.WARD
    }, {
      id: FILTER_TYPE.SERVICE,
      name: FILTER_NAME.SERVICE
    }
  ]
  selectedFilter: string = FILTER_TYPE.WARD
  selectedFilterItems: FilterData[] = []
  filterItems: FilterData[] = []
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    let wards = _.uniqBy(this.hospitalList, FILTER_TYPE.WARD)
    wards.forEach(wardItem => {
      let filters: FilterData = {
        filterType: '',
        filterValue: '',
        isChecked: false
      }
      filters.filterType = FILTER_TYPE.WARD
      filters.filterValue = wardItem.ward
      let alreadyCheckedItem = _.find(this.filterData, { 'filterType': FILTER_TYPE.WARD, 'filterValue': wardItem.ward })
      if (alreadyCheckedItem) {
        filters.isChecked = true
      }
      this.filterItems.push(filters)
    })

    let serviceList = _.uniqBy(this.hospitalList, FILTER_TYPE.SERVICE)
    serviceList.forEach(serviceItem => {
      let filters: FilterData = {
        filterType: '',
        filterValue: '',
        isChecked: false
      }
      filters.filterType = FILTER_TYPE.SERVICE
      filters.filterValue = serviceItem.serviceType
      let alreadyCheckedItem = _.find(this.filterData, { 'filterType': FILTER_TYPE.SERVICE, 'filterValue': serviceItem.serviceType })
      if (alreadyCheckedItem) {
        filters.isChecked = true
      }
      this.filterItems.push(filters)
    })
    this.setFilterItems(this.selectedFilter)
  }

  clearClicked() {
    this.filterItems.forEach(items => {
      if (items.isChecked) {
        items.isChecked = false
      }
    })
  }

  setFilterItems(filterType: string) {
    this.selectedFilter = filterType
    this.selectedFilterItems = _.filter(this.filterItems, { 'filterType': filterType })
  }

  segmentChanged = (segmentData) => {
    if (segmentData.target.value === FILTER_BUTTON_TYPE.APPLY) {
      let filterData = _.filter(this.filterItems, { 'isChecked': true })
      this.modalController.dismiss({
        'filterData': filterData
      })
    } else {
      this.modalController.dismiss()
    }
  }
}
