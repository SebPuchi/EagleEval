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

interface ProfData {
  _id: string;
  title: string;
  __v: number;
  education: string[];
  email: string;
  firstName: string;
  lastName: string;
  office: string;
  phone: string;
  profileImage: string;
}

interface CourseData {
  _id: string;
  crs_code: string;
  __v: number;
  college: string;
  crs_desc: string;
  subject: string;
  title: string;
}

interface ReviewData {
  _id: string;
  course_code: string;
  semester: string;
  __v: number;
  course_name: string;
  course_overall?: number;
  department: string;
  instructor: string;
  instructor_overall?: string;
  school: string;
}

interface DrilldownData {
  _id: string;
  __v: number;
  course_code: string;
  course_name: string;
  instructor: string;
  semester: string;
  coursewellorganized?: number;
  courseintellectuallychallenging?: number;
  effortavghoursweeklyc?: number;
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

  private convertToPercent(value: number) {
    return value > 0 ? (value - 1) * 25 : 0;
  }

  private calculateAverage<T, K extends keyof T>(data: T[], fieldName: K) {
    if (!data) {
      console.error('DATA undefined: ', data);
      return -1;
    }
    const filteredData = data.filter(
      (item) => typeof item[fieldName] === 'number'
    );

    if (filteredData.length === 0) {
      return -1; // Return -1 for an empty or entirely undefined array or handle it differently based on your requirements.
    }

    const sum = filteredData.reduce(
      (acc, item) => acc + (item[fieldName] as number),
      0
    );
    const average = sum / filteredData.length;

    return Math.round(this.convertToPercent(average));
  }

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

  private getReviewsFromCache(query: string) {
    const url = AppSettings.API_ENDPOINT + 'cache/search/reviews';

    return this.api.getFromCache(query, url);
  }

  private getDrilldownFromCache(query: string) {
    const url = AppSettings.API_ENDPOINT + 'cache/search/drilldown';

    return this.api.getFromCache(query, url);
  }

  private getReviewsFromAPI(query: string) {
    const url = AppSettings.API_ENDPOINT + 'fetch/reviews';

    return this.api.getReviewsFromAPI(query, url);
  }

  private getDrilldownFromAPI(code: string, prof: string) {
    const url = AppSettings.API_ENDPOINT + 'fetch/drilldown';

    return this.api.getDrilldownFromAPI(prof, code, url);
  }

  private getProfData(id: string) {
    const url = AppSettings.API_ENDPOINT + 'cache/search/profs';

    return this.api.getSearchById(id, url);
  }

  private getCourseData(id: string) {
    const url = AppSettings.API_ENDPOINT + 'cache/search/courses';

    return this.api.getSearchById(id, url);
  }

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
}
