const express = require('express');
const multer = require('multer');
const Comment = require('../schemas/commentSchema');
const upload = require('../config/multerconfig');

const commentRouter = express.Router();

commentRouter.get('/', (req, res) => {
    Comment.find()
        .then((result) => res.status(200).json(result))
        .catch((err) => res.status(500).json({ messege: 'Server error' }));
});

commentRouter.post('/', upload.array('file'), async (req, res) => {
    // Access the uploaded file using req.file
    const { name, comment } = req.body;
    const fileNames = req.files.map((file) => file.filename);
    const newComment = new Comment({
        name,
        comment,
        image: fileNames,
    });

    try {
        const savedComment = await newComment.save();

        console.log(savedComment);
        res.status(200).json({
            messege: 'Comment uploded successfully',
            data: savedComment,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ messege: 'Server error' });
    }
});

module.exports = commentRouter;
