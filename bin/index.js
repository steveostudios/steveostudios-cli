#! /usr/bin/env node

import { bookRead } from "./book/read.js";
import { bookCreate } from "./book/create.js";
import { bookStart } from "./book/start.js";
import { bookFinish } from "./book/finish.js";

const args = process.argv.slice(2);

const exit = () => {
  console.log("unknown command");
  process.exit(1);
}

if (args[0] === "book") {
  if (args[1] === "read" || args[1] === "r") {
    bookRead();
  } else if (args[1] === "new" || args[1] === "n") {
    bookCreate();
  } else if (args[1] === "start" || args[1] === "s") {
    bookStart();
  } else if (args[1] === "finish" || args[1] === "f") {
    bookFinish();
  } else {
    exit();
  }
} else {
  exit();
}
