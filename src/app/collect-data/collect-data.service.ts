import { Observable, forkJoin } from 'rxjs';
import { ApiService } from '../api.service';
import { AppSettings } from '../appSettings';
import {
  ProfPageData,
  CourseTableData,
  ProfessorService,
} from '../PageDataService/professor.service';

interface ProfData {
  _id: string;
  title: string;
  __v: number;
  education: string[];
  email: string;
  fistName: string;
  lastName: string;
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

export class CollectData {
  constructor(private api: ApiService, private prof: ProfessorService) {}

  private convertToPercent(value: number) {
    return value > 0 ? (value - 1) * 25 : 0;
  }

  private calculateAverage<T, K extends keyof T>(data: T[], fieldName: K) {
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

    return this.convertToPercent(average);
  }

  private groupBy(
    data: (ReviewData | DrilldownData)[],
    key: 'instructor' | 'course code'
  ): {
    [key: string]: (ReviewData | DrilldownData)[];
  } {
    const groupedData: { [key: string]: (ReviewData | DrilldownData)[] } = {};

    data.forEach((item) => {
      let itemKey: string;

      if (key === 'instructor') {
        itemKey = item.instructor || '';
      } else if (key === 'course code') {
        itemKey = item.course_code.slice(0, 8);
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
    const url = AppSettings.API_ENDPOINT + '/cache/search/reviews';

    return this.api.getFromCache(query, url);
  }

  private getDrilldownFromCache(query: string) {
    const url = AppSettings.API_ENDPOINT + '/cache/search/drilldown';

    return this.api.getFromCache(query, url);
  }

  private getProfData(id: string) {
    const url = AppSettings.API_ENDPOINT + '/cache/search/profs';

    return this.api.getSearchById(id, url);
  }

  private getCourseData(id: string) {
    const url = AppSettings.API_ENDPOINT + '/cache/search/courses';

    return this.api.getSearchById(id, url);
  }

  getProfAvgData(
    metaData: ProfData,
    revData: ReviewData[],
    drilldownData: DrilldownData[]
  ) {
    const courseSet = new Set<string>();

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
    const profsCoursesData = this.groupBy(revData, 'course code');
    const profsCoursesDdData = this.groupBy(drilldownData, 'course code');

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
      firstName: metaData.fistName,
      lastName: metaData.lastName,
      phone: metaData.phone,
      profileImage: metaData.profileImage,
      avgOverall: avgProfOverall,
      avgPrepared: avgPrepared,
      avgExplains: avgExplains,
      avgAvailable: avgAvailable,
      avgEnthusiastic: avgEnthusiastic,
    };

    // Update professor service
    this.prof.ProfPageData = pageData;
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
}
