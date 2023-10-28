import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { AppSettings } from '../appSettings';

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
  constructor(private api: ApiService) {}

  private convertToPercent(value: number) {
    return (value - 1) * 25;
  }

  private getReviewsFromCache(query: string) {
    const url = AppSettings.API_ENDPOINT + '/cache/search/reviews';

    this.api.getFromCache(query, url).subscribe((response) => {
      const reviews = <Array<ReviewData>>response;
      return reviews;
    });
  }

  private getDrilldownFromCache(query: string) {
    const url = AppSettings.API_ENDPOINT + '/cache/search/drilldown';

    this.api.getFromCache(query, url).subscribe((response) => {
      const reviews = <Array<DrilldownData>>response;
      return reviews;
    });
  }

  private getProfData(id: string) {
    const url = AppSettings.API_ENDPOINT + '/cache/search/profs';

    this.api.getSearchById(id, url).subscribe((response) => {
      const profData = <ProfData>response;
    });
  }

  private getCourseData(id: string) {
    const url = AppSettings.API_ENDPOINT + '/cache/search/courses';

    this.api.getSearchById(id, url).subscribe((response) => {
      const crsData = <CourseData>response;
    });
  }

  getProfAvgData(name: string) {
    const revData = this.getReviewsFromCache(name);
  }
}
