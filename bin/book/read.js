import path from "path";
import { promises as fs } from "fs";
import prompts from "prompts";
import { config } from "./../config.js";

export const bookRead = async () => {
  // repo path - where files are going to go
  const repoPath = config.repoPath;

  // Grab and parse books.json
  const booksPath = path.join(repoPath, "src/_data/books.json");
  const allBooks = await fs
    .readFile(booksPath, { encoding: "utf-8" })
    .then((res) => JSON.parse(res));

  // Grab only unread books
  const unreadBooks = await allBooks.filter((item) => item.progress);

  // Ask a bunch of questions
  const bookQuestions = [
    {
      type: "select",
      name: "title",
      message: "* Which book did you read?",
      choices: unreadBooks.map((book) => {
        return {
          title: `${book.title} [${book.progress}/${book.pages}]`,
          value: book.title,
        };
      }),
    },
    {
      type: "number",
      name: "page",
      message: (prev, values) =>
        `* What page are you on? (max: ${
          unreadBooks.find((item) => item.title == values.title).pages
        })`,
      min: 0,
      max: (prev, values) =>
        unreadBooks.find((item) => item.title == values.title).pages,
    },
  ];

  const book = await prompts(bookQuestions);

  // write to the JSON  file only if required fields are met
  if (book.title && book.page) {
    // update only the book with a matching title
    const updatedBooks = allBooks.map((item) => {
      if (item.title === book.title) {
        return { ...item, progress: book.page };
      } else {
        return item;
      }
    });

    fs.writeFile(booksPath, JSON.stringify(updatedBooks, null, 2));
  }
};
