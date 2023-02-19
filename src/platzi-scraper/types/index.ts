type CoursesPageData = {
  slug: string;
  title: string;
  learningPaths: {
    slug: string;
    title: string;
    description: string;
    url: string;
    badgeUrl: string;
    isSchool: boolean;
    courses: {
      slug: string;
      url: string;
    }[];
  }[];
}[];

type ProcessedCoursePageData = {
  courseSlug: string;
  courseUrl: string;
  facultyConnection: {
    connect: { slug: string };
  };
  learningPathsConnection: {
    connect: { slug: string }[];
  };
};
