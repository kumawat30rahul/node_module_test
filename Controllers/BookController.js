import express from "express";
import { BookModel } from "../Models/BookModel.js";
import { isAuth } from "../Middlewares/isAuth.js";
import Books from "../Schema/BookSchema.js";
import Ratelimiting from "../Middlewares/rateLimiting.js";

const BookRouter = express.Router();

BookRouter.post("/add-books", Ratelimiting, async (req, res) => {
  const { title, author, price, category } = req.body;
  const { username } = req.session.user;
  console.log(username);

  if ((!title || !author, !price, !category)) {
    return res.send({
      status: 400,
      message: "Provide Proper Field",
    });
  }

  try {
    const bookdb = await BookModel.bookPresent({ title });
    res.redirect("back");
  } catch (error) {
    return res.send({
      status: 400,
      message: "Error Occured",
      error: error,
    });
  }

  const bookObj = new BookModel({
    title,
    author,
    price,
    category,
    userkaname: username,
  });

  try {
    console.log("book object", bookObj);
    const bookdb = await bookObj.addingBook();
  } catch (error) {
    return res.send({
      status: 400,
      message: "Database Error Occured",
      error: error,
    });
  }
});

BookRouter.get("/read-books", async (req, res) => {
  const { username } = req.session.user;

  try {
    const books = await Books.aggregate([{ $match: { userkaname: username } }]);
    return res.json(books);
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database Error",
      error: error,
    });
  }
});

BookRouter.post("/delete", Ratelimiting, async (req, res) => {
  const { id } = req.body;
  const username = req.session.user.username;

  const bookDb = await Books.findOne({ _id: id });

  if (!bookDb) {
    return res.send({
      status: 400,
      message: "Book Not Found",
    });
  }

  if (bookDb.userkaname !== username) {
    return res.send({
      status: 401,
      message: "Not allowed to delete, authorisation failed",
    });
  }

  try {
    const bookDb = await Books.findOneAndDelete({ _id: id });
    // console.log(todoDb);
    return res.send({
      status: 200,
      message: "Book deleted successfully",
      data: bookDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

BookRouter.post("/update", Ratelimiting, async (req, res) => {
  const { id ,title,author,category} = req.body;
  const username = req.session.user.username;

  const bookDb = await Books.findOne({ _id: id });

  if (!bookDb) {
    return res.send({
      status: 400,
      message: "Book Not Found",
    });
  }
  if (bookDb.userkaname !== username) {
    return res.send({
      status: 401,
      message: "Not allowed to delete, authorisation failed",
    });
  }

  try {
    const bookDb = await Books.findByIdAndUpdate(
      { _id: id },
      { title: title, author: author, category: category },
      { new: true }
    );
    // console.log(todoDb);
    return res.send({
      status: 200,
      message: "Book updated successfully",
    //   data: bookDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});
export default BookRouter;
