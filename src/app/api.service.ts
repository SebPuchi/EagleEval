import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
	constructor(private http: HttpClient) { }


	getProfs(query: string){
	   const url = 'http:localhost3000/api/search';

       // Define the data you want to send in the request body (if any)
       const data = { search_query: query }; // Modify this as per your API's requirements

       // Send the POST request using the HttpClient's post method
       return this.http.post(url, data);

	}
}

