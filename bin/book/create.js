import path from "path";
import { promises as fs } from "fs";
import prompts from "prompts";
import { config } from "./../config.js";
import fetch from "node-fetch";
import sharp from "sharp";
import imagemin from "imagemin";
import imageminJpegtran from "imagemin-jpegtran";


const download = async (url, path) => {
  // fetch image
  const response = await fetch(url);
  // convert to response buffer
  const buffer = await response.arrayBuffer();
  // resize image, keep as buffer
  const resizedBuffer = await sharp(Buffer.from(buffer)).resize({height: 200}).toBuffer()
  // compress image, keep as buffer
  const compressedImage = await imagemin.buffer(resizedBuffer, {
    destination: path,
    plugins: [imageminJpegtran({quality: [0.6, 0.8]})]
  })
  // save buffer to image
  fs.writeFile(path, compressedImage, () =>
    console.log("finished downloading!")
  );
}

export const bookCreate = async () => {
  // repo path - where files are going to go
  const repoPath = config.repoPath;

  // Grab and parse books.json
  const booksPath = path.join(repoPath, "src/_data/books.json");
  const allBooks = await fs
    .readFile(booksPath, { encoding: "utf-8" })
    .then((res) => JSON.parse(res));

  // Ask a bunch of questions
  const bookQuestions = [
    {
      type: "text",
      name: "title",
      message: "* Title",
      validate: (title) =>
        !title.length
          ? "Title is required"
          : allBooks.find((book) => book.title === title)
          ? "Title Must be unique"
          : true,
    },
    {
      type: "text",
      name: "subtitle",
      message: "Subtitle",
    },
    {
      type: "text",
      name: "author",
      message: "* Author",
      validate: (author) => (!author.length ? "Author is required" : true),
    },
    {
      type: "number",
      name: "pages",
      message: "* Pages",
      min: 0,
      validate: (pages) => (pages < 0 ? "Pages is required" : true),
    },
    {
      type: "text",
      name: "imageUrl",
      message: "URL for the image",
    },
    {
      type: "text",
      name: "url",
      message: "URL",
    },
  ];

  const book = await prompts(bookQuestions);

  // Download, resize, convert, compress image if there is one
  if (book.imageUrl) {
    // get new filename
    const fileName =
      book.title
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join("") + ".jpg";

    book.image = fileName;

    // define where we want the image
    const imagePath = path.join(repoPath, "src", "img", "books", fileName);

    await download(book.imageUrl, imagePath);
  }

  // remove temporary image url
  delete book.imageUrl;

  // Subtitle is optional, so remove it if it doesn't exist
  if (!book.subtitle) {
    delete book.subtitle
  }

  // URL is optional, so remove it if it doesn't exists
  if (!book.url) {
    delete book.url;
  }

  // write to the JSON  file only if required fields are met
  if (book.title && book.author && book.pages) {
    const updatedBooks = [book, ...allBooks];
    fs.writeFile(booksPath, JSON.stringify(updatedBooks, null, 2));
  }

};
