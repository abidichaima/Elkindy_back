const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        type:{
            type: String,
        },
        student_number:{
            type: Number,
        },
        individual:{
            type: Boolean,
        },
        niveau:{
            type: String,
        }
    }
);
module.exports = mongoose.model("Course", courseSchema);
