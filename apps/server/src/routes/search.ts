import express from 'express';
import { SearchRequest, SearchResponse, SearchResult, ApiResponse } from '@react-flow/shared-types';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const searchLimiter = rateLimit({
  windowMs: 1000,
  max: 2,
  message: 'Too many search requests, please try again later.'
});

const mockResults: SearchResult[] = [
  { id: '1', title: 'React 18 Features', description: 'Explore the latest features in React 18' },
  { id: '2', title: 'TypeScript Best Practices', description: 'Learn TypeScript best practices for large applications' },
  { id: '3', title: 'Node.js Performance', description: 'Optimize your Node.js applications' },
  { id: '4', title: 'WebSockets Tutorial', description: 'Real-time communication with WebSockets' },
  { id: '5', title: 'Docker for Devs', description: 'Containerize your applications' },
  { id: '6', title: 'GraphQL Basics', description: 'Introduction to GraphQL' },
  { id: '7', title: 'React Hooks Deep Dive', description: 'Master React custom hooks' },
  { id: '8', title: 'Redux Toolkit', description: 'Simplified state management' }
];

router.get('/', searchLimiter, (req, res) => {
  const { query, page = 1, limit = 10 }: SearchRequest = req.query as any;
  
  let filteredResults = mockResults;
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredResults = mockResults.filter(
      r => r.title.toLowerCase().includes(lowerQuery) || 
           r.description.toLowerCase().includes(lowerQuery)
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
