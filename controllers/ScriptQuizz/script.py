import spacy
from pymongo import MongoClient
import sys
import json
import requests  # Importer le module requests

# Charger le modèle de langue anglais
nlp = spacy.load("en_core_web_md")

def get_quiz_from_mongodb():
    try:
        # Connexion à la base de données MongoDB
        client = MongoClient("mongodb+srv://artweb:elkindy@elkindy.awubkgs.mongodb.net/")
        db = client.get_database("test")
        quiz_collection = db.get_collection("quizzs")
        
        # Récupération des quiz depuis la collection MongoDB
        quizzes = list(quiz_collection.find())
        return quizzes
    
    except Exception as e:
        print("An error occurred:", e)
        return []

def get_question_from_mongodb(question_id):
    try:
        # Connexion à la base de données MongoDB
        client = MongoClient("mongodb+srv://artweb:elkindy@elkindy.awubkgs.mongodb.net/")
        db = client.get_database("test")
        question_collection = db.get_collection("questions")
        
        # Récupération de la question depuis la collection MongoDB
        question = question_collection.find_one({"_id": question_id})
        return question
    
    except Exception as e:
        print("An error occurred while getting question:", e)
        return None
def calculate_similarity(question1, question2):
    doc1 = nlp(question1)
    doc2 = nlp(question2)
    return doc1.similarity(doc2)

def get_similar_quizzes(questions_passed, similarity_threshold=0.6):
    similar_quizzes = set()  # Utilisez un ensemble pour éviter les doublons
    quizzes = get_quiz_from_mongodb()  # Récupérer les quiz depuis MongoDB
    for quiz in quizzes:
        total_similarity_score = 0
        total_questions = len(questions_passed)
        for question_id in quiz["questions"]:
            question = get_question_from_mongodb(question_id)
            if question:
                for passed_question in questions_passed:
                    if passed_question.strip() and question.get("ennonce").strip():
                        similarity_score = calculate_similarity(passed_question, question.get("ennonce"))
                        total_similarity_score += similarity_score
        if total_questions != 0:  # Correction pour éviter la division par zéro
            avg_similarity_score = total_similarity_score / total_questions
        else:
            avg_similarity_score = 0
        if avg_similarity_score > similarity_threshold:  # Comparaison avec le seuil de similarité
            similar_quizzes.add(quiz.get("titre"))  # Ajoutez le titre du quiz
    return similar_quizzes

def main():
    if len(sys.argv) < 2:
        print("Veuillez fournir les questions du quiz en argument de la ligne de commande.")
        sys.exit(1)

    questions_passed = sys.argv[1:]
    
    # Afficher les questions passées en argument
    print("Questions du quiz:")
    for question in questions_passed:
        print("- ", question)
    
    # Trouver des quiz similaires
    similar_quizzes = get_similar_quizzes(questions_passed)

    if similar_quizzes:
        print("Voici quelques quiz similaires :")
        for quiz_title in similar_quizzes:
            print(f"- {quiz_title}")
            # Afficher plus d'informations sur le quiz si nécessaire
    else:
        print("Aucun quiz similaire trouvé.")
    
    similar_quizzes_list = list(similar_quizzes)

# Créez les données à envoyer
    data = {"similarQuizzes": similar_quizzes_list}
    print("Données envoyées dans le fichier JSON :", data)

# Écrivez les données dans un fichier JSON
    with open('controllers/similar_quizzes.json', 'w') as file:
        json.dump(data, file)


if __name__ == "__main__":
    main()