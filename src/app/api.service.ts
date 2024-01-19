import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getSearchResults(query: any, url: string) {
    // Add safe, URL encoded search parameter if there is a search term
    const options = query
      ? { params: new HttpParams().set('name', query.query) }
      : {};

    // Send the POST request using the HttpClient's post method
    return this.http.get<any>(url, options);
  }

  getSearchById(id: string, url: string) {
    const query = { id: id };

    return this.http.post<any>(url, query);
  }

  getFromCache(query: any, url: string) {
    const data = { search_query: query };

    // Send the POST request using the HttpClient's post method
    return this.http.post<any>(url, data);
  }

  getReviewsFromAPI(query: any, url: string) {
    const data = { fetch_query: query };

    // Send the POST request using the HttpClient's post method
    return this.http.post<any>(url, data);
  }

  getDrilldownFromAPI(prof: string, code: string, url: string) {
    const data = { code: code, prof: prof };

    // Send the POST request using the HttpClient's post method
    return this.http.post<any>(url, data);
  }
}
