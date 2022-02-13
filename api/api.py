# source https://medium.com/duomly-blockchain-online-courses/how-to-create-a-simple-rest-api-with-python-and-flask-in-5-minutes-94bb88f74a23
# also try:
# - https://levelup.gitconnected.com/full-stack-web-app-with-python-react-and-bootstrap-backend-8592baa6e4eb

from flask import Flask
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS

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
     "important_stuff":
         [{
             'text': "sample sentence that should be highlighted.",
             'offset': 3,
             'length': 14,
         },
             {
             'text': "another sentence that is important.",
             'offset': 21,
             'length': 16,
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
            'questions': ['question1?', 'question2?']
        }
        print("printing raw JSON ---------")
        print(args['raw_json'])
        return [NOTES[note_id], 201]


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
