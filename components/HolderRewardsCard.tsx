import React from 'react';

type Props = { img: string; count: '1' | '3' | '5' | '10+'; rewards: string[] };

const HolderRewardsCard = ({ img, count, rewards }: Props) => {
  return (
    <div className='relative bg-yellow-300 mb-10 rounded-3xl p-4 border-8 border-yellow-500 flex flex-col'>
      <div
        className={`${count === '1' ? 'h-20' : 'h-20'} absolute`}
        style={{
          position: 'absolute',
          left: '0',
          right: '0',
          top: '-50px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '80px',
        }}
      >
        <img className='h-full w-auto' src={img} alt='mogul head' />
      </div>
      <h2 className='font-heading text-center text-4xl'>Hold {count}</h2>
      <ul className='font-body'>
        {rewards.map((r, i) => (
          <li key={i} className='text-2xl mb-4'>
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HolderRewardsCard;
