import { Priority } from './task';

export interface AIAnalysisRequest {
  title: string;
  description: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  analysis: {
    suggestedPriority: Priority;
    estimatedTime: string;
    tags: string[];
    deadline: string;
    reasoning: string;
  };
}

export interface ProductivityInsights {
  summary: {
    totalTasks: number;
    completed: number;
    inProgress: number;
    todo: number;
    completionRate: number;
  };
  productivityPattern: {
    bestHours: string;
    peakDays: string[];
    averageTasksPerDay: number;
    streakDays: number;
  };
  completionRates: {
    highPriority: { total: number; completed: number; rate: number };
    mediumPriority: { total: number; completed: number; rate: number };
    lowPriority: { total: number; completed: number; rate: number };
  };
  metrics: {
    averageCompletionTime: string;
    overdueTasks: number;
    upcomingDeadlines: number;
  };
  recommendations: string[];
  strengths: string[];
  improvements: string[];
}

export interface InsightsResponse {
  success: boolean;
  insights: ProductivityInsights;
  generatedAt: string;
}
