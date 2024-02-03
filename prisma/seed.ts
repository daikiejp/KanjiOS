import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const kanjiData = [
    {
      kanji: '山',
      strokes: 3,
      reading: 'やま',
      kanji_en: 'mountain',
      kanji_es: 'montaña',
      on: JSON.stringify(['サン', 'ザン']),
      kun: JSON.stringify(['やま']),
      jlpt: 5,
      words: {
        create: [
          {
            word_en: 'mountain',
            word_es: 'montaña',
            reading: 'やま',
            kanji: '山',
            jlpt: 5,
            sentences: {
              create: [
                {
                  sentence: '山の上に雪が積もっています。',
                  furigana:
                    '山(やま)の上(うえ)に雪(ゆき)が積(つ)もっています。',
                  sentence_es: 'Hay nieve en la cima de la montaña.',
                  sentence_en: 'There is snow on the mountain top.',
                },
                {
                  sentence: '富士山は日本で一番高い山です。',
                  furigana:
                    '富士山(ふじさん)は日本(にほん)で一番(いちばん)高(たか)い山(やま)です。',
                  sentence_es: 'El Monte Fuji es la montaña más alta de Japón.',
                  sentence_en: 'Mount Fuji is the highest mountain in Japan.',
                },
              ],
            },
          },
          {
            word_en: 'many',
            word_es: 'muchos',
            reading: 'たくさん',
            kanji: '沢山',
            jlpt: 5,
            sentences: {
              create: [
                {
                  sentence: '図書館には沢山の本があります。',
                  furigana:
                    '図書館(としょかん)には沢山(たくさん)の本(ほん)があります。',
                  sentence_es: 'Hay muchos libros en la biblioteca.',
                  sentence_en: 'There are many books in the library.',
                },
              ],
            },
          },
          {
            word_en: 'volcano',
            word_es: 'volcán',
            reading: 'かざん',
            kanji: '火山',
            jlpt: 4,
            sentences: {
              create: [
                {
                  sentence: '日本には多くの活火山があります。',
                  furigana:
                    '日本(にほん)には多(おお)くの活火山(かっかざん)があります。',
                  sentence_es: 'Hay muchos volcanes activos en Japón.',
                  sentence_en: 'There are many active volcanoes in Japan.',
                },
              ],
            },
          },
          {
            word_en: 'mountain range',
            word_es: 'cordillera',
            reading: 'さんみゃく',
            kanji: '山脈',
            jlpt: 3,
            sentences: {
              create: [
                {
                  sentence: 'アンデス山脈は南アメリカを縦断しています。',
                  furigana:
                    'アンデス山脈(さんみゃく)は南(みなみ)アメリカを縦断(じゅうだん)しています。',
                  sentence_es:
                    'La cordillera de los Andes atraviesa América del Sur.',
                  sentence_en:
                    'The Andes mountain range runs through South America.',
                },
              ],
            },
          },
          {
            word_en: 'mountain climbing',
            word_es: 'alpinismo',
            reading: 'とざん',
            kanji: '登山',
            jlpt: 3,
            sentences: {
              create: [
                {
                  sentence: '週末に友達と富士山の登山に行きます。',
                  furigana:
                    '週末(しゅうまつ)に友達(ともだち)と富士山(ふじさん)の登山(とざん)に行(い)きます。',
                  sentence_es:
                    'Voy a hacer alpinismo en el Monte Fuji con mis amigos este fin de semana.',
                  sentence_en:
                    "I'm going mountain climbing on Mount Fuji with my friends this weekend.",
                },
              ],
            },
          },
        ],
      },
    },
    {
      kanji: '水',
      strokes: 4,
      reading: 'みず',
      kanji_en: 'water',
      kanji_es: 'agua',
      on: JSON.stringify(['スイ']),
      kun: JSON.stringify(['みず']),
      jlpt: 5,
      words: {
        create: [
          {
            word_en: 'water',
            word_es: 'agua',
            reading: 'みず',
            kanji: '水',
            jlpt: 5,
            sentences: {
              create: [
                {
                  sentence: '毎日8杯の水を飲むことが大切です。',
                  furigana:
                    '毎日(まいにち)8杯(はい)の水(みず)を飲(の)むことが大切(たいせつ)です。',
                  sentence_es:
                    'Es importante beber 8 vasos de agua todos los días.',
                  sentence_en:
                    "It's important to drink 8 glasses of water every day.",
                },
              ],
            },
          },
          {
            word_en: 'Wednesday',
            word_es: 'miércoles',
            reading: 'すいようび',
            kanji: '水曜日',
            jlpt: 5,
            sentences: {
              create: [
                {
                  sentence: '水曜日は英語の授業があります。',
                  furigana:
                    '水曜日(すいようび)は英語(えいご)の授業(じゅぎょう)があります。',
                  sentence_es: 'Los miércoles tenemos clase de inglés.',
                  sentence_en: 'We have English class on Wednesdays.',
                },
              ],
            },
          },
          {
            word_en: 'aquarium',
            word_es: 'acuario',
            reading: 'すいぞくかん',
            kanji: '水族館',
            jlpt: 3,
            sentences: {
              create: [
                {
                  sentence: '週末に家族で水族館に行きました。',
                  furigana:
                    '週末(しゅうまつ)に家族(かぞく)で水族館(すいぞくかん)に行(い)きました。',
                  sentence_es:
                    'Fui al acuario con mi familia el fin de semana.',
                  sentence_en:
                    'I went to the aquarium with my family on the weekend.',
                },
              ],
            },
          },
          {
            word_en: 'flood',
            word_es: 'inundación',
            reading: 'こうずい',
            kanji: '洪水',
            jlpt: 3,
            sentences: {
              create: [
                {
                  sentence: '大雨で川が氾濫し、洪水が起きました。',
                  furigana:
                    '大雨(おおあめ)で川(かわ)が氾濫(はんらん)し、洪水(こうずい)が起(お)きました。',
                  sentence_es:
                    'Las fuertes lluvias causaron que el río se desbordara, provocando una inundación.',
                  sentence_en:
                    'The heavy rain caused the river to overflow, resulting in a flood.',
                },
              ],
            },
          },
          {
            word_en: 'hydroelectric power',
            word_es: 'energía hidroeléctrica',
            reading: 'すいりょくはつでん',
            kanji: '水力発電',
            jlpt: 2,
            sentences: {
              create: [
                {
                  sentence: 'この地域では水力発電が主要な電力源です。',
                  furigana:
                    'この地域(ちいき)では水力発電(すいりょくはつでん)が主要(しゅよう)な電力源(でんりょくげん)です。',
                  sentence_es:
                    'En esta región, la energía hidroeléctrica es la principal fuente de electricidad.',
                  sentence_en:
                    'In this region, hydroelectric power is the main source of electricity.',
                },
              ],
            },
          },
        ],
      },
    },
    {
      kanji: '火',
      strokes: 4,
      reading: 'ひ',
      kanji_en: 'fire',
      kanji_es: 'fuego',
      on: JSON.stringify(['カ']),
      kun: JSON.stringify(['ひ']),
      jlpt: 5,
      words: {
        create: [
          {
            word_en: 'fire',
            word_es: 'fuego',
            reading: 'ひ',
            kanji: '火',
            jlpt: 5,
            sentences: {
              create: [
                {
                  sentence: '火を使うときは注意が必要です。',
                  furigana:
                    '火(ひ)を使(つか)うときは注意(ちゅうい)が必要(ひつよう)です。',
                  sentence_es: 'Se necesita precaución cuando se usa fuego.',
                  sentence_en: 'Caution is needed when using fire.',
                },
              ],
            },
          },
          {
            word_en: 'Tuesday',
            word_es: 'martes',
            reading: 'かようび',
            kanji: '火曜日',
            jlpt: 5,
            sentences: {
              create: [
                {
                  sentence: '火曜日は体育の授業があります。',
                  furigana:
                    '火曜日(かようび)は体育(たいいく)の授業(じゅぎょう)があります。',
                  sentence_es: 'Los martes tenemos clase de educación física.',
                  sentence_en: 'We have physical education class on Tuesdays.',
                },
              ],
            },
          },
          {
            word_en: 'fire (disaster)',
            word_es: 'incendio',
            reading: 'かじ',
            kanji: '火事',
            jlpt: 4,
            sentences: {
              create: [
                {
                  sentence: '火事が起きたら、すぐに119番に電話してください。',
                  furigana:
                    '火事(かじ)が起(お)きたら、すぐに119番(ばん)に電話(でんわ)してください。',
                  sentence_es:
                    'Si ocurre un incendio, llame inmediatamente al 119.',
                  sentence_en: 'If a fire occurs, call 119 immediately.',
                },
              ],
            },
          },
          {
            word_en: 'flame',
            word_es: 'llama',
            reading: 'かえん',
            kanji: '火炎',
            jlpt: 2,
            sentences: {
              create: [
                {
                  sentence: '消防士は火炎から人々を守ります。',
                  furigana:
                    '消防士(しょうぼうし)は火炎(かえん)から人々(ひとびと)を守(まも)ります。',
                  sentence_es:
                    'Los bomberos protegen a las personas de las llamas.',
                  sentence_en: 'Firefighters protect people from flames.',
                },
              ],
            },
          },
          {
            word_en: 'Mars',
            word_es: 'Marte',
            reading: 'かせい',
            kanji: '火星',
            jlpt: 3,
            sentences: {
              create: [
                {
                  sentence: '火星は赤い惑星として知られています。',
                  furigana:
                    '火星(かせい)は赤(あか)い惑星(わくせい)として知(し)られています。',
                  sentence_es: 'Marte es conocido como el planeta rojo.',
                  sentence_en: 'Mars is known as the red planet.',
                },
              ],
            },
          },
        ],
      },
    },
  ];

  for (const kanji of kanjiData) {
    await prisma.kanji.create({
      data: kanji,
    });
  }

  console.log('Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
