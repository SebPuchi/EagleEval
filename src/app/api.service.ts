import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getSearchResults(query: any, url: string) {
    // Define the data you want to send in the request body (if any)
    const data = { search_query: query.query }; // Modify this as per your API's requirements

    // Send the POST request using the HttpClient's post method
    return this.http.post<any>(url, data);
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
