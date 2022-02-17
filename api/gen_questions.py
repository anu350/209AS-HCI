from pipelines import pipeline

sample_string = {
    "blocks": [
        {
            "key": "fm4pk",
            "text": "The invention of the transistor was an unprecedented development in the electronics industry. ",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "6433r",
            "text": "It marked the beginning of the current age in the  electronicssector. After the transistor's invention, advances in  technology became more frequent, the most notable of which was computer  technology. The three physicists who invented the transistor; William  Shockley, John Bardeen, and Walter Brattain were awarded with the Nobel  Prize. Considering the inventions that the transistor paved the way for,  one could argue that it was the most important invention of the  twentieth century.",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        }
    ],
    "entityMap": {}
}


def gen_questions(input_note):

    concat_note = 'the chicken crosses the road to get to the other side.'

    for i in range(len(input_note["blocks"])):
        concat_note += input_note["blocks"][i]["text"]

    nlp = pipeline("question-generation",
                   model="valhalla/t5-small-qg-prepend", qg_format="prepend")
    output = nlp(concat_note)

    return output


if __name__ == "__main__":
    out = gen_questions(sample_string)
    print(out)
