import path from "path";
import { promises as fs } from "fs";
import prompts from "prompts";
import { config } from "./../config.js";

export const bookStart = async () => {
  // repo path - where files are going to go
  const repoPath = config.repoPath;

  // Grab and parse books.json
  const booksPath = path.join(repoPath, "src/_data/books.json");
  const allBooks = await fs
    .readFile(booksPath, { encoding: "utf-8" })
    .then((res) => JSON.parse(res));

  // Grab the books that are crisp and waiting on the shelf
  const unstartedBooks = await allBooks.filter((item) => !item.dateStart);

  // Bunch of questions for the book
  const bookQuestions = [
    {
      type: "select",
      name: "title",
      message: "* Which book did you read?",
      choices: unstartedBooks.map((book) => {
        return {
          title: `${book.title} [0/${book.pages}]`,
          value: book.title,
        };
      }),
    },
    {
      type: "date",
      name: "dateStart",
      message: "* When did you start?",
      initial: new Date(),
      mask: "YYYY-MM-DD",
    },
    {
      type: "number",
      name: "page",
      message: (prev, values) =>
        `* What page are you on? (max: ${
          unstartedBooks.find((item) => item.title == values.title).pages
        })`,
      min: 0,
      max: (prev, values) =>
        unstartedBooks.find((item) => item.title == values.title).pages,
      validate: (page) =>
        page < 0 ? "You must be on at least page 0 to start a book" : true,
    },
  ];

  const book = await prompts(bookQuestions);

  // write to the JSON  file only if required fields are met
  if (book.title && book.dateStart && book.page) {
    // update only the book with a matching title
    const updatedBooks = allBooks.map((item) => {
      if (item.title === book.title) {
        return {
          ...item,
          progress: book.page,
          dateStart: book.dateStart.toISOString().split("T")[0],
        };
      } else {
        return item;
      }
    });

    fs.writeFile(booksPath, JSON.stringify(updatedBooks, null, 2));
  }
};
