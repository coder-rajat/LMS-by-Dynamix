import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyQuestion = () => ({ question: "", options: ["", ""], correctIndex: 0 });

const Quizzes = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    course: "",
    title: "",
    questions: [emptyQuestion()],
  });

  const activeQuiz = useMemo(
    () => quizzes.find((quiz) => quiz._id === activeQuizId),
    [quizzes, activeQuizId]
  );

  useEffect(() => {
    if (!user) return;
    const endpoint = user.role === "student" ? "/courses/public" : "/courses";
    api.get(endpoint).then((res) => {
      setCourses(res.data);
      if (res.data.length) {
        setSelectedCourseId(res.data[0]._id);
      }
    });
    if (user.role === "student") {
      api.get("/quizzes/attempts/mine").then((res) => setAttempts(res.data));
    }
  }, [user]);

  useEffect(() => {
    if (!selectedCourseId) return;
    api.get(`/quizzes/course/${selectedCourseId}`).then((res) => setQuizzes(res.data));
  }, [selectedCourseId]);

  const handleCreate = async (event) => {
    event.preventDefault();
    await api.post("/quizzes", form);
    setForm({ course: "", title: "", questions: [emptyQuestion()] });
    if (form.course) {
      setSelectedCourseId(form.course);
    }
  };

  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, emptyQuestion()] });
  };

  const removeQuestion = (index) => {
    const next = form.questions.filter((_, i) => i !== index);
    setForm({ ...form, questions: next.length ? next : [emptyQuestion()] });
  };

  const updateQuestion = (index, patch) => {
    const next = form.questions.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setForm({ ...form, questions: next });
  };

  const addOption = (index) => {
    const question = form.questions[index];
    updateQuestion(index, { options: [...question.options, ""] });
  };

  const removeOption = (index, optionIndex) => {
    const question = form.questions[index];
    const options = question.options.filter((_, i) => i !== optionIndex);
    const correctIndex = Math.min(question.correctIndex, Math.max(0, options.length - 1));
    updateQuestion(index, { options: options.length ? options : [""], correctIndex });
  };

  const startQuiz = (quizId) => {
    setActiveQuizId(quizId);
    setActiveIndex(0);
    const quiz = quizzes.find((item) => item._id === quizId);
    setAnswers(Array(quiz?.questions.length || 0).fill(null));
    setResult(null);
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    const payload = answers.map((answer) => (answer === null ? -1 : answer));
    const { data } = await api.post(`/quizzes/${activeQuiz._id}/submit`, { answers: payload });
    setResult(data);
    api.get("/quizzes/attempts/mine").then((res) => setAttempts(res.data));
  };

  return (
    <div className="grid">
      {(user?.role === "teacher" || user?.role === "admin") && (
        <div className="card">
          <h3>Create quiz</h3>
          <form className="form-grid" onSubmit={handleCreate}>
            <label>
              Course
              <select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                required
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
            <div className="divider" />
            {form.questions.map((question, index) => (
              <div key={`q-${index}`} className="question-card">
                <div className="card-header">
                  <h4>Question {index + 1}</h4>
                  <button type="button" className="ghost" onClick={() => removeQuestion(index)}>
                    Remove
                  </button>
                </div>
                <label>
                  Prompt
                  <input
                    value={question.question}
                    onChange={(e) => updateQuestion(index, { question: e.target.value })}
                    required
                  />
                </label>
                <div className="option-list">
                  {question.options.map((option, optionIndex) => (
                    <div key={`opt-${optionIndex}`} className="option-row">
                      <input
                        value={option}
                        onChange={(e) => {
                          const options = question.options.map((item, idx) =>
                            idx === optionIndex ? e.target.value : item
                          );
                          updateQuestion(index, { options });
                        }}
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                      />
                      <label className="radio">
                        <input
                          type="radio"
                          name={`correct-${index}`}
                          checked={question.correctIndex === optionIndex}
                          onChange={() => updateQuestion(index, { correctIndex: optionIndex })}
                        />
                        Correct
                      </label>
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => removeOption(index, optionIndex)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" className="ghost" onClick={() => addOption(index)}>
                  Add option
                </button>
              </div>
            ))}
            <div className="row-actions">
              <button type="button" className="ghost" onClick={addQuestion}>
                Add question
              </button>
              <button className="primary" type="submit">
                Save quiz
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Available quizzes</h3>
          <select value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
            <option value="">Select course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="list">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="list-row">
              <div>
                <h4>{quiz.title}</h4>
                <p>{quiz.questions.length} questions</p>
              </div>
              {user?.role === "student" && (
                <button className="primary" onClick={() => startQuiz(quiz._id)}>
                  Start
                </button>
              )}
            </div>
          ))}
          {!quizzes.length && <p>No quizzes available for this course.</p>}
        </div>
      </div>

      {user?.role === "student" && activeQuiz && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3>{activeQuiz.title}</h3>
              <p>
                Question {activeIndex + 1} of {activeQuiz.questions.length}
              </p>
            </div>
            <span className="pill">In progress</span>
          </div>
          <div className="question-block">
            <h4>{activeQuiz.questions[activeIndex].question}</h4>
            <div className="option-grid">
              {activeQuiz.questions[activeIndex].options.map((option, optionIndex) => (
                <label key={optionIndex} className="option-card">
                  <input
                    type="radio"
                    name={`answer-${activeIndex}`}
                    checked={answers[activeIndex] === optionIndex}
                    onChange={() => {
                      const next = [...answers];
                      next[activeIndex] = optionIndex;
                      setAnswers(next);
                    }}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="row-actions">
            <button
              className="ghost"
              onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
            >
              Previous
            </button>
            {activeIndex < activeQuiz.questions.length - 1 ? (
              <button
                className="primary"
                onClick={() => setActiveIndex((prev) => Math.min(activeQuiz.questions.length - 1, prev + 1))}
              >
                Next
              </button>
            ) : (
              <button className="primary" onClick={submitQuiz}>
                Submit quiz
              </button>
            )}
          </div>
          {result && (
            <div className="result">
              <h4>Score</h4>
              <p>
                You scored {result.score} out of {result.total}.
              </p>
            </div>
          )}
        </div>
      )}

      {user?.role === "student" && (
        <div className="card">
          <div className="card-header">
            <h3>My attempts</h3>
            <button className="ghost" onClick={() => api.get("/quizzes/attempts/mine").then((res) => setAttempts(res.data))}>
              Refresh
            </button>
          </div>
          <div className="list">
            {attempts.map((attempt) => (
              <div key={attempt._id} className="list-row">
                <div>
                  <h4>{attempt.quiz?.title}</h4>
                  <p>{attempt.quiz?.course?.title}</p>
                </div>
                <span className="pill">Score {attempt.score}</span>
              </div>
            ))}
            {!attempts.length && <p>No attempts yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
