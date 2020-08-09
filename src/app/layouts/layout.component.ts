import { Component, OnInit, AfterViewInit , ViewChild, AfterContentInit, AfterContentChecked, OnChanges} from '@angular/core';
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
import { trim } from '@amcharts/amcharts4/.internal/core/utils/Utils';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterContentChecked {
  @ViewChild(PerfectScrollbarComponent) public directiveScroll: PerfectScrollbarComponent;
  public fuse: any;
  showMobileMenu = false;
  public sortType = "todayCases";
  public countryCodes = COUNTRY_CODES;
  public total_cases = 0;
  public isLoadingCountries: boolean = true;
  public countries: any = [];
  public temp_countries: any = [];
  constructor(private _getDataService: GetdataService,) { }

  ngOnInit() {
    this._getDataService.countryList.subscribe((res)=>{
      console.log(res);
      if(res){
        this.countries = res;
        res.forEach((e:any) => {
          this.total_cases += e.cases;
        });
        this.sortCountries("cases","");
      }
    });
  }

  ngAfterContentChecked() {

  }
  searchCountries(key) {
    if(trim(key)){
      this.countries = this.temp_countries.filter( obj => {
          return (obj.country.toLowerCase().indexOf(key.toLowerCase()) > -1) ? true : false;
      });
    } else {
      this.countries = this.temp_countries;
    }
  }
  sortCountries(key, skey) {
    this.isLoadingCountries = true;
    this.sortType = key;
    this.loadSorted();
  }
  
  loadSorted() {
    this._getDataService.getAll(this.sortType).subscribe((data: {}) => {
      this.countries = data;
      //console.log("getAll =>", data);
      this.temp_countries = data;
      this.isLoadingCountries = false;
    });
  }

  
}
