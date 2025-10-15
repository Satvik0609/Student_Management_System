const Student = require('../models/Student');

// GET /api/students
// Supports: search (q), sortBy, sortOrder, page, limit
const getStudents = async (req, res) => {
  try {
    const {
      q,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 1000 // frontend will use pagination; keep high default for backward compat
    } = req.query;

    const query = {};
    if (q) {
      const text = String(q).trim();
      const regex = new RegExp(text, 'i');
      query.$or = [
        { name: regex },
        { usn: regex },
        { department: regex },
        // Allow searching numeric marks and subject scores by string inclusion
        { marks: { $exists: true, $ne: null } }
      ];
    }

    const numericSortOrder = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;
    const sort = { [sortBy]: numericSortOrder };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const [items, total] = await Promise.all([
      Student.find(query).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum),
      Student.countDocuments(query)
    ]);

    res.status(200).json({ items, total, page: pageNum, limit: limitNum });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/students
const addStudent = async (req, res) => {
  try {
    // Remove legacy 'marks' if present; we use 'subjects' now
    if ('marks' in req.body) delete req.body.marks;
    // Ensure USN uniqueness friendly message
    const existing = await Student.findOne({ usn: String(req.body.usn).toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'USN already exists' });
    }
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    if ('marks' in req.body) delete req.body.marks;
    // Prevent USN change to conflicting value
    if (req.body.usn && req.body.usn.toUpperCase().trim() !== student.usn) {
      const exists = await Student.findOne({ usn: String(req.body.usn).toUpperCase().trim() });
      if (exists) {
        return res.status(400).json({ message: 'USN already exists' });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Student removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/students/check-usn/:usn
const checkUsn = async (req, res) => {
  try {
    const usn = String(req.params.usn).toUpperCase().trim();
    const exists = await Student.exists({ usn });
    res.status(200).json({ exists: Boolean(exists) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/students/bulk-delete
const bulkDelete = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No ids provided' });
    }
    const result = await Student.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/students
const clearAll = async (req, res) => {
  try {
    const result = await Student.deleteMany({});
    res.status(200).json({ deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  addStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  checkUsn,
  bulkDelete,
  clearAll
};