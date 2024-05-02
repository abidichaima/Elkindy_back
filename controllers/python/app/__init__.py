from flask import Flask, request, jsonify
from app.chatbot import get_llama_response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permet toutes les origines


@app.route('/chatbot', methods=['POST'])
def chatbot():
    # Obtenir les données du corps de la requête
    data = request.get_json()
    print("Données reçues du front-end:", data)

    # Extraire le message de l'utilisateur et l'historique
    message = data.get('message')
    history = data.get('history', [])
    print("Message reçu du front-end:", message)

    # Générer une réponse du chatbot
    response = get_llama_response(message, history)
    print("Message reçu par le chatbot:", message)


    # Renvoyer la réponse au format JSON
    return jsonify({'botResponse': response})

