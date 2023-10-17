import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
	constructor(private http: HttpClient) { }
	getMessage() {
		return this.http.get(
			'http://localhost:3000/api/message');
	}


	getProfs(query: string){
	   const url = 'your_api_endpoint_here';

       // Define the data you want to send in the request body (if any)
       const data = { search_query: query }; // Modify this as per your API's requirements

       // Send the POST request using the HttpClient's post method
       return this.http.post(url, data);

	}
}
