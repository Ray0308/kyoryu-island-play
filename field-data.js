// Additions to the approved eight-card reference set. Measurements are examples,
// not uniform maximum sizes; the measured dimension is explicit on each card.
const extraFieldProfiles={};
function addFieldProfile(id,fact,meters,measure,url,note='大きさは個体・種・復元や推定方法で異なります。比較用の目安です。'){
 const name=url.includes('amnh.org')?'American Museum of Natural History':url.includes('nhm.ac.uk')?'Natural History Museum':url.includes('floridamuseum')?'Florida Museum':url.includes('sdnhm')?'San Diego Natural History Museum':url.includes('uzh.ch')?'University of Zurich':url.includes('cambridge.org')?'Jeram・化石サソリの原記載':url.includes('nature.com')?'Scientific Reports':url.includes('app.pan.pl')?'Acta Palaeontologica Polonica':'研究資料';
 extraFieldProfiles[id]={image:'assets/catalog/'+id+'-complete.png',fact,meters,measure,note,sources:[[name,url]]};
}
const bodyLength='からだの ながさ',wingWidth='はねを ひろげた はば';
addFieldProfile('meat-2','せなかに おおきな ほ！ ながい くちさきで、さかなを つかまえたと かんがえられているよ。',14,bodyLength,'https://www.nhm.ac.uk/discover/dino-directory/spinosaurus.html');
addFieldProfile('meat-3','めの うえの ２ほんの つのが めじるし！ まえあしは とても ちいさいよ。',8,bodyLength,'https://www.nhm.ac.uk/discover/dino-directory/carnotaurus.html');
addFieldProfile('meat-4','はなの うえに つのが あるよ！ せなかには、ちいさな ほねの かざりも ならんでいるんだ。',7,bodyLength,'https://www.nhm.ac.uk/discover/dino-directory/ceratosaurus.html','体長６〜７mという推定のうち、約７mを比較例にしています。鼻の角の用途は確定していません。');
addFieldProfile('plant-2','せなかの いたが ずらり！ しっぽの さきには、ながい とげが あるよ。',9,bodyLength,'https://www.nhm.ac.uk/discover/dino-directory/stegosaurus.html');
addFieldProfile('plant-3','あたまの うしろに ながい とさか！ とさかの なかには、くうきの とおりみちが あるんだ。',9,bodyLength,'https://www.nhm.ac.uk/discover/dino-directory/parasaurolophus.html');
addFieldProfile('plant-4','からだは ほねの よろい！ しっぽの さきの おもい かたまりが とくちょうだよ。',8,bodyLength,'https://www.nhm.ac.uk/discover/dino-directory/ankylosaurus.html');
addFieldProfile('sea-3','イルカに にているけれど、はちゅうるい！ ながい くちばしの ような くちさきに、はが ならんでいるよ。',2.7,bodyLength,'https://www.app.pan.pl/archive/published/app62/app003762017.html','大型のIchthyosaurus somersetensis標本（全長約2.7m）を比較例にしています。魚竜全体の最大サイズではありません。');
addFieldProfile('sea-9','うみを およいだ おおきな カメ！ ながい まえの ひれで、みずを かいて すすんだよ。',4.6,bodyLength,'https://www.nhm.ac.uk/discover/giant-prehistoric-turtles.html','大型標本の全長約4.6mを比較例にしています。左右のひれの幅ではありません。');
addFieldProfile('sea-10','おおきな はを もつ、むかしの サメ！ はの かせきが みつかっているよ。',15,bodyLength,'https://www.amnh.org/explore/ology/ology-cards/379-megalodon','比較用に約15mの例を表示。最大体長は研究によって推定に大きな幅があり、この長さが最大という意味ではありません。');
addFieldProfile('sky-2','ながい しっぽの さきに、ひしがたの まく！ くちには とがった はが ならんでいたよ。',1.8,wingWidth,'https://www.amnh.org/explore/ology/paleontology/pterosaurs-the-card-game/meet-the-pterosaurs');
addFieldProfile('sky-3','からだに くらべて おおきな あたま！ はの ある くちと、ながい しっぽが とくちょうだよ。',1.4,wingWidth,'https://www.amnh.org/explore/news-blogs/dimorphodon-pterosaur');
addFieldProfile('sky-4','あたまの うえに、おおきな とさか！ はの ない、みじかい くちばしを もつ よくりゅうだよ。',1.8,wingWidth,'https://www.amnh.org/explore/ology/paleontology/pterosaurs-the-card-game/meet-the-pterosaurs','Tapejara wellnhoferiの翼開長約1.8mを例に表示。よく似た別属の大型種と区別しています。');
addFieldProfile('insect-0','おおきな トンボに にた こんちゅう！ ４まいの はねで、むかしの しっちを とんでいたよ。',.63,wingWidth,'https://www.ephemeroptera-galactica.com/pubs/pub_s/pubshearw1990p1807.pdf','Meganeura monyiの翼開長約63cmという記述を比較例に使用。近縁のMeganeuropsisの約71cmとは区別しています。');
addFieldProfile('insect-1','たくさんの あしと、ひろい せなか！ こんちゅうではなく、ヤスデに ちかい なかまだよ。',2.6,bodyLength,'https://www.nhm.ac.uk/discover/news/2021/december/worlds-largest-terrestrial-arthropod-was-car-sized-millipede.html','不完全な大型化石から復元された最大級の推定約2.6mを比較例にしています。');
addFieldProfile('insect-2','２つの はさみと、まがった しっぽ！ むかしの りくに くらした、サソリの なかまだよ。',.7,'しっぽまでの ながさ','https://www.cambridge.org/core/journals/earth-and-environmental-science-transactions-of-royal-society-of-edinburgh/article/abs/scorpions-from-the-visean-of-east-kirkton-west-lothian-scotland-with-a-revision-of-the-infraorder-mesoscorpionina/4FE8E1C63AD52A4CC48528B1B7A541C4','大型の不完全化石からの復元推定約70cmを比較例にしています。完全な標本を直接測った長さではありません。');
addFieldProfile('insect-3','おおきな はさみと、パドルの ような あし！ みずの なかに いた、ウミサソリの なかまだよ。',2.5,bodyLength,'https://www.nature.com/articles/s41598-019-53590-8','大型種Jaekelopterus rhenaniaeの推定全長約2.5mを例に表示。陸のサソリや昆虫とは別の仲間です。');
addFieldProfile('insect-4','くちの まえに、２ほんの まがった うで！ からだの よこの ひれで およぐ、むかしの せっそくどうぶつだよ。',.56,bodyLength,'https://www.nhm.ac.uk/discover/the-cambrian-period.html','Anomalocarisの約56cmという記述を比較例に使用。他の大型ラディオドンタ類とは区別しています。');
addFieldProfile('animal-0','ながい けと、まがった きば！ ちいさな みみを もつ、むかしの ゾウの なかまだよ。',3.5,'かたの たかさ','https://www.nhm.ac.uk/discover/were-all-mammoths-woolly.html','ケナガマンモスの肩高３〜3.5mのうち3.5mを比較例に使用。体長や牙の長さではありません。');
addFieldProfile('animal-1','ながい うわの きばが めじるし！ ふとい まえあしと、みじかい しっぽの ネコの なかまだよ。',1,'かたの たかさ','https://www.ns4.sdnhm.org/exhibitions/fossil-mysteries/fossil-field-guide-a-z/sabertooth-cat/','Smilodon fatalisの肩高約１mを比較例に使用。トラそのものではなく、ネコ科の絶滅した仲間です。');
addFieldProfile('animal-2','とても おおきな ヘビ！ あたたかい もりの みずべに くらしていたよ。',13,bodyLength,'https://www.floridamuseum.ufl.edu/100-years/object/titanoboa/','化石から復元された約13mという推定を比較例に使用。完全な全身化石を直接測った長さではありません。');
addFieldProfile('animal-3','ちじょうに くらした、おおきな ナマケモノ！ ながい つめを もち、うしろあしで たちあがることも できたよ。',6,bodyLength,'https://www.zm.uzh.ch/de/sonderausstellungen/sonderausstellungsarchiv/2000riesenfaultier.html','大型のMegatheriumの全長約６mを比較例に使用。立ち上がった高さではありません。');
addFieldProfile('animal-4','まるい こうらと、おもい しっぽ！ アルマジロに ちかい、むかしの ほにゅうるいだよ。',4,bodyLength,'https://www.nhm.ac.uk/discover/news/2022/november/giant-glyptodont-armadillos-may-have-been-hunted-early-south-americans.html','大型種Doedicurus clavicaudatusの全長約４mを比較例に使用。恐竜ではなく哺乳類です。');

extraFieldProfiles['sky-3'].image='assets/catalog/sky-3-complete-v2.png';
extraFieldProfiles['insect-1'].image='assets/catalog/insect-1-complete-v2.png';
