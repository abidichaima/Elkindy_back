const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
    {
        name:{
            type: String,
        },
        capacity:{
            type: String,
        }
       
    }
);
module.exports = mongoose.model("classroom", classroomSchema);
