import path from "path";
import { promises as fs } from "fs";
import prompts from "prompts";
import { config } from "./../config.js";

export const bookFinish = async () => {
  // repo path - where files are going to go
  const repoPath = config.repoPath;

  // Grab and parse books.json
  const booksPath = path.join(repoPath, "src/_data/books.json");
  const allBooks = await fs
    .readFile(booksPath, { encoding: "utf-8" })
    .then((res) => JSON.parse(res));

  // Grab all unfinished books
  const unfinishedBooks = await allBooks.filter((item) => item.progress);

  // Ask a bunch of questions
  const bookQuestions = [
    {
      type: "select",
      name: "title",
      message: "Which book did you finish?",
      choices: unfinishedBooks.map((book) => {
        return {
          title: `${book.title}`,
          value: book.title,
        };
      }),
    },
    {
      type: "date",
      name: "dateFinish",
      message: "When did you finish?",
      initial: new Date(),
      mask: "YYYY-MM-DD",
    },
  ];

  const book = await prompts(bookQuestions);

  // write to the JSON  file only if required fields are met
  if (book.title && book.dateFinish) {
    const updatedBooks = allBooks.map((item) => {
      if (item.title === book.title) {
        delete item.progress;
        return {
          ...item,
          dateFinish: book.dateFinish.toISOString().split("T")[0],
        };
      } else {
        return item;
      }
    });
    fs.writeFile(booksPath, JSON.stringify(updatedBooks, null, 2));
  }
};
