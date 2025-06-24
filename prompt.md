
# NoteVerse App - Core Features & Functionality

This document outlines the complete feature set for the NoteVerse application, covering both the student-facing and admin-facing functionalities.

## 1. Authentication

-   **Role-Based Access Control:** The application distinguishes between two primary user roles: `Admin` and `Student`.
-   **Student Login:**
    -   Primary login method is through **Google Sign-In**.
    -   If a user signs in with a new Google account, a `Student` profile is automatically created for them.
-   **Admin Login:**
    -   Admins log in through a separate, dedicated login page (`/admin/login`).
    -   Admin credentials are hard-coded for this version (`sagarsalunkhe98@gmail.com` / `Hardz@1998`).

---

## 2. Student-Facing Features (`/`)

### 2.1. Main Dashboard (`/home`)
-   Displays a personalized welcome message with the user's name and avatar.
-   Provides quick navigation cards to:
    -   **View Notes:** Links to the semester list.
    -   **Latest Update:** Links to the full announcement page.
-   Shows a snippet of the latest announcement from the admin.

### 2.2. Notes Access
-   **Semesters Page (`/semesters`):** Displays a list of all available semesters. Users can pull-to-refresh the list.
-   **Subjects Page (`/semesters/[id]`):** Shows a list of subjects for the selected semester.
-   **Files Page (`/semesters/[id]/subjects/[id]`):**
    -   Presents notes and exam papers in separate tabs.
    -   Users can **view** PDFs directly within the app in a modal viewer.
    -   Users can **download** PDFs.

### 2.3. Profile & Settings
-   **Profile Page (`/profile`):**
    -   Users can update their display name and profile picture (avatar).
    -   Email address is displayed but is read-only.
-   **Settings Page (`/settings`):**
    -   **Theme Toggle:** Switch between light and dark mode.
    -   **Font Style:** Change the application's body font.
    -   **Privacy:** A switch to hide their name and photo from other users in the "Community" tab.

### 2.4. Other Pages
-   **Latest Update Page (`/latest-update`):** Displays the full text of the most recent announcement from the admin.
-   **Community Page (`/users`):** Shows a list of all registered users, indicating their role and online status. User names/avatars can be anonymized based on their privacy settings.
-   **About Page (`/about`):** Displays mission/vision content and social media links managed by the admin.

---

## 3. Admin-Facing Features (`/admin`)

### 3.1. Admin Dashboard (`/admin/home`)
-   Displays a welcome message for the administrator.
-   Provides quick access cards to all major management areas:
    -   Manage Notes (Semesters/Subjects/Files)
    -   Manage Update (Announcements)
    -   Manage About Page
    -   User Management
    -   Settings

### 3.2. Content Management
-   **Semesters (`/admin/semesters`):**
    -   Admins can **add**, **rename**, and **delete** semesters.
-   **Subjects (`/admin/semesters/[id]`):**
    -   Within a semester, admins can **add**, **rename**, and **delete** subjects.
-   **PDFs/Files (`/admin/semesters/[id]/subjects/[id]`):**
    -   Admins can add new files by providing a **Google Drive File ID**.
    -   Files can be categorized as a `Note` or an `Exam Paper`.
    -   Admins can **rename** and **delete** existing files.
    -   All content changes trigger an automatic "update note" for students.

### 3.3. Global App Management
-   **Manage Update Note (`/admin/update-note`):** A simple CMS to write and publish announcements that appear on the student dashboard.
-   **Manage About Page (`/admin/about`):**
    -   Edit the main text content of the public "About" page.
    -   Enable/disable and set URLs for various social media links.
-   **User Management (`/admin/users`):**
    -   View a table of all registered users.
    -   **Add** new users manually (name, email, password, role).
    -   **Edit** existing users: change their name, role (`Admin`, `Student`), and profile picture.
    -   **Ban** users from changing their name.
    -   **Delete** users from the system.
-   **Admin Settings (`/admin/settings`):**
    -   Change the background image for both student and admin login pages.
    -   Adjust the opacity of the dark overlay on the login page background.

### 3.4. Admin Profile
-   **Profile Page (`/admin/profile`):**
    -   Admins can update their own name and avatar.
    -   Admins can change their own password.

---

## 4. Core Technology & Style

-   **Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, ShadCN UI, Firebase Authentication, Lucide React.
-   **Data Persistence:** Uses browser `localStorage` to simulate a database for all application data (users, semesters, settings, etc.), ensuring data persists across sessions.
-   **Styling:**
    -   Primary Color: Deep Purple (`#6750A4`)
    -   Fonts: `Playfair Display` for headlines, `PT Sans` for body text.
    -   A fully responsive design for both mobile and desktop.
-   **PWA:** The app includes a manifest and service worker, making it installable on user devices for an offline-first, native-app-like experience.
