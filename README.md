# SQLite-Library-Database
 
First thing I did was to initialize the project to use the express application generator by entering the following in the terminal: npx express-generator

Next, I installed sequelize,
sqlite3, and
pug with the following terminal commands - npm install sequelize sqlite3, and npm install pug

Then I initialized the Sequelize ORM by running these commands in the terminal - npm install sequelize-cli, npx sequelize init

I replaced the default config.js contents with the following - {
  "development": {
    "dialect": "sqlite",
    "storage": "library.db"
  },
  "test": {
    "dialect": "sqlite",
    "storage": "library.db"
  },
  "production": {
    "dialect": "sqlite",
    "storage": "library.db"
  }
}

Now I generated the book model by using the sequelize CLI and running the following in terminal - npx sequelize model:create --name Book --attributes title:string,author:string,genre:string,year:integer
