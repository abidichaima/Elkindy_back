const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
        event_id: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        userid: {
            type: Schema.Types.ObjectId,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        replies: [{
            userid: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            username: {
                type: String,
                required: true,
            },
            commentId: {
                type: Schema.Types.ObjectId,
                required: true,
            },
            reply: {
                type: String,
                required: true,
            },
             CreatedAt : {
                type: Date,
                default: new Date().getTime(),
            }
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);