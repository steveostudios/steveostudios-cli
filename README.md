# CLI for my site

My [site](https://steveostudios.com) runs on Eleventy, and there are some things that I do regularly that I thought would be helpful to update via a command-line instead of by hand. Plus I wanted to write a CLI tool.

## Installation

Not quite sure yet. From this git directory I just ran `npm i site -g`. Not sure if I am going to make this a legit package or not.
## Books

As I have been reading more, it's fun to update where I am almost daily. Here are some cool tools to do that! Each of these shows prompts to make things faster.

The books data on my site is just a JSON file, so this updates the file directly.

### New Book

```shell
$ site book new
```

This will prompt for all of the questions in order to add a new book to my collection. This doesn't yet _start_ a book, just get it on the proverbial nightstand!

One cool thing is that it will as for a URL and an image URL. For the image URL it will download the image, resize, convert to JPG and compress it for my site.

### Start a book

```shell
$ site book start
```

I've picked up a new book, cracked it open and started a few pages.

The will look at all of the books I have not yet started, move it to the "currently reading" and note the date

### Read a book

```shell
$ site book read
```

This will look at all of the books I am in the middle of and ask which book and where I'm at.

### Finish a book

```shell
$ site book finish
```

This will move a book to the "finished" state, and log the necessary things. Next I need it to do some sort of happy dance!
