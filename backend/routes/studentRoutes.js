const express = require('express');
const router = express.Router();
const {
  getStudents,
  addStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
  checkUsn,
  bulkDelete,
  clearAll
} = require('../controllers/studentController');

router.route('/')
  .get(getStudents)
  .post(addStudent)
  .delete(clearAll);

router.get('/check-usn/:usn', checkUsn);
router.post('/bulk-delete', bulkDelete);

router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;