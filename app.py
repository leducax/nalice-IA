from flask import Flask, render_template, request, jsonify
import json
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import preprocess

app = Flask(__name__)

with open('knowledge_base.json', 'r') as f:
    knowledge_base = json.load(f)

preprocessor = preprocess.Preprocessor()
questions = [pair['question'] for pair in knowledge_base['questions']]
answers = [pair['answer'] for pair in knowledge_base['questions']]
preprocessed_questions = preprocessor.preprocess(questions)

tokenizer = Tokenizer()
tokenizer.fit_on_texts(preprocessed_questions)

encoded_questions = tokenizer.texts_to_sequences(preprocessed_questions)

max_sequence_length = max([len(seq) for seq in encoded_questions])
padded_questions = pad_sequences(encoded_questions, maxlen=max_sequence_length, padding='post')

model = Sequential()
model.add(LSTM(256, input_shape=(max_sequence_length,), return_sequences=True))
model.add(LSTM(256))
model.add(Dense(len(answers), activation='softmax'))
model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])

model.fit(padded_questions, np.array(answers), epochs=10)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    question = request.form['question']
    preprocessed_question = preprocessor.preprocess_question(question)
    encoded_question = tokenizer.texts_to_sequences([preprocessed_question])
    padded_question = pad_sequences(encoded_question, maxlen=max_sequence_length, padding='post')
    predicted_index = np.argmax(model.predict(padded_question)[0])
    answer = answers[predicted_index]
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)
