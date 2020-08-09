import { Component, OnInit, Input } from '@angular/core'
import { ModalController } from '@ionic/angular'
import { Hospital } from 'src/app/models/hospitaldatamodel'
import * as _ from 'lodash'
import { FILTER_TYPE, FILTER_NAME, FILTER_BUTTON_TYPE, SHEET } from 'src/app/globals/app.enum'
import { FilterType, FilterData } from 'src/app/models/filterdatamodel'
import { AppGlobals } from 'src/app/globals/app.global'
import { Areas } from 'src/app/models/areamodel'
import { Area } from 'src/app/models/areadatamodel'
import { HttpErrorResponse } from '@angular/common/http'
import { AlertService } from 'src/app/provider/alert.service'
import { ApiService } from 'src/app/provider/api.service'

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
  areaArray: Area[]
  
  constructor(
    private modalController: ModalController, 
    public restProvider: ApiService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    let wards = _.uniqBy(this.hospitalList, FILTER_TYPE.WARD)
    wards.forEach(wardItem => {
      let filters: FilterData = { filterType: '', filterValue: '', area: '', isChecked: false }
      filters.filterType = FILTER_TYPE.WARD
      filters.filterValue = wardItem.ward
      let alreadyCheckedItem = _.find(this.filterData, { 'filterType': FILTER_TYPE.WARD, 'filterValue': wardItem.ward })
      if (alreadyCheckedItem) {
        filters.isChecked = true
      }
      if(wardItem.ward)
        this.filterItems.push(filters)
    })

    let serviceList = _.uniqBy(this.hospitalList, FILTER_TYPE.SERVICE)
    serviceList.forEach(serviceItem => {
      let filters: FilterData = { filterType: '', filterValue: '', area: '', isChecked: false }
      filters.filterType = FILTER_TYPE.SERVICE
      filters.filterValue = serviceItem.serviceType
      let alreadyCheckedItem = _.find(this.filterData, { 'filterType': FILTER_TYPE.SERVICE, 'filterValue': serviceItem.serviceType })
      if (alreadyCheckedItem) {
        filters.isChecked = true
      }
      if(serviceItem.serviceType)
        this.filterItems.push(filters)
    })
    this.setFilterItems(this.selectedFilter)
  }

  getAreaData() {
    this.areaArray = []
    this.restProvider
      .getData(AppGlobals.API_ENDPOINT(SHEET.AREA))
      .subscribe(
        (data: Areas) => {
          let entryArr = data.feed.entry
          for (var entry of entryArr) {
            var areaObj: Area = { serialNo: '', ward: '', area: '' }
            areaObj.serialNo = entry["gsx$sr.no."].$t
            areaObj.ward = entry.gsx$ward.$t
            areaObj.area = entry.gsx$area.$t
            this.areaArray.push(areaObj)
          }
          for (var row of this.selectedFilterItems) {
            for (var area of this.areaArray) {
              if(row.filterValue == area.ward) {
                row.area = area.area
              }
            }
          }
        },
        (err: HttpErrorResponse) => {
          this.alert.presentAlert(err.error && err.error.message ? err.error.message : err.message)
        }
      )
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
    console.log(this.filterItems)
    this.selectedFilterItems = _.filter(this.filterItems, { 'filterType': filterType })
    console.log(this.selectedFilterItems)
    this.getAreaData()
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
