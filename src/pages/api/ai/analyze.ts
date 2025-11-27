import type { NextApiRequest, NextApiResponse } from 'next';

// Mock AI Analysis - Replace with actual Groq API when available
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  const { title, description, action } = req.body;

  if (!description) {
    return res.status(400).json({
      success: false,
      message: 'Description is required',
    });
  }

  try {
    // Handle format_description action
    if (action === 'format_description') {
      const formattedDescription = formatDescription(description);
      return res.status(200).json({
        success: true,
        formattedDescription,
      });
    }

    // Default: Task analysis with suggestions
    const suggestions = {
      suggestedPriority: analyzePriority(title || '', description),
      estimatedTime: estimateTime(title || '', description),
      suggestedTags: extractTags(title || '', description),
      suggestedDeadline: suggestDeadline(title || '', description),
      reasoning: 'Based on the task content, I\'ve analyzed the urgency, complexity, and common patterns.',
    };

    return res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to analyze task',
    });
  }
}

// Helper functions for mock AI analysis
function analyzePriority(title: string, description: string): 'low' | 'medium' | 'high' {
  const text = (title + ' ' + description).toLowerCase();
  
  const highKeywords = ['urgent', 'critical', 'asap', 'emergency', 'important', 'deadline'];
  const lowKeywords = ['optional', 'nice to have', 'whenever', 'eventually'];
  
  const hasHigh = highKeywords.some(keyword => text.includes(keyword));
  const hasLow = lowKeywords.some(keyword => text.includes(keyword));
  
  if (hasHigh) return 'high';
  if (hasLow) return 'low';
  return 'medium';
}

function estimateTime(title: string, description: string): string {
  const text = (title + ' ' + description).toLowerCase();
  const wordCount = text.split(/\s+/).length;
  
  if (wordCount < 20) return '1-2 hours';
  if (wordCount < 50) return '3-5 hours';
  if (wordCount < 100) return '1-2 days';
  return '3-5 days';
}

function extractTags(title: string, description: string): string[] {
  const text = (title + ' ' + description).toLowerCase();
  const tags: string[] = [];
  
  const tagPatterns = {
    'development': ['code', 'develop', 'programming', 'api', 'frontend', 'backend'],
    'design': ['design', 'ui', 'ux', 'mockup', 'prototype'],
    'documentation': ['document', 'write', 'readme', 'guide'],
    'bug': ['bug', 'fix', 'error', 'issue'],
    'feature': ['feature', 'implement', 'add', 'create'],
    'meeting': ['meeting', 'call', 'discuss', 'sync'],
    'review': ['review', 'check', 'validate', 'test'],
  };
  
  Object.entries(tagPatterns).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      tags.push(tag);
    }
  });
  
  return tags.slice(0, 3);
}

function suggestDeadline(title: string, description: string): string | null {
  const text = (title + ' ' + description).toLowerCase();
  const now = new Date();
  
  if (text.includes('urgent') || text.includes('asap')) {
    // Tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  
  if (text.includes('quick') || text.includes('simple')) {
    // 3 days from now
    const threeDays = new Date(now);
    threeDays.setDate(threeDays.getDate() + 3);
    return threeDays.toISOString().split('T')[0];
  }
  
  // Default: 1 week from now
  const oneWeek = new Date(now);
  oneWeek.setDate(oneWeek.getDate() + 7);
  return oneWeek.toISOString().split('T')[0];
}

// Format messy description into clean structured format
function formatDescription(description: string): string {
  const lines = description.trim().split('\n').map(l => l.trim()).filter(l => l);
  
  if (lines.length === 0) return description;
  
  // Check if already well-formatted
  const hasStructure = lines.some(l => l.match(/^(##?|[-*]|\d+\.)/));
  if (hasStructure) {
    return lines.join('\n\n');
  }
  
  // Format into structured description
  const formatted = [
    '## Overview',
    lines[0],
    '',
    '## Details',
    ...lines.slice(1).map(l => `- ${l}`),
  ];
  
  return formatted.join('\n');
}
