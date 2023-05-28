from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# Charger la base de connaissances depuis le fichier JSON
with open('knowledge_base.json', 'r') as f:
    knowledge_base = json.load(f)

# Récupérer la liste des questions et réponses
question_answer_pairs = knowledge_base['questions']

# Fonction pour rechercher la réponse à une question
question_answer_dict = {pair['question'].lower(): pair['answer'] for pair in knowledge_base['questions']}

def get_answer(question):
    return question_answer_dict.get(question.lower(), "Désolé, je n'ai pas de réponse à cette question.")

# Route principale pour afficher la page d'accueil
@app.route('/')
def home():
    return render_template('index.html')

# Route pour gérer les requêtes POST
@app.route('/ask', methods=['POST'])
def ask():
    # Obtenir la question à partir des données POST
    question = request.form['question']

    # Rechercher la réponse dans la base de connaissances
    answer = get_answer(question)

    # Retourner la réponse sous forme de JSON
    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)