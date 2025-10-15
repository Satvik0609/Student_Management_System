import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students';

export const getStudents = async ({ q = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = {}) => {
  try {
    const params = { q, sortBy, sortOrder, page, limit };
    const response = await axios.get(API_URL, { params });
    return response.data; // { items, total, page, limit }
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await axios.post(API_URL, studentData);
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

export const checkUsn = async (usn) => {
  try {
    const response = await axios.get(`${API_URL}/check-usn/${encodeURIComponent(usn)}`);
    return response.data; // { exists: boolean }
  } catch (error) {
    console.error('Error checking USN:', error);
    throw error;
  }
};

export const bulkDelete = async (ids) => {
  try {
    const response = await axios.post(`${API_URL}/bulk-delete`, { ids });
    return response.data; // { deletedCount }
  } catch (error) {
    console.error('Error bulk deleting students:', error);
    throw error;
  }
};

export const clearAll = async () => {
  try {
    const response = await axios.delete(API_URL);
    return response.data; // { deletedCount }
  } catch (error) {
    console.error('Error clearing all students:', error);
    throw error;
  }
};

// Backward compatibility exports
export const getAllStudents = async () => {
  const data = await getStudents({ page: 1, limit: 1000 });
  return data.items;
};