const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ message: "Failed to create quiz" });
  }
};

const listCourseQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId }).sort({ createdAt: -1 }).lean();

    if (req.user.role === "student") {
      const sanitized = quizzes.map((quiz) => ({
        ...quiz,
        questions: quiz.questions.map((question) => ({
          _id: question._id,
          question: question.question,
          options: question.options,
        })),
      }));
      return res.json(sanitized);
    }

    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const score = quiz.questions.reduce((total, question, index) => {
      return total + (answers[index] === question.correctIndex ? 1 : 0);
    }, 0);

    const attempt = await QuizAttempt.create({
      quiz: quiz._id,
      student: req.user._id,
      answers,
      score,
    });

    res.json({
      score,
      total: quiz.questions.length,
      attempt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit quiz" });
  }
};

const myAttempts = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user._id })
      .populate({ path: "quiz", populate: { path: "course" } })
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attempts" });
  }
};

module.exports = { createQuiz, listCourseQuizzes, submitQuiz, myAttempts };
