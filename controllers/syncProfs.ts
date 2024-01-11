import { findAndUpdateDocument } from '../utils/mongoUtils';
import { School } from './directory/tree';
import ProfessorModel, { IProfessor } from '../models/professor';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

// Directory pages html
// MCAS - https://www.bc.edu/content/bc-web/schools/morrissey/faculty/mcas-directory/jcr:content/facultyList/faculty-list.items.html
// CSOM - https://www.bc.edu/content/bc-web/schools/carroll-school/faculty-research/faculty-expertise/jcr:content/facultyList/faculty-list.items.html
// SSW - https://www.bc.edu/content/bc-web/schools/ssw/faculty/faculty-expertise/jcr:content/facultyList/faculty-list.items.html
// CSON - https://www.bc.edu/content/bc-web/schools/cson/faculty-research/faculty-directory/jcr:content/facultyList/faculty-list.items.html
// Lynch - https://www.bc.edu/content/bc-web/schools/lynch-school/faculty-research/faculty-directory-expertise/jcr:content/facultyList/faculty-list.items.html
// WCAS - https://www.bc.edu/content/bc-web/schools/wcas/faculty-research/faculty-directory/jcr:content/facultyList/faculty-list.items.html

export interface FacultyInfo {
  email: string;
  address: string;
  education: string[];
  photoLink: string;
}

const SchoolDirectory: Record<string, Record<string, string>> = {};

/**
 * Updates a professor's information in the database.
 * @param prof - The professor object with updated information.
 * @returns A Promise that resolves to void.
 */
export async function updateProf(prof: IProfessor): Promise<void> {
  const filter = {
    name: prof.name,
  };

  const newProf = await findAndUpdateDocument(ProfessorModel, filter, prof);

  if (newProf) {
    console.log('Updating data for: ', prof.name);
  }
  try {
    // Additional logic can be added here if needed.
  } catch (error) {
    console.log('Error updating professor doc: ', error);
  }
}

/**
 * Extracts professor data from an HTML page and returns a hash map of names to data.
 * @param html - The HTML content containing professor information.
 * @returns A hash map where keys are professor names and values are corresponding data objects.
 */
function extractProfessors(html: string): Record<string, string> {
  // Initialize an empty hash map to store professor data
  const professors: Record<string, string> = {};

  // Use Cheerio to load the HTML content
  const $ = cheerio.load(html);

  // Iterate over each element with class 'person-list-expertise'
  $('.person-list-expertise').each((index, element) => {
    // Extract professor's name from the anchor tag within 'h3'
    const name = $(element).find('h3 a').text().trim();

    // Extract professor's link from the 'href' attribute of the anchor tag within 'h3'
    const link = $(element).find('h3 a').attr('href') || '';

    // Use the professor's name as the key in the hash map
    professors[name] = link;
  });

  // Return the hash map containing professor data
  return professors;
}

async function searchSchoolDirectory(
  name: string,
  url: string
): Promise<string | null> {
  const directory =
    SchoolDirectory[url] || extractProfessors(await urlToHtml(url));

  return directory[name];
}

/**
 * Fetches HTML content from the specified URL using Axios.
 * @param url - The URL to fetch HTML content from.
 * @returns Promise containing the HTML content.
 */
async function urlToHtml(url: string): Promise<string> {
  try {
    // Make a GET request using Axios
    const response = await axios.get(url);

    // Return the HTML content from the response
    return response.data;
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching HTML:', error);
    throw error;
  }
}

/**
 * Converts a professor's HTML page to JSON format.
 * @param url - The URL of the professor's HTML page.
 * @returns A Promise that resolves to the JSON representation of the professor's page or null if an error occurs.
 */
async function urlToJson(url: string): Promise<any | null> {
  try {
    const modifiedUrl = url.replace(/\.html$/, '.3.json');

    const response = await axios.get(modifiedUrl);
    const html = response.data;
    return html;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

/**
 * Extracts relevant information from a JSON object representing a professor's page.
 * @param jsonObject - The JSON object representing the professor's page.
 * @returns An object containing the professor's address, education, and photo link, or null if the information is not available.
 */
function extractFacultyInfo(jsonObject: any): FacultyInfo | null {
  const prof: FacultyInfo = {
    email: '',
    address: '',
    education: [],
    photoLink: '',
  };
  if (!jsonObject || !jsonObject.jcr || !jsonObject.jcr.content) {
    return null;
  }

  const content = jsonObject.jcr.content;

  prof.email = content.email || undefined;
  prof.photoLink =
    content.profileImage?.fileReference ||
    'https://bc.edu/content/dam/bc1/schools/mcas/Faculty%20Directory/no-profile-image_335x400px.jpg';
  prof.address = content.office || undefined;
  prof.education = content.education || undefined;

  return prof;
}

/**
 * Retrieves information about a professor from the BC website using Google CSE and converts the page to JSON.
 * @param name - The name of the professor.
 * @param school - The url of the school directory.
 * @returns A Promise that resolves to an object containing the professor's address, education, and photo link, or null if the information is not available.
 */
export async function getProfDataFromBCWebsite(
  name: string,
  school: School
): Promise<FacultyInfo | null> {
  const url = await searchSchoolDirectory(name, school);

  if (url) {
    const json = await urlToJson(url);

    return extractFacultyInfo(json);
  } else {
    return null;
  }
}
