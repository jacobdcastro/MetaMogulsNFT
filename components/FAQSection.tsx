import React from 'react';

type Props = { question: string; answers: string[] };

const FAQSection = ({ question, answers }: Props) => {
  return (
    <div>
      <h3 className='font-heading text-2xl mt-12 mb-4'>{question}</h3>
      {answers.map((a, i) => (
        <p className='text-lg mb-4' key={i}>
          {a}
        </p>
      ))}
    </div>
  );
};

export default FAQSection;
