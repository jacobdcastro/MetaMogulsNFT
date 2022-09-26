# MetaMoguls NFT Collection

This NFT project was (mostly) developed by myself, [Jacob](https://twitter.com/jacobdcastro). I came on to the project to fix a bug in the original minting contract and develop a migration mechanism to allow for users to "migrate" their V1 NFTs to the V2 contract. I also helped the team provide full (or partial) refunds to all who minted on V1.

The project is still live [on OpenSea](https://opensea.io/collection/meta-moguls-genesis).

## Smart Contracts (V1 and V2) and the Bug and Migration, Explained

The NFT smart contracts abide by ERC-721 standards. There are two versions of the minting/NFT contract due to a bug in the first contract as explained below.

### V1 Contract

Minting had begun on the project and a majority of the 1,111 NFT collection had already been minted. There was unfortunately a bug in the smart contract discovered post-mint which disallowed the art reveal, leaving users unable to view the image of their NFT.

(As mentioned before, **I did not develop the V1 contract**. I developed the V2 contract, still in use today, to fix the bug.)

#### Technical Explanation

In the contract, there is a boolean `REVEAL` whose default value was `false`. The `tokenURI` function relied on this boolean value to determine whether it returned the `baseURI` (the default pre-reveal image) or the NFTs actual art according to it's token ID. Code excerpt of this function is shown below.

```
function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
  require(_exists(tokenId), "Nonexistent token");
  if (REVEAL) {
    return string(abi.encodePacked(baseURI, "/", tokenId.toString(), ".json"));
  } else {
    return baseURI;
  }
}
```

The bug was discovered *after* mint had already begun. The issue was that there was no function to change the `REVEAL` value from `false` to `true`. It was not possible to show an individual token ID, only the default pre-reveal image.

Due to the immutable nature of EVM, there was no way to fix this without deploying a new contract.

### V2 Contract

I copied most of the V1 code as it was a valid ERC-721 contract, then immediately added a `setReveal` function to allow for the boolean flip needed to show the NFT art. Code excerpt below.

```
bool public REVEAL;

function setREVEAL(bool _REVEAL) external onlyOwner {
  REVEAL = _REVEAL;
}
```

The situation now: community members had already purchased and minted NFTs on the buggy V1 contract. It would be wrong to ask members to simply spend their money a second time for a new NFT. 

#### My Solution

I decided to write a migration mechanism which would allow V1 NFT holders to 'migrate' their NFTs to the V2 contract. Since this would require the NFT holders to spend gas to migrate, the team and I decided to write a script after migration had completed which would refund the exact amount of gas spent by each holder who migrated.

#### Phase 1 - The Migration

I made the migration an easy process for users on the Metamoguls minting website. It was a multi-step process, consisting of two seperate transactions to complete the migration.

The first transaction was running the `setApprovalForAll` method (an ERC-721 standardized function) on the V1 contract. Doing so gave permission for the V2 contract to move the V1 NFTs out of the user's wallet on their behalf. This permission was the prerequisite for the second transaction: the actual migration function.

To handle the migration, I implemented a function called `claimAll`, which would allow current V1 NFT holders to "claim" their V2 NFTs. Here is the excerpt of the `claimAll` function.

```
function claimAll(uint256[] memory ownedTokens) external nonReentrant whenNotPaused {
  uint256 length = ownedTokens.length; // gas saving
  console.log("ownedTokens.length", length);
  for (uint256 i; i < length; i++) {
    uint256 tokenIdToMint = ownedTokens[i];
    console.log("tokenIdToMint", tokenIdToMint);
    require(
      tokenIdToMint <= v1MintedSupply,
      "Token ID must be minted on old contract"
    );

    if (_ownsOldToken(msg.sender, tokenIdToMint)) {
      oldContract.transferFrom(
        msg.sender,
        address(this),
        tokenIdToMint
      );
      _safeMint(msg.sender, tokenIdToMint);
      allMigratedTokens.push(tokenIdToMint);
      migratedTokensById[tokenIdToMint] = true;
    }
  }
}
```

Breaking down the above function, `claimAll` accepts one parameter, an array of integers, which are the tokenIDs of the NFTs the user wishes to migrate. Then a `for` loop is called to handle the migration of each NFT (by token ID) given.

For each token ID, the function first, using a `require` statement, checks to see if the token ID actually exists as an NFT on the V1 contract. If it exists, the `if` statement then calls a helper function, `_ownsOldToken`, to verify that the wallet calling the function actually owns the token ID it's requesting to migrate. 

If the wallet does own this NFT, let the migration commence!

Firstly, the V1 NFT in question is transferred from the user's wallet to the V2 NFT. This is why the first `setApprovalForAll` transaction was necessary: The V2 contract is the entity that moved the NFTs from the holder's wallet to itself. This was far simpler on users and easier to track than asking every user to manually transfer each NFT to the new contract.

Once the V1 NFT was transferred to the V2 contract, the V2 contract then mints a new NFT of the exact token ID to the wallet that called the function. And just like that, the wallet's V1 NFTs are gone and they own the exact token IDs that they originally minted on V1, but on the new V2 contract, ready to reveal the art.

#### Why transfer the V1 NFTs to the V2 contract?

Transferring the V1 NFTs into the V2 contract effectively burns the original NFTs. The V2 contract has no ability to call the V1 contract's `transfer` function to move the NFTs out of itself, thus keeping the NFTs forever trapped in the V2 contract. 

This solution was better than transferring the NFTs to an externally owned account (non-contract wallet) where the NFTs *could* still be transferred elsewhere. Keeping the V1 NFTs stuck in the contract removes them from circulation entirely, protecting the value of the V2 NFTs. No duplicates here!

#### Phase 2 - The Refund

Since each NFT holder had to run the 2 transactions with their own signatures, they spent unnecessary gas fees due to a bug in the project's contract. Seeing as this is unfair to have community members (literally) pay for the mistakes of a project developer, the team and I decided to refund each wallet the exact amount of gas fees they spent to migrate their NFTs.

I exported the CSV files from etherscan of all transactions on both contracts. I wrote a function that gathered the total gas spent by each wallet on both contracts for the migration (since the step 1 transaction was on the V1 contract, and step 2 on the V2).

Once the data was gathered, I ran a script that used ethers.js and hardhat to execute each refund from the project wallet full of ETH. Each user successfully received the ETH they spent on gas and all was well.

The `refund` script can be found at [contracts/scripts/refund.ts](https://github.com/jacobdcastro/MetaMogulsNFT/blob/main/contract/scripts/refund.ts). 

## The Recovery

The project was, and is, successful. Watching the discord as holders were migrating and finally seeing their art was one of the most satisfying moments of my career. The Metamoguls team is an awesome bunch and I was incredibly grateful for the opportunity to help save the project when they were in trouble.
