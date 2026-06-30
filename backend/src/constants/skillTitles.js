// Tytuły odblokowywane w Skill Tree per kategoria.
// Każdy próg to poziom kategorii, przy którym odblokowuje się węzeł z tytułem.
// Progi liczone wg tej samej formuły XP co poziom globalny (100 * 1.5^(lvl-1)).

const SKILL_TITLES = {
  'Ciało': [
    { level: 1, title: 'Nowicjusz' },
    { level: 3, title: 'Adept' },
    { level: 6, title: 'Atleta' },
    { level: 10, title: 'Wojownik' },
    { level: 15, title: 'Gladiator' },
    { level: 20, title: 'Tytan' },
  ],
  'Intelekt': [
    { level: 1, title: 'Ciekawski' },
    { level: 3, title: 'Uczeń' },
    { level: 6, title: 'Myśliciel' },
    { level: 10, title: 'Erudyta' },
    { level: 15, title: 'Mędrzec' },
    { level: 20, title: 'Geniusz' },
  ],
  'Produktywność': [
    { level: 1, title: 'Początkujący' },
    { level: 3, title: 'Wykonawca' },
    { level: 6, title: 'Organizator' },
    { level: 10, title: 'Strateg' },
    { level: 15, title: 'Mistrz Produktywności' },
    { level: 20, title: 'Niepowstrzymany' },
  ],
  'Psyche': [
    { level: 1, title: 'Wędrowiec' },
    { level: 3, title: 'Spokojny' },
    { level: 6, title: 'Świadomy' },
    { level: 10, title: 'Zen' },
    { level: 15, title: 'Mnich' },
    { level: 20, title: 'Oświecony' },
  ],
};

module.exports = SKILL_TITLES;
