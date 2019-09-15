# Octowatcher 

[Website](https://octowatcher.me/)

Octowatcher is a simple app for following Github issues and pull requests assigned to you. The main idea is to have 
everything at hand without the necessity to open and review all issues for checking the status. The tool allows to 
preload and review the issue/PR events such as comments, labels, reviews, etc inline. 
By clicking on the "Updated" icon of an issue, the issue will be marked as "Updated" and this status will be preserved
until a new update for the issue/PR occurs. So you can mark the issues you have already reviewed and easily see if there
is any update for the issue. 

## Usage

The tool is free, you can use either the hosted solution available at [http://octowatcher.me](http://octowatcher.me) 
or you can install it on your own server. You don't need to register or perform the authorization process, simply put 
your Github username and ring the bell. 

## On-premise installation 

### Prerequisites

-  Node >= 8.10 (for building the app)

### Installation

- Clone the repository

```bash
$ git clone git@github.com:rogyar/octowatcher.git .
```

- Install app dependencies

```bash
$ npm install
```

- Run the build process

```bash
$ npm run build
```

Now you can run the application. If you prefer using a separate web-server such as Nginx, simply use the `build/` 
directory of the application as the document root. 

## Project contribution 

Feel free to pick-up any of the existing [issues](https://github.com/rogyar/octowatcher/issues) (or create your own if 
you found a bug or have some thoughts on how the functionality can be improved). Then we will be waiting for your 
pull request.   
