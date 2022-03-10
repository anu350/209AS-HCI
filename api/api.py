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

SAMPLE_Qs = [
    {"question": "Why did the chicken cross the road?",
     "explanation": "a chunk from the source note",
     "answers":
         [{
             'answer': "answer 1",
             'correct': True,
         },
             {
             'answer': "answer 2.",
             'correct': False,
         }]
     },
]

parser = reqparse.RequestParser()


class NoteList(Resource):
    def get(self):
        return "blank"

    def post(self):
        parser.add_argument("raw_json")
        parser.add_argument("num_questions")
        args = parser.parse_args()

        thenote = json.loads(args['raw_json'])
        concat_note = ""
        for i in range(len(thenote["blocks"])):
            concat_note += thenote["blocks"][i]["text"]

        # output = nlp(concat_note)
        output = nlp.generate(
            concat_note, answer_style="multiple_choice", num_questions=int(args["num_questions"]))

        # callGetExplanationsAroundHere()

        return [output, 201]


# add routes
api.add_resource(NoteList, '/notes/')

if __name__ == "__main__":
    app.run(debug=True)
