import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getSearchResults(query: string, url: string) {
    // Add safe, URL encoded search parameter if there is a search term
    const options = query
      ? { params: new HttpParams().set('name', query) }
      : {};

    // Send the POST request using the HttpClient's post method
    return this.http.get<any>(url, options);
  }

  getSearchById(id: string, url: string) {
    const options = id ? { params: new HttpParams().set('id', id) } : {};

    return this.http.get<any>(url, options);
  }
}
