require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const cors = require("cors");
app.use(cors());
// app.use(cors()): This applies the CORS middleware globally, allowing your API to accept requests from other origins.
// db connection
const dbConnection = require("./db/dbConfig");

//user routes middleware file
const userRoutes = require("./routes/userRoute");
//question routes middleware file
const questionsRoute = require("./routes/questionRoute");
//answer routes middleware file
const answerRoute = require("./routes/answerRoute");

//authentication middleware
const authMiddleware = require("./middleware/authMiddleware");
app.use(express.json());
// express.json(): This middleware automatically parses incoming JSON payloads (from POST, PUT, etc.) and makes the data available in req.body.

//user routes mddleware
app.use("/api/user", userRoutes);
// This middleware mounts the user routes under the /api/user path. Any requests that start with /api/user will be handled by the logic inside the userRoutes file.

//questions routes middleware ??
app.use("/api/questions", authMiddleware, questionsRoute);
// The /api/questions route is protected by the authMiddleware, meaning users must be authenticated to access the routes related to questions.
// After authentication, the request will be passed to questionsRoute for further handling.

// answers routes middleware??
app.use("/api/answer", authMiddleware, answerRoute);
// Similar to the question routes, the /api/answer path is protected by authMiddleware. Users must be authenticated to access any endpoints related to answers

async function start() {
  try {
    const result = await dbConnection.execute("SELECT 'Test'");
    // console.log(result);
    await app.listen(port);
    console.log("database connection established");
    console.log(`listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}

start();
// start(): This asynchronous function is responsible for connecting to the database and starting the Express server.
// dbConnection.execute("SELECT 'Test'"): This is a database query that tests the connection to the database by selecting the string 'Test'. It ensures the database connection works before starting the server.
// app.listen(port): Starts the Express server on the defined port (5500 in this case).
// Error Handling: If the database connection or server startup fails, the error message is logged.
