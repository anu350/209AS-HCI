from questiongenerator import QuestionGenerator

def gen_questions_mult(input_note):
    
    concat_note = ''

    for i in range(len(input_note["blocks"])):
        concat_note += input_note["blocks"][i]["text"]
    
    nlp = QuestionGenerator()
    output = nlp.generate(concat_note,answer_style="multiple_choice")
    
    return output