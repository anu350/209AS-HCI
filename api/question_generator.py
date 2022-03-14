import os
import random
import gensim
from gensim.test.utils import datapath, get_tmpfile
from gensim.models import KeyedVectors
from gensim.scripts.glove2word2vec import glove2word2vec
from pipelines import pipeline
from textblob import TextBlob
import nltk

#glove_file = '../data/embeddings/glove.6B.300d.txt'
#tmp_file = '../data/embeddings/word2vec-glove.6B.300d.txt'

#glove_file = '../data/embeddings/glove.6B.200d.txt'
#tmp_file = '../data/embeddings/word2vec-glove.6B.200d.txt'

glove_file = '../data/embeddings/glove.6B.100d.txt'
tmp_file = '../data/embeddings/word2vec-glove.6B.100d.txt'

#glove_file = '../data/embeddings/glove.6B.50d.txt'
#tmp_file = '../data/embeddings/word2vec-glove.6B.50d.txt'

if not os.path.isfile(glove_file):
    print("Glove embeddings not found. Please download and place them in the following path: " + glove_file)
    exit(1)

glove2word2vec(glove_file, tmp_file)
model = KeyedVectors.load_word2vec_format(tmp_file)
print('loaded glove embeddings')

class QuestionGenerator:
    def __init__(self):
        self.nlp = pipeline("question-generation")

    def generate(self, text, num_questions=5):
        qa_list = []
        questions_and_answers = self.nlp(text)
        print('QUESTIONS AND SINGLE ANSWERS:', questions_and_answers)

        for question_answer_pair in questions_and_answers:
            question = question_answer_pair['question']
            answer = question_answer_pair['answer']

            MC_choices_and_answers = self._get_MC_answers_from_distractors(answer, 3)

            qa = {
                "question": question,
                "answer": MC_choices_and_answers
            }
            qa_list.append(qa)

        if len(qa_list) > num_questions:
            qa_list = qa_list[0:num_questions]

        return qa_list

    def _get_MC_answers_from_distractors(self, correct_answer, count):
        # preprocessing to improve distractor quality
        correct_answer = str.lower(correct_answer)
        #correct_answer_words = correct_answer.split(' ')
        correct_answer_tokens = nltk.word_tokenize(correct_answer)
        tagged_correct_answer_tokens = nltk.pos_tag(correct_answer_tokens)
        print('TAGGED CORRECT ANSWER TOKENS:', tagged_correct_answer_tokens)
        correct_answer_words = [token[0] for token in tagged_correct_answer_tokens if token[1][0] == 'N']

        useless_words = [
            'the',
            'it',
            'is',
            'was',
            'a',
            'an',
            'that',
            'on',
            'in'
        ]
        
        #if len(correct_answer_words) > 1:
        #    correct_answer = correct_answer.split(' ')[0]
        print('CORRECT ANSWER WORDS:', correct_answer_words)

        # Add the correct answer
        final_choices = []
        final_choices.append({"answer": correct_answer, "correct": True})
    
        ##Extracting closest words for the answer.
        try:
            closestWords = model.most_similar(positive=correct_answer_words, topn=count)
            print('CLOSEST WORDS:', closestWords)
        except:
            #In case the word is not in the vocabulary, or other problem not loading embeddings
            return []

        #Return count many distractors
        distractors = list(map(lambda x: x[0], closestWords))[0:count]

        for distractor in distractors:
            final_choices.append({"answer": distractor, "correct": False})
        
        random.shuffle(final_choices)
        return final_choices


