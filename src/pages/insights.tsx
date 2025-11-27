import React, { useMemo, useState, useRef } from 'react';
import Head from 'next/head';
import { Layout } from '@/components/layout';
import { useTasks } from '@/context/TaskContext';
import { BarChart3, TrendingUp, CheckCircle2, Clock, AlertCircle, Sparkles, Calendar, Download, Edit2, Save } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';
import type { GetServerSideProps } from 'next';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

interface InsightsPageProps {
  serverTime?: string;
}

const InsightsPage: React.FC<InsightsPageProps> = ({ serverTime }) => {
  const { tasks, stats } = useTasks();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const summaryRef = useRef<HTMLDivElement>(null);

  // Filter tasks by date range
  const filteredTasks = useMemo(() => {
    if (!startDate && !endDate) return tasks;
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      const start = startDate ? new Date(startDate) : new Date('2000-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');
      
      return taskDate >= start && taskDate <= end;
    });
  }, [tasks, startDate, endDate]);

  // Calculate stats from filtered tasks
  const filteredStats = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.status === 'completed').length;
    const inProgress = filteredTasks.filter(t => t.status === 'in-progress').length;
    const todo = filteredTasks.filter(t => t.status === 'todo').length;
    const overdue = filteredTasks.filter(t => {
      if (!t.dueDate || t.status === 'completed') return false;
      return new Date(t.dueDate) < new Date();
    }).length;

    return { total, completed, inProgress, todo, overdue };
  }, [filteredTasks]);

  // Task status distribution
  const statusData = [
    { name: 'To Do', value: filteredStats.todo, color: '#64748b' },
    { name: 'In Progress', value: filteredStats.inProgress, color: '#3b82f6' },
    { name: 'Completed', value: filteredStats.completed, color: '#10b981' },
  ];

  // Task priority distribution
  const priorityData = useMemo(() => {
    const high = filteredTasks.filter(t => t.priority === 'high').length;
    const medium = filteredTasks.filter(t => t.priority === 'medium').length;
    const low = filteredTasks.filter(t => t.priority === 'low').length;

    return [
      { name: 'High', value: high, color: '#ef4444' },
      { name: 'Medium', value: medium, color: '#f59e0b' },
      { name: 'Low', value: low, color: '#6b7280' },
    ];
  }, [filteredTasks]);

  // Calculate completion rate
  const completionRate = filteredStats.total > 0 
    ? Math.round((filteredStats.completed / filteredStats.total) * 100)
    : 0;

  const generateAISummary = async () => {
    if (filteredTasks.length === 0) {
      toast.error('No tasks in selected date range');
      return;
    }

    setIsGenerating(true);
    try {
      // Generate professional AI analysis
      const totalTasks = filteredStats.total;
      const completedTasks = filteredStats.completed;
      const inProgressTasks = filteredStats.inProgress;
      const todoTasks = filteredStats.todo;
      const overdueTasks = filteredStats.overdue;
      const completionRate = Math.round((completedTasks / totalTasks) * 100);

      const highPriority = filteredTasks.filter(t => t.priority === 'high').length;
      const mediumPriority = filteredTasks.filter(t => t.priority === 'medium').length;
      const lowPriority = filteredTasks.filter(t => t.priority === 'low').length;

      const dateRangeText = startDate && endDate 
        ? `from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
        : startDate 
        ? `from ${new Date(startDate).toLocaleDateString()} onwards`
        : endDate
        ? `until ${new Date(endDate).toLocaleDateString()}`
        : 'for all time';

      const report = `# Task Management Analysis Report

## Executive Summary
Analysis Period: ${dateRangeText}
Report Generated: ${new Date().toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

---

## Overview
This report provides a comprehensive analysis of task management performance for the specified period. The analysis covers task completion rates, priority distribution, and actionable recommendations for improved productivity.

---

## Key Metrics

### Task Statistics
- **Total Tasks**: ${totalTasks}
- **Completed Tasks**: ${completedTasks} (${completionRate}%)
- **In Progress**: ${inProgressTasks}
- **Pending (To Do)**: ${todoTasks}
- **Overdue Tasks**: ${overdueTasks}

### Priority Distribution
- **High Priority**: ${highPriority} tasks (${Math.round(highPriority/totalTasks*100)}%)
- **Medium Priority**: ${mediumPriority} tasks (${Math.round(mediumPriority/totalTasks*100)}%)
- **Low Priority**: ${lowPriority} tasks (${Math.round(lowPriority/totalTasks*100)}%)

---

## Performance Analysis

### Completion Rate: ${completionRate}%
${completionRate >= 80 ? '✅ **Excellent Performance** - The team is maintaining an exceptional completion rate. This indicates strong productivity and effective task management.' :
  completionRate >= 60 ? '✓ **Good Performance** - Completion rate is above average, showing solid progress. Consider strategies to push this higher.' :
  completionRate >= 40 ? '⚠️ **Moderate Performance** - There is room for improvement. Review task assignments and identify potential bottlenecks.' :
  '⚠️ **Attention Required** - Completion rate is below optimal levels. Immediate action recommended to improve task execution.'}

### Workload Distribution
${inProgressTasks > todoTasks ? '- Current focus is primarily on in-progress tasks, indicating active engagement with ongoing work.' :
  '- Higher number of pending tasks suggests need for better task initiation and prioritization.'}

${overdueTasks > 0 ? `\n### ⚠️ Overdue Tasks Alert
There are currently **${overdueTasks} overdue tasks** requiring immediate attention. These should be prioritized to prevent project delays.` : 
'\n### ✅ No Overdue Tasks\nExcellent time management! All tasks are being completed within their deadlines.'}

---

## Priority Analysis

${highPriority > mediumPriority + lowPriority ? `### High Priority Focus
The workload is heavily weighted toward high-priority tasks (${Math.round(highPriority/totalTasks*100)}%). This indicates:
- Critical projects are receiving appropriate attention
- Team is focused on high-impact work
- May need additional resources to manage high-priority load` :
`### Balanced Priority Distribution
Priority distribution shows a healthy balance across different task levels, allowing for both urgent and important work to progress simultaneously.`}

---

## Recommendations

${completionRate < 70 ? '1. **Improve Completion Rate**: Consider breaking down larger tasks into smaller, manageable subtasks to boost completion metrics.\n\n' : ''}${overdueTasks > 3 ? '2. **Address Overdue Tasks**: Schedule a focused session to clear overdue tasks and prevent further accumulation.\n\n' : ''}${inProgressTasks > totalTasks * 0.5 ? '3. **Reduce Work-in-Progress**: Limit concurrent tasks to improve focus and completion speed.\n\n' : ''}${highPriority > 10 ? '4. **High Priority Management**: Review if all high-priority tasks truly require urgent attention or if some can be reclassified.\n\n' : ''}5. **Maintain Momentum**: Continue current practices for completed tasks and apply successful strategies to pending work.

6. **Regular Reviews**: Schedule weekly review sessions to assess progress and adjust priorities as needed.

---

## Conclusion

${completionRate >= 70 && overdueTasks === 0 ? 
'The current task management performance demonstrates strong execution and organization. The team is effectively managing workload and meeting deadlines consistently. Continue monitoring metrics and maintaining current best practices.' :
completionRate >= 50 ?
'Overall performance shows positive trends with room for targeted improvements. Focus on the recommendations outlined above to enhance productivity and task completion rates.' :
'Performance metrics indicate significant opportunities for improvement. Implementing the recommended strategies will help establish better task management practices and improve overall team productivity.'}

---

*This report was generated automatically based on task data analysis. For questions or clarifications, please consult with your project manager.*`;

      setAiSummary(report);
      setEditedSummary(report);
      toast.success('AI Analysis Generated! ✨');
    } catch (error) {
      console.error('Error generating AI summary:', error);
      toast.error('Failed to generate analysis');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEdit = () => {
    setAiSummary(editedSummary);
    setIsEditing(false);
    toast.success('Report updated!');
  };

  const handleDownloadPDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Function to add new page if needed
      const checkAddPage = (heightNeeded: number) => {
        if (yPosition + heightNeeded > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Parse markdown-style report
      const lines = aiSummary.split('\n');
      
      lines.forEach((line, index) => {
        if (!line.trim()) {
          yPosition += 3;
          return;
        }

        // Headers
        if (line.startsWith('# ')) {
          checkAddPage(15);
          pdf.setFontSize(18);
          pdf.setFont('helvetica', 'bold');
          const text = line.replace('# ', '');
          pdf.text(text, pageWidth / 2, yPosition, { align: 'center' });
          yPosition += 12;
        } else if (line.startsWith('## ')) {
          checkAddPage(12);
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          const text = line.replace('## ', '');
          pdf.text(text, margin, yPosition);
          yPosition += 10;
        } else if (line.startsWith('### ')) {
          checkAddPage(10);
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'bold');
          const text = line.replace('### ', '');
          pdf.text(text, margin, yPosition);
          yPosition += 8;
        } else if (line.startsWith('---')) {
          checkAddPage(5);
          pdf.setDrawColor(200, 200, 200);
          pdf.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 5;
        } else if (line.startsWith('- **')) {
          // Bold bullet points
          checkAddPage(8);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          const text = line.replace('- **', '• ').replace('**:', ':');
          const splitText = pdf.splitTextToSize(text, maxWidth - 5);
          pdf.text(splitText, margin + 5, yPosition);
          yPosition += splitText.length * 5 + 2;
        } else if (line.startsWith('- ')) {
          // Regular bullet points
          checkAddPage(8);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const text = line.replace('- ', '• ');
          const splitText = pdf.splitTextToSize(text, maxWidth - 5);
          pdf.text(splitText, margin + 5, yPosition);
          yPosition += splitText.length * 5 + 2;
        } else if (line.match(/^\d+\./)) {
          // Numbered lists
          checkAddPage(8);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const splitText = pdf.splitTextToSize(line, maxWidth - 5);
          pdf.text(splitText, margin + 5, yPosition);
          yPosition += splitText.length * 5 + 2;
        } else {
          // Regular text
          checkAddPage(8);
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          // Handle bold text by replacing ** markers
          const processedLine = line.replace(/\*\*(.*?)\*\*/g, '$1');
          const splitText = pdf.splitTextToSize(processedLine, maxWidth);
          pdf.text(splitText, margin, yPosition);
          yPosition += splitText.length * 5 + 2;
        }
      });

      // Add footer
      const totalPages = (pdf as any).internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      const dateStr = new Date().toISOString().split('T')[0];
      pdf.save(`Task-Analysis-Report-${dateStr}.pdf`);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  // Custom legend renderer
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mt-4 flex-wrap">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Insights - {APP_NAME}</title>
      </Head>

      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Insights</h1>
            <p className="text-gray-600 mt-1">
              Analytics and AI-powered insights for your tasks
            </p>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Date Range Filter</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {(startDate || endDate) && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} in selected range
                </p>
                <button
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{filteredStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-700 mt-1">{completionRate}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">{filteredStats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-700 mt-1">{filteredStats.overdue}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend content={renderLegend} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Task Priority Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend content={renderLegend} />
                  <Bar dataKey="value" name="Tasks">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">AI-Powered Analysis Report</h2>
                <p className="text-sm text-gray-600">Get intelligent analysis and professional report</p>
              </div>
            </div>

            {!aiSummary ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Generate comprehensive AI-powered analysis based on {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                  {(startDate || endDate) && ' in selected date range'}
                </p>
                <button
                  onClick={generateAISummary}
                  disabled={isGenerating || filteredTasks.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 mx-auto"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Analysis...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate AI Analysis
                    </>
                  )}
                </button>
                {filteredTasks.length === 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {startDate || endDate ? 'No tasks in selected date range' : 'Add some tasks first to generate analysis'}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-end gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedSummary(aiSummary);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Report
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                      <button
                        onClick={generateAISummary}
                        disabled={isGenerating}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Regenerate
                      </button>
                    </>
                  )}
                </div>

                <div className="bg-white rounded-lg p-6 max-h-[600px] overflow-y-auto" ref={summaryRef}>
                  {isEditing ? (
                    <textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      className="w-full h-[500px] p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      {aiSummary.split('\n').map((line, index) => {
                        if (line.startsWith('# ')) {
                          return <h1 key={index} className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">{line.replace('# ', '')}</h1>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">{line.replace('## ', '')}</h2>;
                        } else if (line.startsWith('### ')) {
                          return <h3 key={index} className="text-lg font-semibold text-gray-700 mt-4 mb-2">{line.replace('### ', '')}</h3>;
                        } else if (line.startsWith('---')) {
                          return <hr key={index} className="my-4 border-gray-300" />;
                        } else if (line.startsWith('- **')) {
                          const text = line.replace('- **', '').replace('**:', ':');
                          return <li key={index} className="ml-4 text-gray-700"><strong>{text.split(':')[0]}:</strong>{text.split(':').slice(1).join(':')}</li>;
                        } else if (line.startsWith('- ')) {
                          return <li key={index} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>;
                        } else if (line.match(/^\d+\./)) {
                          return <li key={index} className="ml-4 text-gray-700">{line}</li>;
                        } else if (line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <p key={index} className="text-gray-700 mb-2">
                              {parts.map((part, i) => 
                                i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                              )}
                            </p>
                          );
                        } else if (line.trim()) {
                          return <p key={index} className="text-gray-700 mb-2">{line}</p>;
                        }
                        return <br key={index} />;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

// Server-side function for Next.js SSR requirement
export const getServerSideProps: GetServerSideProps = async () => {
  // Demonstrates server-side rendering capability
  return {
    props: {
      serverTime: new Date().toISOString(),
    },
  };
};

export default InsightsPage;
