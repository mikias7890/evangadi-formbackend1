const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

const getAnswer = async (req, res) => {
  const { questionid } = req.params;
  const username = req.user.username;
  //   req.params.questionid: Extracts the questionid from the URL parameters. For example, in a request to /questions/42/answers, questionid will be 42.
  // req.user.username: Extracts the username from the req.user object (likely set by some authentication middleware, e.g., after token validation). This will later be used to populate the username in the response.
  try {
    const [answers] = await dbConnection.query(
      "SELECT answerid  AS answer_id,answer AS content,created_at,? as user_name FROM answers where questionid= ?",
      [username, questionid]
    );
    //     Executes an SQL query to fetch answers related to the specific question from the answers table.
    // ? Placeholders: These represent parameters that will be substituted by the username and questionid values. This helps prevent SQL injection attacks.
    // ? as user_name: The username is passed as part of the query to return the same username for each answer in the response.
    // The query retrieves:
    // answerid: Renamed as answer_id in the output.
    // answer: The content of the answer, renamed as content.
    // created_at: The timestamp when the answer was created.
    // user_name: Injects the username from the authenticated user.

    if (answers.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "The requested question could not be found.",
      });
    } else {
      return res.status(StatusCodes.OK).json({ answers: answers });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred",
    });
  }
};

const postAnswers = async (req, res) => {
  const { questionid, answer } = req.body;
  //   req.body.questionid: Extracts the questionid from the body of the request (likely in JSON format).
  // req.body.answer: Extracts the content of the answer from the request body.
  console.log(req.body);
  if (!answer || !questionid) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide an answer" });
  }

  try {
    const userid = req.user.userid;

    await dbConnection.query(
      "INSERT INTO answers (userid, questionid, answer) VALUES (?, ?, ?)",
      [userid, questionid, answer]
    );
    //     req.user.userid: Retrieves the authenticated user's userid from the request (likely set by authentication middleware).
    // Executes an INSERT query to add a new row into the answers table:
    // userid: The user posting the answer.
    // questionid: The question to which the answer belongs.
    // answer: The content of the answer.

    res.status(StatusCodes.CREATED).json({ msg: "Answer posted successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "An unexpected error occurred." });
  }
};
module.exports = { postAnswers, getAnswer };
