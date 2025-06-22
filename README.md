# NoteVerse

NoteVerse is a Next.js web application for students to access notes and updates, with a separate interface for administrators to manage content. This project was scaffolded using Firebase Studio.

## Features

- **Authentication**: Email/password login for users and admins.
- **Role-Based Access**: UI and functionality adapts based on user role (admin vs. user).
- **Course Material Management**: Admins can organize notes into Semesters, Subjects, and upload PDF files.
- **Real-time Updates**: A dedicated section for admins to post updates for all students.
- **Theming**: Dark and Light mode support, with preference saved locally.
- **Responsive Design**: A clean, intuitive, and responsive UI built with Next.js, Tailwind CSS, and shadcn/ui.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm
- A Firebase project
- [Firebase CLI](https://firebase.google.com/docs/cli) installed on your machine (`npm install -g firebase-tools`)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd NoteVerse
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase:**
    - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    - In your project, go to **Project settings** > **General**.
    - Under "Your apps", click the web icon (`</>`) to add a new web app.
    - Copy the `firebaseConfig` object.
    - Create a `.env.local` file in the root of your project and add your Firebase configuration:

    ```.env.local
    NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
    ```

4.  **Enable Firebase Services:**
    - In the Firebase Console, go to **Authentication** and enable the "Email/Password" sign-in provider.
    - Go to **Firestore Database** and create a database.
    - Go to **Storage** and set it up.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) (or your configured port) with your browser to see the result.

## Deployment

This project is configured to be deployed with **Firebase App Hosting**.

1.  **Login to Firebase:**
    If you haven't already, log in to your Firebase account through the command line:
    ```bash
    firebase login
    ```

2.  **Initialize App Hosting:**
    Run the `init` command to connect your local project to your Firebase project.
    ```bash
    firebase init apphosting
    ```
    Follow the prompts to select your Firebase project and configure the deployment settings. This will create the necessary backend resources in your project.

3.  **Deploy the App:**
    Once initialized, deploy your app using the following command:
    ```bash
    firebase apphosting:backends:deploy
    ```
    The CLI will build your Next.js application and deploy it to App Hosting. After it finishes, it will provide you with the live URL for your app.

## Code Structure

The project follows the standard Next.js App Router structure:

-   `src/app/`: Contains all the routes for the application.
-   `src/components/`: Shared React components.
    -   `src/components/ui/`: Components from shadcn/ui.
-   `src/lib/`: Utility functions and mock data.
-   `public/`: Static assets.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
-   **Backend**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Storage)
-   **Icons**: [Lucide React](https://lucide.dev/guide/packages/lucide-react)
