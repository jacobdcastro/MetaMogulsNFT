import React from 'react';

type Props = { question: string; answers: string[] };

const FAQSection = ({ question, answers }: Props) => {
  return (
    <div className='mb-8'>
      <h3 className='font-heading text-3xl mt-12 mb-4 drop-shadow-md'>
        {question}
      </h3>
      {answers.map((a, i) => (
        <p className='text-lg mb-4 drop-shadow-md font-body' key={i}>
          {a}
        </p>
      ))}
    </div>
  );
};

export default FAQSection;
