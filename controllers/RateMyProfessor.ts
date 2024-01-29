import { GraphQLClient } from 'graphql-request';
import {
  autocompleteSchoolQuery,
  searchTeacherQuery,
  getTeacherQuery,
} from './queries';

// Authentication token for API access
const AUTH_TOKEN = 'dGVzdDp0ZXN0';

// GraphQL client configuration
const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
  headers: {
    authorization: `Basic ${AUTH_TOKEN}`,
    'Access-Control-Allow-Origin': '*',
  },
});

// Interface representing school information from a search
export interface ISchoolFromSearch {
  id: string;
  name: string;
  city: string;
  state: string;
}

// Interface representing teacher information from a search
export interface ITeacherFromSearch {
  id: string;
  firstName: string;
  lastName: string;
  school: {
    id: string;
    name: string;
  };
}

// Interface representing a query for department information
export interface DepartmentQuery {
  query: {
    text: string;
    schoolID: string;
    fallback: boolean;
    departmentID: string;
  };
  schoolID: string;
}

/**
 * Searches for schools based on a given query string.
 * @param query - The query string for school search.
 * @returns A promise that resolves to an array of ISchoolFromSearch.
 */
const searchSchool = async (query: string): Promise<ISchoolFromSearch[]> => {
  const response: any = await client.request(autocompleteSchoolQuery, {
    query,
  });

  return response.autocomplete.schools.edges.map(
    (edge: { node: ISchoolFromSearch }) => edge.node
  );
};

/**
 * Searches for teachers based on a given name and school ID.
 * @param name - The name of the teacher to search for.
 * @param schoolID - The ID of the school to narrow down the search.
 * @returns A promise that resolves to an array of ITeacherFromSearch.
 */
const searchTeacher = async (
  name: string,
  schoolID: string
): Promise<ITeacherFromSearch[]> => {
  const response: any = await client.request(searchTeacherQuery, {
    text: name,
    schoolID,
  });

  if (response.newSearch.teachers === null) {
    return [];
  }

  return response.newSearch.teachers.edges.map(
    (edge: { node: ITeacherFromSearch }) => edge.node
  );
};

/**
 * Retrieves detailed information about a teacher based on their ID.
 * @param id - The ID of the teacher to retrieve information for.
 * @returns A promise that resolves to detailed information about the teacher.
 */
const getTeacher = async (id: string): Promise<any> => {
  const response: any = await client.request(getTeacherQuery, { id });
  return response.node;
};

// Exporting the functions as a single module
export default {
  searchSchool,
  searchTeacher,
  getTeacher,
};
