export type PDF = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
};

export type Subject = {
  id: string;
  name: string;
  pdfs: PDF[];
};

export type Semester = {
  id: string;
  name: string;
  subjects: Subject[];
};

export const semesters: Semester[] = [
  {
    id: "sem1",
    name: "Semester 1",
    subjects: [
      {
        id: "s1sub1",
        name: "Introduction to Computer Science",
        pdfs: [
          { id: "pdf1", title: "Lecture 1: Basics of Programming", url: "#", createdAt: "2023-09-05" },
          { id: "pdf2", title: "Lecture 2: Data Structures", url: "#", createdAt: "2023-09-12" },
        ],
      },
      {
        id: "s1sub2",
        name: "Calculus I",
        pdfs: [
          { id: "pdf3", title: "Chapter 1: Limits", url: "#", createdAt: "2023-09-06" },
        ],
      },
    ],
  },
  {
    id: "sem2",
    name: "Semester 2",
    subjects: [
      {
        id: "s2sub1",
        name: "Advanced Programming",
        pdfs: [
            { id: "pdf4", title: "Syllabus", url: "#", createdAt: "2024-01-15" },
        ],
      },
      {
        id: "s2sub2",
        name: "Linear Algebra",
        pdfs: [],
      },
    ],
  },
  {
    id: "sem3",
    name: "Semester 3",
    subjects: [
        { id: "s3sub1", name: "Algorithms", pdfs: [] },
    ],
  },
  {
    id: "sem4",
    name: "Semester 4",
    subjects: [],
  }
];

export const updateNote = {
    text: "Mid-term exams are scheduled for the last week of October. Please check the portal for the detailed schedule. Good luck!",
    lastUpdated: "2023-09-15",
    isNew: true,
}
