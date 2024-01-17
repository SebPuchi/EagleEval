import { findAndUpdateDocument } from '../utils/mongoUtils';
import { School } from './directory/tree';
import ProfessorModel, { IProfessor } from '../models/professor';
import axios from 'axios';
import * as cheerio from 'cheerio';
import unidecode from 'unidecode';

export interface FacultyInfo {
  email: string;
  office: string;
  education: string[];
  photoLink: string;
}

interface FacultyJSON {
  education: string[];
  office: string;
  profileImage: {
    fileReference: string;
  };
  email: string;
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
    const firstName =
      $(element).find('h3 a').attr('data-first-name')?.trim() || '';
    const lastName =
      $(element).find('h3 a').attr('data-last-name')?.trim() || '';

    const name = unidecode(
      `${firstName} ${lastName}`.replace(/\s[A-Za-z]\./, '')
    );

    // Extract professor's link from the 'href' attribute of the anchor tag within 'h3'
    const link = $(element).find('h3 a').attr('href') || '';

    // Use the professor's name as the key in the hash map
    professors[name] = link;
  });

  // Return the hash map containing professor data
  return professors;
}

/**
 * Asynchronously searches for a school in the directory based on the provided name and URL.
 * If the school is found, returns the corresponding information.
 * If not found, extracts professors' information from the provided URL, updates the directory, and returns the information.
 *
 * @param name - The name of the school to search for.
 * @param url - The URL of the school directory.
 * @returns A Promise that resolves to the information of the school if found, or null if not found.
 */
async function searchSchoolDirectory(
  name: string,
  url: string
): Promise<string | null> {
  // Check if the directory for the given URL exists, otherwise initialize it
  const directory =
    SchoolDirectory[url] ||
    (SchoolDirectory[url] = extractProfessors(await urlToHtml(url)));

  // Return the information for the provided school name
  return directory[name] || null;
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
    const modifiedUrl = 'https://bc.edu' + url.replace(/\.html$/, '.3.json');

    const response = await axios.get(modifiedUrl);
    const json = response.data;

    return json;
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
  try {
    // Parse the JSON and extract relevant information
    const facultyInfo: FacultyJSON = jsonObject['jcr:content'];

    const details = {
      education: facultyInfo?.education,
      office: facultyInfo?.office,
      photoLink: facultyInfo?.profileImage?.fileReference,
      email: facultyInfo?.email,
    };

    return details;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
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
  try {
    const url = await searchSchoolDirectory(name, school);

    if (url) {
      const json = await urlToJson(url);

      return extractFacultyInfo(json);
    } else {
      return null;
    }
  } catch (error) {
    console.log(`Error getting prof data from website ${name} :${error}`);
    return null;
  }
}
