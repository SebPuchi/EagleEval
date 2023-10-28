import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { AppSettings } from '../appSettings';

export class CollectData {
  constructor(private api: ApiService) {}

  getProfData(name: string) {
    const url = AppSettings.API_ENDPOINT + '/cache/search/profs';

    this.api.getSearchResults(name, url).subscribe((result) => {});
  }
}
