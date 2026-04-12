export function createUserSchema(uid, email, displayName) {
  return { uid, email, displayName, role: "user", photoURL: null };
}

export function createQuizSchema(title, description, category, authorId) {
  return { title, description, category, authorId, isPublished: false };
}

export function createQuestionSchema(text, options, correctIndex, points, order) {
  return { text, options, correctIndex, points, order };
}

export function createResultSchema(userId, quizId, score, maxScore, answers) {
  return {
    userId,
    quizId,
    score,
    maxScore,
    percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    answers,
  };
}
