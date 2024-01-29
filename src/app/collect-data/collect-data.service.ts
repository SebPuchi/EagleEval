import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { AppSettings } from '../appSettings';

import {
  ProfPageData,
  CourseTableData,
  ProfessorService,
} from '../PageDataService/professor.service';
import {
  CoursePageData,
  ProfTableData,
  ClassService,
} from '../PageDataService/class.service';

const API_ENDPOINT = AppSettings.API_ENDPOINT;

interface ProfData {
  _id: string;
  name: string;
  __v: number;
  education?: string[];
  phone?: string;
  title?: string[];
  email?: string;
  office?: string;
  photoLink?: string;
}

interface CourseData {
  _id: string;
  code: string;
  __v: number;
  college: string;
  description: string;
  subject: string;
  title: string;
}

interface ReviewData {
  _id: string;
  code: string;
  prof: string;
  semester: string;
  __v: number;
  course_id?: string;
  course_overall?: number;
  instructor_overall?: number;
  professor_id?: string;
  section: number;
}

interface DrilldownData {
  _id: string;
  __v: number;
  review_id: string;
  coursewellorganized?: number;
  courseintellectuallychallenging?: number;
  effortavghoursweekly?: number;
  attendancenecessary?: number;
  assignmentshelpful?: number;
  instructorprepared?: number;
  instructorclearexplanations?: number;
  availableforhelpoutsideofclass?: number;
  stimulatedinterestinthesubjectmatter?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CollectDataService {
  constructor(
    private api: ApiService,
    private prof: ProfessorService,
    private course: ClassService
  ) {}

  /**
   * Converts a value to a percentage based on a specific formula.
   * @param value - The numeric value to be converted.
   * @returns The converted percentage value.
   */
  private convertToPercent(value: number) {
    return value > 0 ? (value - 1) * 25 : 0;
  }

  /**
   * Calculates the average value for a specific field in an array of objects.
   * @param data - The array of objects containing the field.
   * @param fieldName - The field name for which the average is calculated.
   * @returns The calculated average value.
   */
  private calculateAverage<T, K extends keyof T>(data: T[], fieldName: K) {
    if (!data) {
      console.error('DATA undefined: ', data);
      return -1;
    }
    const filteredData = data.filter(
      (item) => typeof item[fieldName] === 'number'
    );

    if (filteredData.length === 0) {
      return -1;
    }

    const sum = filteredData.reduce(
      (acc, item) => acc + (item[fieldName] as number),
      0
    );
    const average = sum / filteredData.length;

    return Math.round(this.convertToPercent(average));
  }

  /**
   * Groups an array of objects by a specified key.
   * @param data - The array of objects to be grouped.
   * @param key - The key by which the objects are grouped.
   * @returns An object with keys as the unique values of the specified key and values as arrays of grouped objects.
   */
  private groupBy<T extends ReviewData | DrilldownData, K extends keyof T>(
    data: T[],
    key: K
  ): Record<string, T[]> {
    const groupedData: Record<string, T[]> = {};

    data.forEach((item) => {
      let itemKey: string;

      if (key === 'instructor') {
        itemKey = (item as any).instructor || '';
      } else if (key === 'course_code') {
        itemKey = (item as any).course_code.slice(0, 8);
      } else {
        itemKey = '';
      }

      if (!groupedData[itemKey]) {
        groupedData[itemKey] = [];
      }

      groupedData[itemKey].push(item);
    });

    return groupedData;
  }

  /**
   * Retrieves professor data from the API by ID.
   * @param id - The ID of the professor.
   * @returns An observable containing the professor data.
   */
  private getProfData(id: string): Observable<ProfData> {
    const url = API_ENDPOINT + 'fetch/database/prof';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrieves course data from the API by ID.
   * @param id - The ID of the course.
   * @returns An observable containing the course data.
   */
  private getCourseData(id: string): Observable<CourseData> {
    const url = API_ENDPOINT + 'fetch/database/course';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrieves reviews for a professor from the API by ID.
   * @param id - The ID of the professor.
   * @returns An observable containing the reviews for the professor.
   */
  private getReviewsForProf(id: string): Observable<ReviewData[]> {
    const url = API_ENDPOINT + 'fetch/database/review/prof';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrieves reviews for a course from the API by ID.
   * @param id - The ID of the course.
   * @returns An observable containing the reviews for the course.
   */
  private getReviewsForCourse(id: string): Observable<ReviewData[]> {
    const url = API_ENDPOINT + 'fetch/database/review/course';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrieves drilldown data from the API by ID.
   * @param id - The ID of the drilldown data.
   * @returns An observable containing the drilldown data.
   */
  private getDrilldown(id: string): Observable<DrilldownData> {
    const url = API_ENDPOINT + 'fetch/databse/drilldown';
    return this.api.getSearchById(id, url);
  }

  /**
   * Retrieves professor page data by ID, processes it, and updates the Professor Service.
   * @param id - The ID of the professor.
   */
  getProfPageData(id: string) {
    this.getReviewsForProf(id).subscribe((reviewData: ReviewData[]) => {
      const courseSet = new Set<string>();
      let tableData: CourseTableData[] = [];
      let ddData: DrilldownData[] = [];

      // Collect unique course IDs
      reviewData.forEach((review: ReviewData) => {
        if (review.course_id) {
          courseSet.add(review.course_id);
        }
      });

      // Iterate over unique course IDs and fetch course data
      courseSet.forEach((course_id: string) => {
        this.getCourseData(course_id).subscribe(
          (course_data: CourseData | null) => {
            if (course_data) {
              const avg_overall = this.calculateAverage(
                reviewData,
                'course_overall'
              );

              const new_table_entry: CourseTableData = {
                title: course_data.title,
                crs_code: course_data.code,
                school: course_data.college,
                subject: course_data.subject,
                description: course_data.description,
                course_overall: avg_overall,
              };

              tableData.push(new_table_entry);
            }
          }
        );
      });

      // Set course table data in prof service
      this.prof.setcrsTableData(tableData);

      // Iterate over reviews to get drilldown data
      reviewData.forEach((review: ReviewData) => {
        const review_id: string = review._id;

        this.getDrilldown(review_id).subscribe(
          (dd_data: DrilldownData | null) => {
            if (dd_data) {
              ddData.push(dd_data);
            }
          }
        );
      });

      // Fill prof page data
      this.getProfData(id).subscribe((prof_data: ProfData) => {
        const avg_overall = this.calculateAverage(
          reviewData,
          'instructor_overall'
        );
        const avg_prepared = this.calculateAverage(
          ddData,
          'instructorprepared'
        );
        const avg_explains = this.calculateAverage(
          ddData,
          'instructorclearexplanations'
        );
        const avg_available = this.calculateAverage(
          ddData,
          'availableforhelpoutsideofclass'
        );
        const avg_enthusiastic = this.calculateAverage(
          ddData,
          'stimulatedinterestinthesubjectmatter'
        );

        const new_prof_page_data: ProfPageData = {
          name: prof_data.name,
          education: prof_data.education,
          email: prof_data.email,
          office: prof_data.office,
          profileImage: prof_data.photoLink,
          avgOverall: avg_overall,
          avgPrepared: avg_prepared,
          avgExplains: avg_explains,
          avgAvailable: avg_available,
          avgEnthusiastic: avg_enthusiastic,
        };

        this.prof.setProfPageData(new_prof_page_data);
      });
    });
  }
}

/*
  private getProfAvgData(
    metaData: ProfData,
    revData: ReviewData[],
    drilldownData: DrilldownData[]
  ) {
    const courseSet = new Set<string>();

    let tableData: CourseTableData[] = [];

    // Create a set of all the courses the prof teaches
    revData.forEach((course) => {
      const courseCode = course.course_code;
      const match = courseCode.match(/([A-Za-z]{4})(\d{4})/);

      if (match) {
        const courseName = match[1] + match[2];
        courseSet.add(courseName);
      }
    });
    // Data for table
    const profsCoursesData = this.groupBy(revData, 'course_code');
    const profsCoursesDdData = this.groupBy(drilldownData, 'course_code');

    // Loop through courses set and get table averages
    for (let course of courseSet) {
      const currCourseData = profsCoursesData[course];
      const currCourseDdData = profsCoursesDdData[course];

      const courseCode = course;
      const avgCourseOverall = this.calculateAverage(
        currCourseData,
        'course_overall'
      );
      const avgEffortHours = this.calculateAverage(
        currCourseDdData,
        'effortavghoursweeklyc'
      );

      const currTableRowData: CourseTableData = {
        title: currCourseData[0].course_name,
        crs_code: courseCode,
        course_overall: avgCourseOverall,
        effort_hours: avgEffortHours >= 0 ? avgEffortHours / 10 : -1,
      };

      tableData.push(currTableRowData);
    }
    // Sort by course overall score
    tableData = tableData.sort((a, b) => b.course_overall - a.course_overall);

    // Prof data points
    const avgProfOverall = this.calculateAverage(revData, 'instructor_overall');

    const avgPrepared = this.calculateAverage(
      drilldownData,
      'instructorprepared'
    );
    const avgExplains = this.calculateAverage(
      drilldownData,
      'instructorclearexplanations'
    );
    const avgAvailable = this.calculateAverage(
      drilldownData,
      'availableforhelpoutsideofclass'
    );
    const avgEnthusiastic = this.calculateAverage(
      drilldownData,
      'stimulatedinterestinthesubjectmatter'
    );

    // Create inteface obj with data
    const pageData: ProfPageData = {
      title: metaData.title,
      education: metaData.education,
      email: metaData.email,
      firstName: metaData.firstName,
      lastName: metaData.lastName,
      phone: metaData.phone,
      office: metaData.office,
      profileImage: metaData.profileImage,
      avgOverall: avgProfOverall,
      avgPrepared: avgPrepared,
      avgExplains: avgExplains,
      avgAvailable: avgAvailable,
      avgEnthusiastic: avgEnthusiastic,
    };
    // Update professor service
    this.prof.setProfPageData(pageData);
    this.prof.setcrsTableData(tableData);
  }

  private getCourseAvgData(
    metaData: CourseData,
    revData: ReviewData[],
    drilldownData: DrilldownData[]
  ) {
    const profSet = new Set<string>();

    let tableData: ProfTableData[] = [];

    // Create a set of all the courses the prof teaches
    revData.forEach((course) => {
      const prof = course.instructor;

      profSet.add(prof);
    });
    // Data for table
    const coursesProfData = this.groupBy(revData, 'instructor');
    const coursesProfDdData = this.groupBy(drilldownData, 'instructor');

    // Loop through professor set and get table averages
    for (let prof of profSet) {
      const currProfData = coursesProfData[prof];
      const currProfDdData = coursesProfDdData[prof];

      const profName = prof;
      const avgProfOverall = this.calculateAverage(
        currProfData,
        'instructor_overall'
      );
      const avgExplains = this.calculateAverage(
        currProfDdData,
        'instructorclearexplanations'
      );

      const currTableRowData: ProfTableData = {
        title: profName,
        prof_overall: avgProfOverall,
        explains_material: avgExplains,
      };

      tableData.push(currTableRowData);
    }
    // Sort by course overall score
    tableData = tableData.sort((a, b) => b.prof_overall - a.prof_overall);

    // Prof data points
    const avgCourseOverall = this.calculateAverage(revData, 'course_overall');

    const avgWellOrgnaized = this.calculateAverage(
      drilldownData,
      'coursewellorganized'
    );

    const avgChallenging = this.calculateAverage(
      drilldownData,
      'courseintellectuallychallenging'
    );

    const avgHours = this.calculateAverage(
      drilldownData,
      'effortavghoursweeklyc'
    );

    const avgAttendance = this.calculateAverage(
      drilldownData,
      'attendancenecessary'
    );

    const avgAssignments = this.calculateAverage(
      drilldownData,
      'assignmentshelpful'
    );

    const pageData: CoursePageData = {
      title: metaData.title,
      crs_code: metaData.crs_code,
      subject: metaData.subject,
      college: metaData.college,
      desc: metaData.crs_desc,
      avgOverall: avgCourseOverall,
      avgOriganized: avgWellOrgnaized,
      avgChallanging: avgChallenging,
      avgEffortHours: avgHours >= 0 ? avgHours / 10 : -1,
      avgAttendance: avgAttendance,
      avgAssignments: avgAssignments,
    };

    // Update professor service
    this.course.setCoursePageData(pageData);
    this.course.setprofTableData(tableData);
  }

  getAPIProfData(id: string) {
    this.getProfData(id).subscribe((metaData: ProfData) => {
      const name = metaData.title;

      this.getReviewsFromAPI(name).subscribe((reviews: ReviewData[]) => {
        const ddObervables: Observable<DrilldownData>[] = [];
        for (const review of reviews) {
          ddObervables.push(
            this.getDrilldownFromAPI(review.course_code, review.instructor)
          );
        }
        forkJoin(ddObervables).subscribe((drilldownData: DrilldownData[]) => {
          this.getProfAvgData(metaData, reviews, drilldownData);
        });
      });
    });
  }

  getCacheProfData(id: string) {
    this.getProfData(id).subscribe((metaData: ProfData) => {
      const name = metaData.title;

      // Join obsevables
      forkJoin([
        this.getReviewsFromCache(name),
        this.getDrilldownFromCache(name),
      ]).subscribe(([revData, drilldownData]) => {
        this.getProfAvgData(metaData, revData, drilldownData);
      });
    });
  }

  getAPICourseData(id: string) {
    this.getCourseData(id).subscribe((metaData: CourseData) => {
      const name = metaData.crs_code;

      this.getReviewsFromAPI(name).subscribe((reviews: ReviewData[]) => {
        const ddObervables: Observable<DrilldownData>[] = [];
        for (const review of reviews) {
          ddObervables.push(
            this.getDrilldownFromAPI(review.course_code, review.instructor)
          );
        }
        forkJoin(ddObervables).subscribe((drilldownData: DrilldownData[]) => {
          this.getCourseAvgData(metaData, reviews, drilldownData);
        });
      });
    });
  }

  getCacheCourseData(id: string) {
    this.getCourseData(id).subscribe((metaData: CourseData) => {
      const name = metaData.crs_code;

      // Join obsevables
      forkJoin([
        this.getReviewsFromCache(name),
        this.getDrilldownFromCache(name),
      ]).subscribe(([revData, drilldownData]) => {
        this.getCourseAvgData(metaData, revData, drilldownData);
      });
    });
  }
*/
