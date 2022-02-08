import React from 'react';

type Props = {
  img: string;
  title: string;
  titleColor: string;
  name: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
};

const TeamMemberCard = ({
  img,
  title,
  titleColor,
  name,
  bio,
  twitter,
  linkedin,
}: Props) => {
  return (
    <div className='bg-white p-4 shadow-lg rounded-lg text-black mb-8'>
      <img src={img} alt='team member meta mogul nft' />
      <h3
        className='text-center text-xl p-1 w-full rounded-full mt-3 font-body'
        style={{ backgroundColor: titleColor }}
      >
        {title}
      </h3>
      <h2 className='text-3xl font-heading my-2'>{name}</h2>
      <p className='font-body text-lg my-3'>{bio}</p>
      <div className='flex'>
        {linkedin && (
          <a href={linkedin} target='_blank' rel='noreferrer'>
            <img
              src='/linkedin.png'
              className='h-14 w-14 mr-4'
              alt='linkedin icon'
            />
          </a>
        )}
        {twitter && (
          <a href={twitter} target='_blank' rel='noreferrer'>
            <img
              src='/twitter-blue.png'
              className='h-14 w-14'
              alt='twitter icon'
            />
          </a>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
