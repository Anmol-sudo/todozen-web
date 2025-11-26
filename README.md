# TodoZen: Your Intelligent Task Manager

TodoZen is a modern, AI-powered to-do list application built with Next.js and designed to help you manage your tasks efficiently. It features an "Intelligent Prioritization" capability that uses Google's Gemini AI to automatically organize your tasks based on their description and deadlines, helping you focus on what matters most.

## ✨ Features

- **Task Management**: A clean and simple interface to add, view, and manage your daily tasks.
- **Intelligent Prioritization**: Leverages the Gemini AI model via Genkit to analyze your tasks and assign a priority score (from 1 to 10) along with a justification.
- **Due Dates & Times**: Assign specific due dates and times to your tasks.
- **Client-Side Notifications**: Get instant browser notifications the moment you add a new task.
- **Responsive Design**: A beautiful and responsive layout built with Tailwind CSS and shadcn/ui that works on any device.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Integration**: [Google AI - Genkit](https://firebase.google.com/docs/genkit)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v20 or later recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

Install the necessary packages for both the Next.js app and the Genkit AI service.

```bash
npm install
```

### 3. Set Up Environment Variables

The Intelligent Prioritization feature requires a Gemini API key.

1.  Create a new file named `.env.local` in the root of the project.
2.  Add your API key to the file as shown below:

    ```
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```

    You can obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Run the Development Servers

This project requires two services to be running simultaneously: the Next.js web application and the Genkit AI development server.

-   **Terminal 1: Start the Next.js App**

    ```bash
    npm run dev
    ```

    Your application will be available at `http://localhost:9002`.

-   **Terminal 2: Start the Genkit Service**

    ```bash
    npm run genkit:dev
    ```

    This starts the local server that the Next.js app communicates with for AI features.

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run genkit:dev`: Starts the Genkit development server.
- `npm run build`: Creates a production build of the Next.js application.
- `npm run start`: Starts the production server for the built application.
- `npm run lint`: Lints the codebase for errors.
