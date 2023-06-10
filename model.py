from sklearn.svm import LinearSVC

class QuestionAnswerModel:
    def __init__(self):
        self.model = LinearSVC()

    def train(self, data):
        vectorized_questions = data['vectorized_questions']
        encoded_answers = data['encoded_answers']

        self.model.fit(vectorized_questions, encoded_answers)

    def predict(self, question):
        predicted_answer = self.model.predict(question)
        return predicted_answer
