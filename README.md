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

## Deployment to Firebase App Hosting

This project is configured and ready to be deployed live on the web using **Firebase App Hosting**. Follow these steps carefully to launch your application.

### Step 1: Login to Firebase

If you haven't already, you need to log into your Firebase account through the command line. This connects your computer to Firebase.

1.  Open your terminal or command prompt.
2.  Run the following command:
    ```bash
    firebase login
    ```
3.  Your web browser will open, asking you to sign in with your Google account and grant permissions to the Firebase CLI.

### Step 2: Connect Your Project to Firebase

Next, you need to link your local project folder to the Firebase project you created in the Firebase Console.

1.  Make sure you are in the root directory of your project in the terminal.
2.  Run the initialization command:
    ```bash
    firebase init apphosting
    ```
3.  The command line will ask you a few questions:
    *   **"Select a Firebase project"**: Use the arrow keys to choose the Firebase project you set up for this app.
    *   **"Specify a backend name"**: You can press Enter to accept the default name (`noteverse-backend`).
    *   **"Choose a region"**: Select the region that is geographically closest to your users.
    *   **"Enable automatic rollouts..."**: You can choose `No` for now.

    This process will create the necessary backend resources in your Firebase project.

### Step 3: Deploy Your Application

This is the final step. The command will build your Next.js application, upload it to Firebase, and make it live.

1.  In the same terminal, run the deploy command:
    ```bash
    firebase apphosting:backends:deploy
    ```
2.  This process may take a few minutes. The CLI will show you the progress as it builds and deploys your app.
3.  Once it's finished, the command line will output the **live URL** for your app. You can share this URL with anyone!

That's it! Your NoteVerse application is now live on the internet. To deploy future updates, you just need to run the `firebase apphosting:backends:deploy` command again.

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
