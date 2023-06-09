from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)
with open('knowledge_base.json', 'r') as f:
    knowledge_base = json.load(f)

question_answer_pairs = knowledge_base['questions']

question_answer_dict = {pair['question'].lower(): pair['answer'] for pair in knowledge_base['questions']}

def get_answer(question):
    return question_answer_dict.get(question.lower(), "Désolé, je n'ai pas de réponse à cette question.")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    question = request.form['question']
    answer = get_answer(question)
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)
