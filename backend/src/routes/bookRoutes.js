
import express from 'express';
import cloudinary from '../lib/cloudinary.js';
import Book from '../models/Book.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

// add book route
router.post("/", protectRoute ,async(req,res)=>{
    try {

        const {title,caption,rating,image} = req.body;


        if (!title || !caption || !rating || !image) 
            {
            return res.status(400).json({message: "Please fill all fields"});
            }
         //upload the image to cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(image);
            const imageUrl = uploadedResponse.secure_url;
          
         //save to the database
         const newbook = new Book({
             title,
             caption,
             rating,
             image:imageUrl,
             user:req.user._id,
         });
        
         await newbook.save();   

         res.status(201).json(newbook);
        
           
    } catch (error) {

        console.log("Error in add book route",error);
        res.status(500).json({message: "Internal Server error"});
    }
}
);




// pagination => infinite loading
router.get("/", protectRoute,  async(req,res)=>{
    //example call from react native - frontend
    // const response=await fetch("http://localhost:3000/api/books?page=3&limit=5");
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });

    } catch (error) {

        console.log("Error in get all books route",error);
        res.status(500).json({message: "Internal Server error"});
    }
});



export default router;