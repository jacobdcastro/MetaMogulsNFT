# MetaMoguls NFT Collection

This NFT project was developed by myself, [Jacob D. Castro](https://twitter.com/jacobdcastro), who fixed a bug in the minting contract and developed a migration mechanism to allow users to "migrate" their V1 NFTs to the V2 contract and provided partial refunds to all who minted on V1.

Project is now live [on OpenSea](https://opensea.io/collection/meta-moguls-genesis).

## Smart Contracts (V1 and V2) and the Bug and Migration, Explained

The NFT smart contracts abide by ERC-721 standards. There are two versions of the minting/NFT contract due to a bug in the first contract as explained below.

### V1 Contract

> The MetaMoguls V1 contract was NOT developed by Jacob D. Castro

Minting had already begun on the project and a majority of the 1,111 NFT collection had been minted. There was unfortunately a bug in the smart contract discovered post-mint which disallowed the art reveal, leaving users unable to view the image of their NFT.

#### Technical Explanation

In the contract, there is a boolean `REVEAL` whose default value was `false`. The `tokenURI` function relied on this boolean value to determine whether it returned the `baseURI` (the default pre-reveal image) or the NFTs actual art according to it's token ID. Code excerpt of this function is shown below.

```s
function tokenURI(uint256 tokenId)
  public
  view
  virtual
  override
  returns (string memory)
{
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

```s
bool public REVEAL;

function setREVEAL(bool _REVEAL) external onlyOwner {
  REVEAL = _REVEAL;
}
```

The situation now: community members had already purchased and minted NFTs on the buggy V1 contract. It would be wrong to ask members to simply spend their money a second time for a new NFT. 

#### My Solution

I decided to write a migration mechanism which would allow V1 NFT holders to 'migrate' their NFTs to the V2 contract. Since this would require the NFT holders to spend gas to migrate, the team and I decided to write a script after migration had completed which would refund the exact amount of gas spent by each holder who migrated.

#### Phase 1 - The Migration



#### Phase 2 - The Refund