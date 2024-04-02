const axios = require("axios");
const Comment = require("../models/CommentModel");

module.exports = {
    createComment: async (req, res) => {
        const id = req.params.eventId;
        const { comment, username, userid } = req.body;
        try {
            if (id) {
                const createdComment = await Comment.create({
                    event_id: id,
                    comment,
                    userid,
                    username: username ? username : 'admin'
                });
                res.status(201).json(createdComment);
            } else {
                res.status(404).json({ message: 'Comment with this event id not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    },

    getAllComment: async (req, res) => {
        const id = req.params.eventId;
        try {
            if (id) {
                const comments = await Comment.find({ event_id: id }).sort({ createdAt: 'desc' });
                res.json(comments);
            } else {
                res.status(404).json({ message: 'Comment with this event id not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    },
    getById: async (req, res) => {
        const id = req.params.commentId;
        try {
            if (id) {
                const comment = await Comment.find({ _id: id });
                res.json(comment);
            } else {
                res.status(404).json({ message: 'Comment with this event id not found' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    },
    getComments: async (req, res) => {
        try {
            const comments = await Comment.find();

            res.json(comments);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    addReply: async (req, res) => {
        let id = req.params?.commentId;
        try {
            if (id) {

                const reply = {
                    commentId: id,
                    userid: req.body?.userid,
                    username: req.body?.username,
                    reply: req.body?.reply,
                }

                let comment = await Comment.findByIdAndUpdate({ _id: id }, { $push: { replies: reply } }, { new: true })

                res.json(comment);

            } else {
                res.status(404).json({ message: 'Comment with this id not found!' })
            }

        } catch (error) {
            res.status(401).json({ message: 'Problem with Getting Comment From Server', error: error });
        }
    },

    deleteReply: async (req, res) => {
        let id = req.params?.commentId;
        let replyId = req.params?.replyId;
        try {
            if (id && replyId) {
                let comment = await Comment.findByIdAndUpdate({ _id: id }, { $pull: { replies: { _id: replyId } } }, { new: true },)
                res.json(comment);
            } else {
                res.status(404).json({ message: 'Event with this id not found!' })
            }

        } catch (error) {
            res.status(401).json({ message: 'Problem with Getting Comment From Server', error: error });
        }
    },

    deleteComment: async (req, res) => {
        const id = req.params.commentId;

        try {
            if (id) {
                const deletedComment = await Comment.findByIdAndDelete(id);

                if (deletedComment) {
                    res.status(200).json({ message: 'Comment deleted successfully', deletedComment });
                } else {
                    res.status(404).json({ message: 'Comment with this id not found!' });
                }
            } else {
                res.status(400).json({ message: 'Invalid comment ID' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Problem with deleting comment', error: error });
        }
    },

    updateComment: async (req, res) => {
        const id = req.params.commentId;
        const { comment } = req.body;

        try {
            if (id) {
                const updatedComment = await Comment.findByIdAndUpdate(id, { comment }, { new: true });

                if (updatedComment) {
                    res.status(200).json({ message: 'Comment updated successfully', updatedComment });
                } else {
                    res.status(404).json({ message: 'Comment with this id not found!' });
                }
            } else {
                res.status(400).json({ message: 'Invalid comment ID' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Problem with updating comment', error: error });
        }
    },

    updateReply: async (req, res) => {
        const commentId = req.params.commentId;
        const replyId = req.params.replyId;
        const { reply } = req.body;

        try {
            if (commentId && replyId && reply) {
                const updatedComment = await Comment.findOneAndUpdate(
                    { _id: commentId, "replies._id": replyId },
                    { $set: { "replies.$.reply": reply } },
                    { new: true }
                );

                if (updatedComment) {
                    res.status(200).json({ message: 'Reply updated successfully', updatedComment });
                } else {
                    res.status(404).json({ message: 'Comment or reply with this id not found!' });
                }
            } else {
                res.status(400).json({ message: 'Invalid comment ID or reply ID, or updated reply not provided' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Problem with updating reply', error: error });
        }
    }

};