text = '''The Italian Renaissance followed on the heels of the Middle Ages, and was spawned by the birth of the philosophy of humanism, which emphasized the importance of individual achievement in a wide range of fields. The early humanists, such as writer Francesco Petrarch, studied the works of the ancient Greeks and Romans for inspiration and ideology, mixing the philosophies of Plato and other ancient thinkers with the teachings of the Roman Catholic Church. Under the influence of the humanists, literature and the arts climbed to new levels of importance.
Though it eventually spread through Europe, the Renaissance began in the great city-states of Italy. Italian merchants and political officials supported and commissioned the great artists of the day, thus the products of the Renaissance grew up inside their walls. The most powerful city-states were Florence, The Papal States (centered in Rome), Venice, and Milan. Each of these states grew up with its own distinctive character, very much due to the different forms of government that presided over each. Florence, considered the birthplace of the Renaissance, grew powerful as a wool-trading post, and remained powerful throughout the Renaissance due to the leadership of the Medici family, who maintained the city's financial strength and were intelligent and generous patrons of the arts. The Pope, who had the responsibility of running the Catholic Church as well, ruled Rome. As the power of the northern city-states grew, the Papacy increasingly became the seat of an international politician rather than a spiritual leader, and many pontiffs fell prey to the vices of corruption and nepotism that often accompanied a position of such power. Nevertheless, Rome, the victim of a decline that had destroyed the ancient city during the Middle Ages, flourished once again under papal leadership during the Renaissance. Venice and Milan also grew wealthy and powerful, playing large roles in Italian politics and attracting many artists and writers to their gilded streets. Venice was ruled by oligarchy in the hands of its Great Council of noble families, and Milan by a strong monarchy that produced a line of powerful dukes.
Perhaps the most prominent feature of the Renaissance was the furthering of the arts, and the advancement of new techniques and styles. During the early Renaissance, painters such as Giotto, and sculptors such as Ghiberti experimented with techniques to better portray perspective. Their methods were rapidly perfected and built upon by other artists of the early Renaissance such as Botticelli and Donatello. However, the apex of artistic talent and production came later, during what is known as the High Renaissance, in the form of Leonardo da Vinci, Raphael, and Michaelangelo, who remain the best known artists of the Renaissance. The Renaissance also saw the invention of printing in Europe and the rise of literature as an important aspect in everyday life. The Italian writers Boccaccio, Pico, and Niccolo Machiavelli were able to distribute their works much more easily and cheaply because of the rise of the printed book.
Alas, the Italian Renaissance could not last forever, and beginning in 1494 with the French invasion of Italian land Italy was plagued by the presence of foreign powers vying for pieces of the Italian peninsula. Finally, in 1527, foreign occupation climaxed with the sack of Rome and the Renaissance collapsed under the domination of the Holy Roman Emperor, Charles V. The economic restrictions placed on the Italian states by Charles V, combined with the censorship the Catholic Church undertook in response to the rising Reformation movement ensured that the spirit of the Renaissance was crushed, and Italy ceased to be the cradle of artistic, intellectual, and economic prosperity.'''

from pipelines import pipeline

#nlp = pipeline("question-generation", model="valhalla/t5-small-qg-prepend", qg_format="prepend")
nlp = pipeline("question-generation", qg_format="prepend")

print(nlp(text))