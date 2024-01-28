import { GraphQLClient } from 'graphql-request';
import {
  autocompleteSchoolQuery,
  searchTeacherQuery,
  getTeacherQuery,
} from './queries';

const AUTH_TOKEN = 'dGVzdDp0ZXN0';

const client = new GraphQLClient('https://www.ratemyprofessors.com/graphql', {
  headers: {
    authorization: `Basic ${AUTH_TOKEN}`,
    'Access-Control-Allow-Origin': '*',
  },
});

export interface ISchoolFromSearch {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface ITeacherFromSearch {
  id: string;
  firstName: string;
  lastName: string;
  school: {
    id: string;
    name: string;
  };
}

export interface DepartmentQuery {
  query: {
    text: string;
    schoolID: string;
    fallback: boolean;
    departmentID: string;
  };
  schoolID: string;
}

const searchSchool = async (query: string): Promise<ISchoolFromSearch[]> => {
  const response: any = await client.request(autocompleteSchoolQuery, {
    query,
  });

  return response.autocomplete.schools.edges.map(
    (edge: { node: ISchoolFromSearch }) => edge.node
  );
};

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

const getTeacher = async (id: string): Promise<any> => {
  const response: any = await client.request(getTeacherQuery, { id });
  return response.node;
};

export default {
  searchSchool,
  searchTeacher,
  getTeacher,
};
