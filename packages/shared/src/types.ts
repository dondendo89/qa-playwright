export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Project {
  id: string;
  name: string;
  userId: string;
}

export interface Target {
  id: string;
  url: string;
  name: string;
  projectId: string;
}

export interface TestResult {
  success: boolean;
  message?: string;
  screenshot?: string;
  logs?: string[];
}