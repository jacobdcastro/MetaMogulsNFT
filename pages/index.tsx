import React from 'react';
import FAQSection from '../components/FAQSection';
import Layout from '../components/Layout';
import TeamMemberCard from '../components/TeamMemberCard';

const hText = 'font-heading text-5xl drop-shadow-lg mt-6';
const pText = 'font-body text-xl mt-5 drop-shadow-md';

const HomePage = () => {
  return (
    <Layout>
      <div className='mt-8 text-white flex flex-col md:flex-row-reverse'>
        <div className=''>
          <img
            src='/example.gif'
            alt='changing nft preview'
            className='w-full'
          />
        </div>
        <div className='md:w-2/3 mr-14'>
          <h1 className={hText}>
            Ideas Can&apos;t
            <br />
            Be Boxed!
          </h1>
          <p className={pText}>
            The Meta Moguls are a collection of moguls unboxing ideas on the
            Ethereum blockchain! Phase 1 mint will be an exclusive supply of
            1,111 moguls and Phase 2 mint will begin in March! The first
            generation of moguls are constructed using out of the box items,
            outfits, boxes, labels, and personalities! The Meta Moguls are here
            to become the next generation of leaders and entrepreneurs in the
            metaverse!
          </p>
        </div>
      </div>

      {/* about section */}
      <div id='about' className='text-white mt-20 flex flex-col md:flex-row'>
        <div>
          <img src='/confused_mogul.png' alt='confused mogul nft' />
        </div>
        <div className='md:w-2/3 md:ml-14'>
          <h2 className={hText}>Why The Meta Moguls?</h2>
          <p className={pText}>
            Meta Moguls was formed on the principles of community building,
            diversity, and the commitment towards financial freedom. Meta Moguls
            is here to disrupt the metaverse by supporting creatives and self
            starters seeking to dive into NFTs.
          </p>
          <p className={pText}>
            Our goal is to create a global brand and exclusive community that
            gives holders of the NFT the necessary resources to learn, earn, and
            build their own empires. Not only does one Meta Mogul NFT provide a
            cool pfp and 1,111 new friends, but also a ticket into future IRL
            events, exclusive merch, DAO, and $MOGUL token! This is all detailed
            in V1 of our quarterly roadmap! Ready to be the next mogul?
          </p>
        </div>
      </div>

      {/* roadmap */}
      <div id='roadmap' className='text-white mt-14'>
        <h2 className={hText}>Roadmap!</h2>
        <img className='mt-10' src='/roadmap.png' alt='meta moguls roadmap' />
      </div>

      {/* the team */}
      <div id='team' className='text-white mt-14'>
        <h2 className={hText}>The Team!</h2>
        <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
          <TeamMemberCard
            img='/pfps/breyden-nft.jpeg'
            title='Lead Artist'
            titleColor='#d20612'
            name='Breyden Boyd'
            bio='20 year old comic artist from Oklahoma. Founded Shape-Man Comics series.'
            twitter='https://twitter.com/BoydComics'
          />
          <TeamMemberCard
            img='/pfps/brandon-nft.png'
            title='Co-founder'
            titleColor='#18a348'
            name='Brandon Iverson'
            bio='23 year old entrepreneur from Atlanta. Looking to build the largest collective of moguls in the metaverse.'
            linkedin='https://www.linkedin.com/in/brandon-iverson-b73005134/'
            twitter='https://twitter.com/biverson11'
          />
          <TeamMemberCard
            img='/pfps/jordan-nft.png'
            title='Co-founder'
            titleColor='#01a0e2'
            name='Jordan Williams'
            bio='23 year old entrepreneur from Atlanta. Creating experiences for moguls to connect and grow together.'
            linkedin='https://www.linkedin.com/in/jordan-williams/'
            twitter='https://twitter.com/jwill23'
          />
          <TeamMemberCard
            img='/pfps/dawn-nft.png'
            title='Lead Developer'
            titleColor='#fef037'
            name='Dawn Kelly'
            bio='Full stack and Web3 developer who believes in true financial freedom through access to investment for people everywhere.'
            linkedin='https://www.linkedin.com/in/dawnkelly09/'
            twitter='https://twitter.com/run4pancakes'
          />
          <TeamMemberCard
            img='/pfps/juan-nft.png'
            title='Business Strategy'
            titleColor='#f2a1c2'
            name='Juan Luviano'
            bio='24 year old visionary traveling the metaverse to provide moguls the tools for financial freedom.'
            linkedin='https://www.linkedin.com/in/juanl99/'
            twitter='https://twitter.com/juannn_234'
          />
          <TeamMemberCard
            img='/pfps/bethlhem-nft.jpeg'
            title='Community Manager'
            titleColor='#f2a1c2'
            name='Bethlhem Damtie'
            bio='The glue keeping the mogul community happy and ready to become the best community in the metaverse.'
            linkedin='https://www.linkedin.com/in/bethlhem-damtie-40112b194/'
            twitter='https://twitter.com/BethlhemDamtie'
          />
        </div>
      </div>

      <div>
        <img src='holder-rewards.png' alt='holder rewards' />
        {/* TODO */}
        {/* <HolderRewardsCard
          img='/hold1.png'
          count='1'
          rewards={[
            'Exclusive Chat Discord',
            'Whitelist for Phase 2',
            '20% off merch.',
          ]}
        />
        <HolderRewardsCard
          img='/hold3.png'
          count='3'
          rewards={[
            'Access to free live trading program.',
            'Exclusive alpha discord chat.',
            '50% off merch',
          ]}
        />
        <HolderRewardsCard
          img='/hold5.png'
          count='5'
          rewards={[
            'VIP Access to IRL social events',
            'Enter raffles for free flights to select IRL events.',
            'Free merch',
          ]}
        />
        <HolderRewardsCard
          img='/hold10.png'
          count='10+'
          rewards={[
            'Recieve Omega Mogul access',
            'Free Airdrop of Moguls Phase 2',
            '1 on 1 monthly biz consultation',
          ]}
        /> */}
      </div>

      {/* FAQ */}
      <div id='faq' className='text-white'>
        <h2 className={hText}>FAQ</h2>
        <FAQSection
          question='Where did the Idea of Meta Moguls come from?'
          answers={[
            'Meta Moguls is an outgrowth of Young Moguls Brand, a clothing and lifestyle brand created by Brandon Iverson and Jordan Williams.',
            'Since starting the brand while they were in high school in 2016, Young Moguls Brand has sold thousands of pieces to customers across the U.S., and been featured in media outlets such as PBS, Essence Magazine, Black Enterprise, the Steve Harvey Show, and much more!',
            'The pair strive to continue their mission by disrupting the blockchain space by bridging physical business, clothing, and traditional venture capital within an NFT community.',
          ]}
        />
        <FAQSection
          question='How do I get a mogul?'
          answers={[
            'We will be minting through our website starting on February 7th at 9 AM EST',
          ]}
        />
        <FAQSection
          question='What is the minting price?'
          answers={[
            'The minting price for each Mogul will be .05 ETH for Pre sale and .06 ETH for Public Sale',
          ]}
        />
        <FAQSection
          question='Is there a whitelist?'
          answers={[
            'Yes! Our whitelist is open! The whitelist will be rewarded for active and helpful board members. This is a holistic process as we take your engagement, invites, and Twitter shout-outs into account. Check out our discord for more information on the whitelist!',
          ]}
        />
        <FAQSection
          question='What Is the utility of the Meta Moguls?'
          answers={[
            "By collecting the Meta Moguls you'll have a voice in the community and help guide the direction of the project! We have a long-term goal in mind that will set us apart in the NFT space. The NFT grants access to future events, merch, brand partnerships, future collections, giveaways, and more.",
            'With our community fund, we plan on putting you first. The fund will be used to give moguls in the community a chance to vote on investments the team makes for the DAO. In addition, the fund will be used to further the road map including the financial utility for holders.',
          ]}
        />
        <FAQSection
          question='How many Moguls in the Boardroom?'
          answers={[
            'We will have 1,111 Moguls in our incredible Boardroom during Phase 1 Mint!',
          ]}
        />
        <FAQSection
          question='How many Moguls will be held for marketing?'
          answers={[
            'There will be 100 moguls total. The breakdown is 30 moguls are held for the founding team and 70 are held for marketing and business purposes.',
          ]}
        />
        <FAQSection
          question='What are NFTs?'
          answers={[
            'NFT stands for non-fungible token. Unlike BTC, ETH, and even USD, non-fungible tokens are unique assets stored on the blockchain. There are many forms of NFTs including artwork, photography, audio, and more. All NFTs are one-of-a-kind and cannot be officially replicated.',
          ]}
        />
        <FAQSection
          question='How do I buy an NFT?'
          answers={[
            "To buy an NFT, you will need an Ethereum-compatible crypto wallet, such as MetaMask. You'll also need to buy ETH to have in your wallet. ETH can be purchased from an exchange like Coinbase.",
            'You will then transfer your ETH from the exchange to your wallet using your wallet address. MetaMask and Coinbase are not the only options but are the most popular and likely the easiest for someone new to NFTs.',
          ]}
        />
      </div>
    </Layout>
  );
};

export default HomePage;
