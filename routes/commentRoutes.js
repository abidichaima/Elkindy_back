const express = require("express");
const { getById,getComments,createComment, getAllComment ,addReply,deleteReply,deleteComment, updateComment,updateReply} = require("../controllers/commentController");
const Router = express.Router();


Router.post("/:eventId/createComment",createComment)
Router.get("/:eventId/comments",getAllComment)
Router.put('/:commentId/reply', addReply)
Router.delete('/:commentId/replies/:replyId', deleteReply)
Router.delete('/:commentId/delete', deleteComment)

Router.put('/:commentId/update', updateComment )
Router.put('/:commentId/reply/:replyId/update', updateReply)
Router.get("/",getComments)
Router.get("/:commentId",getById)



module.exports = Router;