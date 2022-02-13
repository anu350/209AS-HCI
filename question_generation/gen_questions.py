from pipelines import pipeline

def gen_questions(input_note):
    
    concat_note = ''

    for i in range(len(input_note["blocks"])):
        concat_note += input_note["blocks"][i]["text"]
    
    nlp = pipeline("question-generation")
    output = nlp(concat_note)
    
    return output