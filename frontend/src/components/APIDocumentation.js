import React, { useState } from 'react';
import { Code, Copy, Check } from 'lucide-react';

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/students',
    description: 'Fetch paginated students',
    params: [
      { name: 'page', type: 'number', default: '1', description: 'Page number' },
      { name: 'limit', type: 'number', default: '10', description: 'Items per page' },
      { name: 'q', type: 'string', description: 'Search query' },
      { name: 'sortBy', type: 'string', default: 'createdAt', description: 'Field to sort by' },
      { name: 'sortOrder', type: 'string', default: 'desc', description: 'Sort order (asc/desc)' }
    ],
    example: {
      request: 'GET /api/students?page=1&limit=10&q=john',
      response: {
        items: [],
        total: 150,
        page: 1,
        limit: 10
      }
    }
  },
  {
    method: 'POST',
    path: '/api/students',
    description: 'Create new student',
    body: {
      name: 'string (required)',
      usn: 'string (required, unique)',
      department: 'string (required)',
      email: 'string (optional)',
      phone: 'string (optional)',
      subjects: {
        mathematics: 'number (0-100)',
        physics: 'number (0-100)',
        chemistry: 'number (0-100)',
        english: 'number (0-100)',
        computerScience: 'number (0-100)'
      }
    },
    example: {
      request: 'POST /api/students',
      body: {
        name: 'John Doe',
        usn: 'USN001',
        department: 'Computer Science',
        subjects: {
          mathematics: 85,
          physics: 90,
          chemistry: 88,
          english: 82,
          computerScience: 95
        }
      },
      response: {
        _id: '...',
        name: 'John Doe',
        percentage: 88,
        grade: 'A',
        passStatus: 'Pass'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/:id',
    description: 'Get student by ID',
    example: {
      request: 'GET /api/students/507f1f77bcf86cd799439011',
      response: {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        usn: 'USN001',
        department: 'Computer Science',
        percentage: 88,
        grade: 'A'
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/students/:id',
    description: 'Update student',
    example: {
      request: 'PUT /api/students/507f1f77bcf86cd799439011',
      body: {
        subjects: {
          mathematics: 90
        }
      },
      response: {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        percentage: 89,
        grade: 'A'
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/students/:id',
    description: 'Delete student',
    example: {
      request: 'DELETE /api/students/507f1f77bcf86cd799439011',
      response: {
        message: 'Student removed'
      }
    }
  },
  {
    method: 'POST',
    path: '/api/students/bulk-delete',
    description: 'Delete multiple students',
    example: {
      request: 'POST /api/students/bulk-delete',
      body: {
        ids: ['id1', 'id2', 'id3']
      },
      response: {
        deletedCount: 3
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/students',
    description: 'Clear all students',
    example: {
      request: 'DELETE /api/students',
      response: {
        deletedCount: 150
      }
    }
  },
  {
    method: 'GET',
    path: '/api/students/check-usn/:usn',
    description: 'Check if USN exists',
    example: {
      request: 'GET /api/students/check-usn/USN001',
      response: {
        exists: true
      }
    }
  }
];

const APIDocumentation = () => {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="api-docs">
      <div className="mb-4">
        <h2 className="mb-2">API Documentation</h2>
        <p className="text-muted">Complete API reference for Student Records Management System</p>
      </div>

      <div className="base-url mb-4 p-3 bg-light rounded">
        <strong>Base URL:</strong> <code>{process.env.REACT_APP_API_URL || 'http://localhost:5000'}</code>
      </div>

      {ENDPOINTS.map((endpoint, idx) => (
        <div key={idx} className="endpoint-card mb-4">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <span className={`badge me-2 ${endpoint.method === 'GET' ? 'bg-primary' : endpoint.method === 'POST' ? 'bg-success' : endpoint.method === 'PUT' ? 'bg-warning' : 'bg-danger'}`}>
                  {endpoint.method}
                </span>
                <code className="text-dark">{endpoint.path}</code>
              </div>
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">{endpoint.description}</p>

              {endpoint.params && (
                <div className="mb-3">
                  <strong>Query Parameters:</strong>
                  <table className="table table-sm mt-2">
                    <thead>
                      <tr>
                        <th>Parameter</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.params.map((param, pIdx) => (
                        <tr key={pIdx}>
                          <td><code>{param.name}</code></td>
                          <td>{param.type}</td>
                          <td>{param.default || '-'}</td>
                          <td>{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {endpoint.body && (
                <div className="mb-3">
                  <strong>Request Body:</strong>
                  <pre className="bg-light p-2 rounded mt-2">
                    <code>{JSON.stringify(endpoint.body, null, 2)}</code>
                  </pre>
                </div>
              )}

              <div className="example-section">
                <strong>Example Request:</strong>
                <div className="position-relative">
                  <pre className="bg-dark text-light p-3 rounded mt-2">
                    <code>{endpoint.example.request}</code>
                  </pre>
                  <button
                    className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2"
                    onClick={() => copyToClipboard(endpoint.example.request, `req-${idx}`)}
                  >
                    {copied === `req-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {endpoint.example.body && (
                <div className="example-section mt-3">
                  <strong>Example Body:</strong>
                  <div className="position-relative">
                    <pre className="bg-dark text-light p-3 rounded mt-2">
                      <code>{JSON.stringify(endpoint.example.body, null, 2)}</code>
                    </pre>
                    <button
                      className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2"
                      onClick={() => copyToClipboard(JSON.stringify(endpoint.example.body, null, 2), `body-${idx}`)}
                    >
                      {copied === `body-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="example-section mt-3">
                <strong>Example Response:</strong>
                <div className="position-relative">
                  <pre className="bg-dark text-light p-3 rounded mt-2">
                    <code>{JSON.stringify(endpoint.example.response, null, 2)}</code>
                  </pre>
                  <button
                    className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2"
                    onClick={() => copyToClipboard(JSON.stringify(endpoint.example.response, null, 2), `res-${idx}`)}
                  >
                    {copied === `res-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default APIDocumentation;

