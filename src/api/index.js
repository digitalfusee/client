import axios from "axios";

let API_URL = "https://digitalfuse.onrender.com/api/";
if (window.location.hostname === "localhost") {
  API_URL = "https://localhost:7037/api/";
}

export const createAPIEndpoint = (endpoint) => {
  let baseURL = API_URL + endpoint + "/";
  return {
    fetchAll: () => axios.get(baseURL),
    fetchById: (id) => axios.get(baseURL + id),
    post: (newRecord) => axios.post(baseURL, newRecord),
    put: (id, updatedRecord) => axios.put(baseURL + id, updatedRecord),
    delete: (id) => axios.delete(baseURL + id),

    fetchByCourseId: (courseId) =>
      axios.get(API_URL + `courses/${courseId}/${endpoint}`),
    fetchTutorial: (courseId, tutorialId) =>
      axios.get(API_URL + `courses/${courseId}/tutorials/${tutorialId}`),
    fetchQuiz: (courseId, quizId) =>
      axios.get(API_URL + `courses/${courseId}/${endpoint}/${quizId}`),
    fetchQuestions: (courseId, quizId) =>
      axios.get(API_URL + `courses/${courseId}/quizzes/${quizId}/${endpoint}`),
    fetchQuestion: (courseId, quizId, questionId) =>
      axios.get(
        API_URL +
          `courses/${courseId}/quizzes/${quizId}/${endpoint}/${questionId}`
      ),

    postTutorial: (courseId, newRecord) =>
      axios.post(API_URL + `courses/${courseId}/tutorials`, newRecord),
    postQuiz: (courseId, newRecord) =>
      axios.post(API_URL + `courses/${courseId}/quizzes`, newRecord),
    postQuestion: (courseId, quizId, newRecord) =>
      axios.post(
        API_URL + `courses/${courseId}/quizzes/${quizId}/questions`,
        newRecord
      ),

    putTutorial: (courseId, tutorialId, updatedRecord) =>
      axios.put(
        API_URL + `courses/${courseId}/tutorials/${tutorialId}`,
        updatedRecord
      ),
    putQuiz: (courseId, quizId, updatedRecord) =>
      axios.put(
        API_URL + `courses/${courseId}/quizzes/${quizId}`,
        updatedRecord
      ),
    putQuestion: (courseId, quizId, questionId, updatedRecord) =>
      axios.put(
        API_URL +
          `courses/${courseId}/quizzes/${quizId}/questions/${questionId}`,
        updatedRecord
      ),

    deleteTutorial: (courseId, tutorialId) =>
      axios.delete(API_URL + `courses/${courseId}/tutorials/${tutorialId}`),
    deleteQuiz: (courseId, quizId) =>
      axios.delete(API_URL + `courses/${courseId}/quizzes/${quizId}`),
    deleteQuestion: (courseId, quizId, questionId) =>
      axios.delete(
        API_URL +
          `courses/${courseId}/quizzes/${quizId}/questions/${questionId}`
      ),
  };
};

export const ENDPOINTS = {
  instructors: "instructors",
  registerInstructor: "instructors/register",
  loginInstructor: "instructors/login",
  viewInstructor: "instructors/:instructorId",
  editInstructor: "instructors/edit",
  deleteInstructor: "instructors/delete",

  students: "students",
  registerStudent: "students/register",
  loginStudent: "students/login",
  viewStudent: "students/:studentId",
  editStudent: "students/edit",
  deleteStudent: "students/delete",

  courses: "courses",
  addCourse: "courses/add",
  viewCourse: "courses/:courseId",
  editCourse: "courses/edit",
  deleteCourse: "courses/delete",

  tutorials: "tutorials",
  addTutorial: "tutorials/add",
  viewTutorial: "tutorials/:tutorialId",
  editTutorial: "tutorials/edit",
  deleteTutorial: "tutorials/delete",

  quizzes: "quizzes",
  addQuiz: "quizzes/add",
  viewQuiz: "quizzes/:quizId",
  editQuiz: "quizzes/edit",

  questions: "questions",
  addQuestion: "questions/add",
  viewQuestion: "questions/:questionId",
  editQuestion: "questions/edit",
  deleteQuestion: "questions/delete",
};
