// Sample aptitude questions data
const aptitudeQuestions = [
  {
    id: 1,
    topic: 'Quantitative Aptitude',
    question: 'What is the next number in the series: 2, 6, 12, 20, ?',
    options: ['30', '28', '24', '22'],
    answer: '30',
    explanation: 'The pattern is n^2 + n: 1^2+1=2, 2^2+2=6, 3^2+3=12, 4^2+4=20, so next is 5^2+5=30.'
  },
  {
    id: 2,
    topic: 'Logical Reasoning',
    question: 'If all roses are flowers and some flowers fade quickly, can we say some roses fade quickly?',
    options: ['Yes', 'No', 'Cannot be determined', 'None of these'],
    answer: 'Cannot be determined',
    explanation: 'We do not know if the roses are among the flowers that fade quickly.'
  },
  {
    id: 3,
    topic: 'Verbal Ability',
    question: 'Choose the word most similar in meaning to "Eloquent".',
    options: ['Fluent', 'Silent', 'Angry', 'Weak'],
    answer: 'Fluent',
    explanation: 'Eloquent means fluent or persuasive in speaking or writing.'
  }
];

export default aptitudeQuestions;
