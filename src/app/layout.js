import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'ResumeATS Pro - Build ATS-Friendly Resumes That Get You Hired',
  description: 'Create clean, recruiter-approved, ATS-optimized resumes in minutes. Check your ATS score, get AI-powered suggestions, and land more interviews.',
  keywords: 'ATS resume builder, resume score checker, AI resume, ATS friendly resume India',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
