import { Component,  NgZone, OnInit, } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { GetdataService } from "./core/services/getdata.service";
import { combineLatest } from 'rxjs';
import * as Fuse from 'fuse.js'

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit{
  public sortType = "todayCases";
  public fuse: any;
  public countries: any = [];
  constructor(public translate: TranslateService, private zone: NgZone, private _getDataService: GetdataService) {
    translate.addLangs(["en", "fr", "de", "tr","es"]);
    translate.setDefaultLang("en");
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|de|tr|fr|es/) ? browserLang : "en");
  }
  async ngOnInit(){
    this.zone.runOutsideAngular(async () => {
      combineLatest(
        this._getDataService.getAll(this.sortType),
        this._getDataService.getTimelineGlobal()
      )
        .subscribe(([getAllData, getTimelineData]) => {
          this.countries = getAllData;
          this.fuse = new Fuse( this.countries, {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            minMatchCharLength: 1,
            keys: [
              "country"
            ]
          });
          this.zone.run(()=>{
            this._getDataService.countryList.next(this.fuse.list);
          });
        // this._getDataService.zone.next(this.zone);
        });
    });
  }
}
