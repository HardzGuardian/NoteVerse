# NoteVerse

NoteVerse is a modern, feature-rich note-sharing application designed for students and educators. It provides a centralized platform to organize, access, and manage academic materials efficiently. Built with a robust and scalable tech stack, it offers a seamless user experience with real-time data synchronization.

## Core Features

-   **Role-Based Authentication**: Secure login for both students and administrators, with distinct permissions and dashboards.
-   **Dynamic Home Screen**: A personalized dashboard for students showing their profile, quick access to notes, and the latest announcements from admins.
-   **Semester & Subject Management**: Admins can easily create, edit, and delete semesters and subjects, providing a clear structure for course materials.
-   **Resource Organization**: Within each subject, admins can upload, rename, and delete PDF files for both notes and exam papers.
-   **PDF Viewer & Downloader**: Students can view PDFs directly within the app or download them for offline access.
-   **Centralized Announcements**: A simple CMS for admins to post important updates that are displayed prominently on the student home screen.
-   **Real-time Data Sync**: All data is managed through the browser's `localStorage`, simulating a real-time database experience and ensuring data persistence across sessions.
-   **User Management**: Admins have a dedicated panel to view, add, edit user roles, and manage user permissions.
-   **Customizable Theming**: Users can switch between light and dark modes and change the application font for a personalized experience.
-   **Profile Customization**: Users can update their profile information, including their name and avatar.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React](https://reactjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
-   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) (Google & Email/Password)
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
-   **AI**: [Genkit](https://firebase.google.com/docs/genkit) (for future AI integrations)

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    Open `src/lib/firebase.ts` and replace the placeholder `firebaseConfig` object with your own Firebase project's configuration.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

## Login Credentials

### Admin Access

-   **Email**: `sagarsalunkhe98@gmail.com`
-   **Password**: `Hardz@1998`

### Student Access

-   **Sign Up**: You can create a new student account through the sign-up page.
-   **Google Login**: Students can also log in using their Google account. If a user with that email doesn't exist, a new student account will be created automatically.
