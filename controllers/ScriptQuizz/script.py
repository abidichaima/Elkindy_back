from pymongo import MongoClient
import sys
import json
import torch
from sentence_transformers import SentenceTransformer, util

# Charger un modèle pré-entraîné
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

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

def get_question_texts(question_ids):
    try:
        # Connexion à la base de données MongoDB
        client = MongoClient("mongodb+srv://artweb:elkindy@elkindy.awubkgs.mongodb.net/")
        db = client.get_database("test")
        question_collection = db.get_collection("questions")
        
        # Récupération des textes des questions depuis la collection MongoDB
        question_texts = []
        for question_id in question_ids:
            question = question_collection.find_one({"_id": question_id})
            if question:
                question_texts.append(question.get("ennonce", ""))
        return question_texts
    
    except Exception as e:
        print("An error occurred while getting question texts:", e)
        return []

def get_similarity_score(question1, question2):
    # Encoder les phrases en vecteurs de phrase
    embedding1 = model.encode(question1, convert_to_tensor=True)
    embedding2 = model.encode(question2, convert_to_tensor=True)

    # Calculer la similarité cosinus entre les vecteurs de phrase
    similarity_score = util.pytorch_cos_sim(embedding1, embedding2)

    return similarity_score.item()

def get_similar_quizzes(questions_passed, similarity_threshold=0.6):
    similar_quizzes = set()
    quizzes = get_quiz_from_mongodb()
    for quiz in quizzes:
        total_similarity_score = 0
        total_questions = len(questions_passed)
        for question_id in quiz["questions"]:
            question = get_question_texts([question_id])
            if question:
                for passed_question in questions_passed:
                    if passed_question.strip() and question[0].strip():
                        similarity_score = get_similarity_score(passed_question, question[0])
                        total_similarity_score += similarity_score
                avg_similarity_score = total_similarity_score / total_questions
                if avg_similarity_score > similarity_threshold:
                    similar_quizzes.add(quiz.get("titre"))
                    break  # Sortir de la boucle intérieure dès qu'un quiz est ajouté
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

    # Créer les données à envoyer
    data = {"similarQuizzes": similar_quizzes_list}
    print("Données envoyées dans le fichier JSON :", data)

    # Écrire les données dans un fichier JSON
    with open('controllers/similar_quizzes.json', 'w') as file:
        json.dump(data, file)

if __name__ == "__main__":
    main()
