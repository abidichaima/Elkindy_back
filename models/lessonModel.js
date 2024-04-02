const mongoose = require('mongoose');

    const lessonSchema = new mongoose.Schema({
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        startLessonDate: { type: Date, required: true },
        endLessonDate: { type: Date, required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        typeLesson: { type: String, required: true },
        classRoom: { type: String }

    });

module.exports = mongoose.model('Lesson', lessonSchema);