import { Component, OnInit, AfterViewInit , ViewChild} from '@angular/core';
import {
  GetdataService
} from '../core/services/getdata.service';
import * as Fuse from 'fuse.js'
import {
  PerfectScrollbarComponent
} from 'ngx-perfect-scrollbar';
import {
  isUndefined
} from 'util';
import COUNTRY_CODES from '../shared/utils/countries';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChild(PerfectScrollbarComponent) public directiveScroll: PerfectScrollbarComponent;
  public fuse: any;
  showMobileMenu = false;
  public sortType = "todayCases";
  
  public countryCodes = COUNTRY_CODES;
  public isLoadingCountries: boolean = true;
  public countries: any = [];
  constructor(private _getDataService: GetdataService,) { }

  ngOnInit() {
    this._getDataService.countryList.subscribe((res)=>{
      this.fuse = res;
      console.log('fuse', res);
      this.countries =this.fuse;
    });
  }

  ngAfterViewInit() {
    this._getDataService.countryList.subscribe((res)=>{
      this.fuse = res;
      console.log('fuse', res);
      this.isLoadingCountries = false;
      this.countries = this.fuse;
    });
  }
  searchCountries(key) {
    console.log('key', key);
    if (key) {
      this.countries = this.fuse.search(key);
      if (isUndefined(this.directiveScroll)) return;
      this.directiveScroll.directiveRef.scrollToTop()
      return
    }
    this.countries = this.fuse.list;
    console.log('searhc', this.countries);
  }
  sortCountries(key, skey) {
    this.isLoadingCountries = true;
    this.sortType = key;
    this.loadSorted();
  }
  
  loadSorted(){
    this._getDataService.getAll(this.sortType).subscribe((data: {}) => {
      this.countries = data;
      this.isLoadingCountries = false;
    });
  }

  
}
