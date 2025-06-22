
# Prompt for Recreating the NoteVerse Application

## 1. High-Level Overview

Build a responsive web application called **NoteVerse**. It serves as a note-sharing platform for students and a content management system for administrators. The application should have two distinct user roles: **Admin** and **Student**, each with their own interface and set of permissions. The core idea is for admins to upload and organize course materials (like notes and exam papers), which students can then access and view.

---

## 2. Core Features & User Roles

The application must support two roles with the following capabilities:

### a. Authentication
-   **User/Student Signup**: New users can create an account with a username, email, and password.
-   **Login**: Separate login forms for Students and Admins.
-   **Google Login**: Allow students to sign up or log in using their Google account.
-   **Password Management**: Users should be able to reset a forgotten password.
-   **Role-Based Access**: The app's UI and functionality must adapt based on whether the logged-in user is an Admin or a Student.

### b. Student/User Features
-   **Dashboard (Home Page)**: A personalized welcome screen showing the user's name and avatar. It should have quick links to "View Notes" and the "Latest Update".
-   **Notes Access**:
    -   A page listing all available **Semesters**.
    -   Clicking a semester leads to a page listing its **Subjects**.
    -   Clicking a subject leads to a page with two tabs: "Notes" and "Exams", listing downloadable PDF files for each.
-   **Profile Management**: A dedicated page where users can update their name and profile picture, and change their password.
-   **Settings**: A page where users can:
    -   Toggle between Light and Dark mode.
    -   Change the application's body font.
    -   Set a privacy option to hide their name and photo from the community page.
-   **Community Page**: A page that lists all registered users (Admins and Students), showing their avatar, name (or an anonymized ID if privacy is enabled), role, and online status.
-   **About Page**: A public page displaying information about NoteVerse.
-   **Latest Update Page**: A page that shows the most recent announcement from the admins.

### c. Admin Features
-   **Admin Dashboard**: A central control panel with quick access to all management functions.
-   **Content Management (Notes)**:
    -   **Semesters**: Admins can add, rename, and delete semesters.
    -   **Subjects**: Within a semester, admins can add, rename, and delete subjects.
    -   **Files (PDFs)**: Within a subject, admins can upload, rename, and delete PDF files, categorizing them as either a "Note" or an "Exam".
-   **User Management**:
    -   A page listing all users in the system.
    -   Admins can add new users manually.
    -   Admins can edit a user's details (name, avatar, role).
    -   Admins can delete a user's account.
    -   Admins can restrict a user's ability to change their own name.
-   **Update Note Management**: A page with a text editor for admins to write and save an announcement that appears on the student dashboard.
-   **About Page Management**: A page where admins can edit the content of the public "About Us" page and manage social media links.
-   **Global Settings**: A settings page for admins to change global elements, such as the background image on the login screens.
-   **Admin Profile**: Admins can manage their own profile details (name, avatar, password) just like students.

---

## 3. UI/UX and Styling Guidelines

### a. Layout & Design
-   **Responsive Design**: The layout must adapt seamlessly from desktop to mobile devices.
-   **Sidebar Navigation**: Both the admin and student sections should use a collapsible sidebar for navigation.
-   **Card-Based Layout**: Use cards to display lists of items like semesters, subjects, and dashboard links.
-   **Consistency**: Maintain consistent spacing, padding, and use of UI elements throughout the app.
-   **Feedback**: Use toasts/snackbars for notifications (e.g., "Profile Updated", "File Deleted") and confirmation dialogs for destructive actions (e.g., "Are you sure you want to delete this?").

### b. Color Palette
-   **Primary Color**: `#6750A4` (Deep Purple) - Used for primary UI elements, headers, and highlights.
-   **Background Color**: `#F2F0F7` (Light Gray) - For the main app background in light mode.
-   **Accent Color**: `#564B91` (Royal Blue) - For primary call-to-action buttons like "Save" or "Login".
-   **Dark Mode**: The application must support a dark theme with an appropriate color scheme.

### c. Typography
-   **Body Font**: 'PT Sans', sans-serif.
-   **Headline Font**: 'Playfair Display', serif - Used for page titles and main headings.

### d. Icons
-   Use a consistent, modern icon set (like Lucide-React or FontAwesome) for buttons, navigation items, and indicators.

---

## 4. Data Models

Structure your data based on the following models:

-   **User**:
    -   `id` (string, unique)
    -   `name` (string)
    -   `email` (string, unique)
    -   `password` (string, hashed)
    -   `avatar` (string, URL to image)
    -   `role` ('Admin' | 'Student')
    -   `status` ('online' | 'offline')
    -   `displayNameHidden` (boolean) - The user's privacy preference.
    -   `canChangeName` (boolean) - Admin-controlled permission.

-   **Semester**:
    -   `id` (string, unique)
    -   `name` (string)
    -   `subjects` (array of `Subject` objects)

-   **Subject**:
    -   `id` (string, unique)
    -   `name` (string)
    -   `pdfs` (array of `PDF` objects)

-   **PDF**:
    -   `id` (string, unique)
    -   `title` (string)
    -   `url` (string, URL to the file)
    -   `createdAt` (string, date)
    -   `category` ('Note' | 'Exam')

-   **AboutPageContent**:
    -   `content` (string, text content)
    -   `socialLinks` (array of `SocialLink` objects)
        - `id` (string, e.g., 'facebook')
        - `name` (string)
        - `url` (string)
        - `enabled` (boolean)

-   **UpdateNote**:
    -   `text` (string)
    -   `lastUpdated` (string, date)

