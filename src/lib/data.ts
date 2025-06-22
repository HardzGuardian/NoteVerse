
export type PDF = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
  category: 'Note' | 'Exam';
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

export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'Admin' | 'Student' | 'Uploader';
  status: 'online' | 'offline';
  displayNameHidden: boolean;
  canChangeName: boolean;
};

export type SocialLink = {
  id: 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'whatsapp' | 'telegram' | 'steam';
  name: string;
  url: string;
  enabled: boolean;
  placeholder: string;
};

export const users: User[] = [
  { id: 'usr1', name: 'Sagar Salunkhe', avatar: 'https://placehold.co/100x100.png', email: 'sagarsalunkhe98@gmail.com', role: 'Admin', status: 'online', displayNameHidden: false, canChangeName: true },
  { id: 'usr2', name: '', avatar: 'https://placehold.co/100x100.png', email: 'janedoe123@gmail.com', role: 'Student', status: 'online', displayNameHidden: true, canChangeName: true },
  { id: 'usr3', name: '', avatar: 'https://placehold.co/100x100.png', email: 'john.smith@example.com', role: 'Student', status: 'offline', displayNameHidden: true, canChangeName: true },
  { id: 'usr4', name: 'Professor Oak', avatar: 'https://placehold.co/100x100.png', email: 'prof.oak@example.com', role: 'Uploader', status: 'online', displayNameHidden: true, canChangeName: true },
];

export const semesters: Semester[] = [
  {
    id: "sem1",
    name: "Semester 1",
    subjects: [
      {
        id: "s1sub1",
        name: "Introduction to Computer Science",
        pdfs: [
          { id: "pdf1", title: "Lecture 1: Basics of Programming", url: "#", createdAt: "2023-09-05", category: "Note" },
          { id: "pdf2", title: "Lecture 2: Data Structures", url: "#", createdAt: "2023-09-12", category: "Note" },
          { id: "pdf_exam1", title: "Midterm Exam Paper", url: "#", createdAt: "2023-10-20", category: "Exam" },
        ],
      },
      {
        id: "s1sub2",
        name: "Calculus I",
        pdfs: [
          { id: "pdf3", title: "Chapter 1: Limits", url: "#", createdAt: "2023-09-06", category: "Note" },
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
            { id: "pdf4", title: "Syllabus", url: "#", createdAt: "2024-01-15", category: "Note" },
            { id: "pdf_exam2", title: "Final Exam Question Bank", url: "#", createdAt: "2024-04-10", category: "Exam" },
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

export const aboutContent = "NoteVerse is a revolutionary platform designed to streamline the academic lives of students. Our mission is to provide a centralized, easy-to-use system for accessing course notes, staying updated with important announcements, and managing academic materials efficiently. We believe that by simplifying access to information, we can empower students to achieve their academic goals with greater confidence and less stress. NoteVerse is more than just a notes app; it's a partner in your educational journey.";

export const socialLinks: SocialLink[] = [
    { id: 'facebook', name: 'Facebook', url: "https://facebook.com", enabled: true, placeholder: 'https://facebook.com/your-page' },
    { id: 'instagram', name: 'Instagram', url: "https://instagram.com", enabled: true, placeholder: 'https://instagram.com/your-handle' },
    { id: 'twitter', name: 'Twitter', url: "https://twitter.com", enabled: true, placeholder: 'https://twitter.com/your-handle' },
    { id: 'youtube', name: 'YouTube', url: "", enabled: false, placeholder: 'https://youtube.com/your-channel' },
    { id: 'whatsapp', name: 'WhatsApp', url: "", enabled: false, placeholder: 'https://wa.me/your-number' },
    { id: 'telegram', name: 'Telegram', url: "", enabled: false, placeholder: 'https://t.me/your-channel' },
    { id: 'steam', name: 'Steam', url: "", enabled: false, placeholder: 'https://steamcommunity.com/id/your-profile' },
];
