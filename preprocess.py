from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder

class Preprocessor:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.label_encoder = LabelEncoder()

    def preprocess(self, data):
        questions = [pair['question'] for pair in data]
        answers = [pair['answer'] for pair in data]

        # Vectorisation des questions
        vectorized_questions = self.vectorizer.fit_transform(questions)

        # Encodage des réponses
        encoded_answers = self.label_encoder.fit_transform(answers)

        preprocessed_data = {
            'vectorized_questions': vectorized_questions,
            'encoded_answers': encoded_answers
        }

        return preprocessed_data

    def preprocess_question(self, question):
        vectorized_question = self.vectorizer.transform([question])
        return vectorized_question
