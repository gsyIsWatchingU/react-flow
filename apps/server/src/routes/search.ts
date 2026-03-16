import express from 'express';
import { SearchRequest, SearchResponse, SearchResult, ApiResponse } from '@react-flow/shared-types';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const searchLimiter = rateLimit({
  windowMs: 1000,
  max: 2,
  message: 'Too many search requests, please try again later.'
});

interface ExtendedSearchResult extends SearchResult {
  tags: string[];
  category: string;
}

const mockResults: ExtendedSearchResult[] = [
  { id: '1', title: 'React 18 Features', description: 'Explore the latest features in React 18', tags: ['react', 'frontend', 'javascript'], category: 'Frontend' },
  { id: '2', title: 'TypeScript Best Practices', description: 'Learn TypeScript best practices for large applications', tags: ['typescript', 'frontend', 'backend'], category: 'Development' },
  { id: '3', title: 'Node.js Performance', description: 'Optimize your Node.js applications', tags: ['nodejs', 'backend', 'performance'], category: 'Backend' },
  { id: '4', title: 'WebSockets Tutorial', description: 'Real-time communication with WebSockets', tags: ['websockets', 'backend', 'real-time'], category: 'Backend' },
  { id: '5', title: 'Docker for Devs', description: 'Containerize your applications', tags: ['docker', 'devops', 'containers'], category: 'DevOps' },
  { id: '6', title: 'GraphQL Basics', description: 'Introduction to GraphQL', tags: ['graphql', 'api', 'backend'], category: 'Backend' },
  { id: '7', title: 'React Hooks Deep Dive', description: 'Master React custom hooks', tags: ['react', 'hooks', 'frontend'], category: 'Frontend' },
  { id: '8', title: 'Redux Toolkit', description: 'Simplified state management', tags: ['react', 'redux', 'state-management'], category: 'Frontend' },
  { id: '9', title: 'Next.js Framework', description: 'Server-side rendering with Next.js', tags: ['nextjs', 'react', 'frontend'], category: 'Frontend' },
  { id: '10', title: 'MongoDB Basics', description: 'NoSQL database fundamentals', tags: ['mongodb', 'database', 'backend'], category: 'Database' },
  { id: '11', title: 'AWS Deployment', description: 'Deploying applications on AWS', tags: ['aws', 'devops', 'cloud'], category: 'DevOps' },
  { id: '12', title: 'Testing with Jest', description: 'Unit testing best practices', tags: ['testing', 'jest', 'quality'], category: 'Development' }
];

router.get('/', searchLimiter, (req, res) => {
  const { query, page = 1, limit = 10 }: SearchRequest = req.query as any;
  
  let filteredResults = mockResults;
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredResults = mockResults.filter(
      r => r.title.toLowerCase().includes(lowerQuery) || 
           r.description.toLowerCase().includes(lowerQuery) ||
           r.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
           r.category.toLowerCase().includes(lowerQuery)
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = filteredResults.slice(startIndex, endIndex);
  
  const searchResponse: SearchResponse = {
    results: paginatedResults,
    total: filteredResults.length,
    page: Number(page),
    limit: Number(limit)
  };
  
  const response: ApiResponse<SearchResponse> = {
    success: true,
    data: searchResponse
  };
  
  res.json(response);
});

export default router;
