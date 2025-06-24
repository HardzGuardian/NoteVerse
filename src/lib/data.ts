
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

const DUMMY_PDF_URL = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export const users: User[] = [
  { id: 'usr1', name: 'Sagar Salunkhe', avatar: 'https://placehold.co/100x100.png', email: 'sagarsalunkhe98@gmail.com', role: 'Admin', status: 'online', displayNameHidden: false, canChangeName: true },
];

export const initialSemesters: Semester[] = [];

export const updateNote = {
    text: "Welcome to NoteVerse! You can edit this announcement in the admin panel under 'Manage Update'.",
    lastUpdated: new Date().toISOString().split('T')[0],
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
