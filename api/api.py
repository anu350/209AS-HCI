# source https://medium.com/duomly-blockchain-online-courses/how-to-create-a-simple-rest-api-with-python-and-flask-in-5-minutes-94bb88f74a23
# also try:
# - https://levelup.gitconnected.com/full-stack-web-app-with-python-react-and-bootstrap-backend-8592baa6e4eb

from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS

import json

# old NLP version ------------------------------------------------------------------

# from pipelines import pipeline

# nlp = pipeline("question-generation",
#                model="valhalla/t5-small-qg-prepend", qg_format="prepend")
# ----------------------------------------------------------------------------------

from question_generator_mc import QuestionGenerator

nlp = QuestionGenerator()

app = Flask(__name__)
CORS(app)
api = Api(app)

NOTES = {
    '1': {
        'title': 'Note1',
        'content': 'fhsdjk',
        'tags': ['tag1', 'tag2'],
        'questions': {
            '1': {
                'q': 'question1?',
                'difficulty': 10
            },
            '2': {
                'q': 'question2?',
                'difficulty': 5
            }
        }
    },
    '2': {
        'title': 'Note2',
        'content': 'hffdshjkf',
        'tags': ['tag1', 'tag2'],
        'questions': {
            '1': {
                'q': 'question3?',
                'difficulty': 7
            },
            '2': {
                'q': 'question4?',
                'difficulty': 3
            }
        }
    },
}

SAMPLE_Qs = [
    {"question": "Why did the chicken cross the road?",
     "explanation": "HERE IS EXPLANATION",
     "answers":
         [{
             'answer': "answer 1",
             'correct': True,
         },
             {
             'answer' : "answer 2",
             'correct' : False,
         }]
     },
]

parser = reqparse.RequestParser()

        
class NoteList(Resource):
    def get(self):
        return NOTES

    def post(self):
        parser.add_argument("title")
        parser.add_argument("content")
        parser.add_argument("raw_json")
        parser.add_argument("num_questions")
        # parser.add_argument("tags")
        # parser.add_argument("questions")
        args = parser.parse_args()
        note_id = int(max(NOTES.keys())) + 1
        note_id = '%i' % note_id
        NOTES[note_id] = {
            'title': args['title'],
            'content': args['content'],
            'raw_json': args['raw_json'],
            'tags': [],
            'questions': []
        }
        # print('--------------------------\n\n\n')
        # print('args[raw_json]')
        # print(args['raw_json'])
        # print(NOTES[note_id]['raw_json'])
        thenote = json.loads(args['raw_json'])
        concat_note = ""
        for i in range(len(thenote["blocks"])):
            concat_note += thenote["blocks"][i]["text"]

        # output = nlp(concat_note)
        # print(args["num_questions"])

        ### During thie nlp.generate, return explanation 
        [qa_list, qg_hint, gen_questions] = nlp.generate(
            concat_note, answer_style="multiple_choice", num_questions=int(args["num_questions"]))
        
        # Get contexts by tag
        context= []
        for text in qg_hint:
            ar = text.split("<context>")
        context.append(ar[1])

        # Create dictionary with questions and hints
        question_hint_dict = {}

        for x in range(0,len(gen_questions)):
            question_hint_dict[gen_questions[x]] = context[x] 

        # Create a reduced set of question/hints - DONT REALLY NEED THIS DICT
        reduced_question_hint_dict = {}

        # Must check if its a substring since entries in dict may not exactly match
        for x in range(0, len(qa_list)):
            qa_list_str = qa_list[x]["question"] #Contains string of question being asked
            for question in  question_hint_dict:
                if (qa_list_str in question):
                    qa_list[x]["explanation"] = question_hint_dict[question]
                    reduced_question_hint_dict[qa_list_str] = question_hint_dict[question]    
    
        #Check if this works 
        #ind = 1
        #for question in reduced_question_hint_dict:
        #    print("Question", ind, ")", question)
        #    print("Context: ", reduced_question_hint_dict[question])
        #    print("\n")
        #    ind = ind +1

        return [NOTES[note_id], qa_list, 201]


class Note(Resource):
    def get(self, note_id):
        if note_id not in NOTES:
            return "not found", 404
        else:
            return NOTES[note_id]

    def put(self, note_id):
        parser.add_argument("title")
        parser.add_argument("content")
        # parser.add_argument("tags")
        # parser.add_argument("questions")
        args = parser.parse_args()
        if note_id not in NOTES:
            return "record not found", 404
        else:
            note = NOTES[note_id]
            note["title"] = args["title"] if args["title"] is not None else note["title"]
            note["content"] = args["content"] if args["content"] is not None else note["content"]
            # note["spec"] = args["spec"] if args["spec"] is not None else note["spec"]
            return note, 200

    def delete(self, note_id):
        if note_id not in NOTES:
            return "not found", 404
        else:
            del NOTES[note_id]
            return '', 204


class GenerateTags(Resource):
    def get(self, note_id):
        return "called gentags {}".format(note_id), 200


class GenerateQuestions(Resource):
    def get(self, note_id):
        return "called genqs {}".format(note_id), 200


# add routes
api.add_resource(NoteList, '/notes/')
api.add_resource(Note, '/notes/<note_id>')
api.add_resource(GenerateTags, '/notes/<note_id>/gentags')
api.add_resource(GenerateQuestions, '/notes/<note_id>/genqs')

if __name__ == "__main__":
    app.run(debug=True)
