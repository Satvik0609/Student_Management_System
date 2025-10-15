const mongoose = require('mongoose');

const SUBJECT_NAMES = [
  'mathematics',
  'physics',
  'chemistry',
  'english',
  'computerScience'
];

const subjectSchema = new mongoose.Schema({
  mathematics: { type: Number, min: 0, max: 100, required: true, default: 0 },
  physics: { type: Number, min: 0, max: 100, required: true, default: 0 },
  chemistry: { type: Number, min: 0, max: 100, required: true, default: 0 },
  english: { type: Number, min: 0, max: 100, required: true, default: 0 },
  computerScience: { type: Number, min: 0, max: 100, required: true, default: 0 }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  usn: { type: String, required: true, unique: true, uppercase: true, trim: true },
  department: { type: String, required: true, trim: true },
  // Legacy single marks field kept for backward compatibility; prefer subjects
  marks: { type: Number, min: 0, max: 100 },
  subjects: { type: subjectSchema, required: true, default: () => ({}) },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  dob: { type: Date },
  enrollmentDate: { type: Date, default: Date.now },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  address: { type: String, trim: true },
  photoUrl: { type: String, trim: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

studentSchema.virtual('totalMarks').get(function() {
  const sub = this.subjects || {};
  return SUBJECT_NAMES.reduce((sum, key) => sum + (Number(sub[key]) || 0), 0);
});

studentSchema.virtual('percentage').get(function() {
  // 5 subjects, each out of 100
  const totalPossible = SUBJECT_NAMES.length * 100;
  if (totalPossible === 0) return 0;
  return Number(((this.totalMarks / totalPossible) * 100).toFixed(2));
});

studentSchema.virtual('grade').get(function() {
  const p = this.percentage;
  if (p >= 90) return 'A+';
  if (p >= 80) return 'A';
  if (p >= 70) return 'B+';
  if (p >= 60) return 'B';
  if (p >= 50) return 'C';
  return 'F';
});

studentSchema.virtual('cgpa').get(function() {
  // Simple mapping: percentage/10
  return Number((this.percentage / 10).toFixed(2));
});

studentSchema.virtual('passStatus').get(function() {
  // Pass if all subjects >= 50 and percentage >= 50
  const sub = this.subjects || {};
  const allPass = SUBJECT_NAMES.every(key => (Number(sub[key]) || 0) >= 50);
  return allPass && this.percentage >= 50 ? 'Pass' : 'Fail';
});

// Basic validators for email and phone when provided
studentSchema.path('email').validate(function(value) {
  if (!value) return true;
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}, 'Invalid email address');

studentSchema.path('phone').validate(function(value) {
  if (!value) return true;
  return /^\d{10}$/.test(value);
}, 'Phone must be 10 digits');

const Student = mongoose.model('Student', studentSchema);

module.exports = Student; 