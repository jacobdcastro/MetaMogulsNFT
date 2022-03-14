//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract MetaMogulsV2 is ERC721, Ownable, ReentrancyGuard, Pausable {
    using Strings for uint256;

    string private baseURI;
    string public verificationHash;
    uint256 public maxNFTs;
    uint256 public PUBLIC_SALE_PRICE = 0.06 ether;
    bool public isPublicSaleActive;
    bool public REVEAL;

    IERC721 public oldContract;

    uint256 public currentSupply;
    uint256 public v1MintedSupply;

    // v2
    uint256[] public allMigratedTokens;
    mapping(uint256 => bool) public migratedTokensById;
    uint256[] private reserveTokenIdsMinted;

    // ============ ACCESS CONTROL/Function MODIFIERS ============

    modifier publicSaleActive() {
        require(isPublicSaleActive, "Public sale is not open");
        _;
    }

    modifier canMintNFTs(uint256 numberOfTokens) {
        require(
            currentSupply + numberOfTokens <= maxNFTs,
            "Not enough NFTs remaining to mint"
        );
        _;
    }

    modifier isCorrectPayment(uint256 price, uint256 numberOfTokens) {
        require(
            price * numberOfTokens == msg.value,
            "Incorrect ETH value sent"
        );
        _;
    }

    constructor(
        uint256 _maxNFTs1,
        string memory _baseURI,
        bool _isPublicSaleActive,
        bool _REVEAL,
        address _oldContract,
        uint256 _currentSupply,
        uint256 _initialReserveCount
    ) ERC721("Meta Moguls", "MOGUL") {
        maxNFTs = _maxNFTs1;
        baseURI = _baseURI;
        REVEAL = _REVEAL;
        isPublicSaleActive = _isPublicSaleActive;
        currentSupply = _currentSupply;
        v1MintedSupply = _currentSupply;

        // set v1 contract address
        if (_oldContract != address(0)) {
            oldContract = IERC721(_oldContract);
        }

        // mint reserved NFTs to team wallet for contests, etc.
        for (uint256 i = 1; i <= _initialReserveCount; i++) {
            if (i <= 5) {
                //first, mint the final 5 tokenIds reserved (1107-1111)
                uint256 tokenIdToMint = maxNFTs - (i - 1);
                _safeMint(msg.sender, tokenIdToMint);
                reserveTokenIdsMinted.push(tokenIdToMint);
            } else {
                // second, mint the next available 55 tokenIds
                uint256 tokenIdToMint = getNextTokenId();
                _safeMint(msg.sender, tokenIdToMint);
                reserveTokenIdsMinted.push(tokenIdToMint);
            }
            incrementCurrentSupply();
        }
    }

    // ============ PUBLIC READ-ONLY FUNCTIONS ============

    function getBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function getLastTokenId() external view returns (uint256) {
        // minus 5 to compensate for reserved tokenIds 1107-1111
        return currentSupply - 5;
    }

    function getAllMigratedTokens() public view returns (uint256[] memory) {
        return allMigratedTokens;
    }

    function tokenHasBeenMigrated(uint256 tokenId) public view returns (bool) {
        require(
            tokenId <= v1MintedSupply,
            "Cannot check migration status of v2 NFT"
        );
        return migratedTokensById[tokenId];
    }

    function getReserveTokenIdsMinted() public view returns (uint256[] memory) {
        return reserveTokenIdsMinted;
    }

    function getCurrentMintedSupply() public view returns (uint256) {
        return currentSupply;
    }

    // ============ PRIVATE READ-ONLY FUNCTIONS ============

    function getNextTokenId() private view returns (uint256) {
        require(currentSupply < maxNFTs, "All NFTs have been minted");
        // minus 5 to compensate for reserved tokenIds 1107-1111
        return (currentSupply - 5) + 1;
    }

    // ============ PRIVATE WRITE FUNCTIONS ============
    function incrementCurrentSupply() private {
        require(currentSupply < maxNFTs, "All NFTs have been minted");
        currentSupply++;
    }

    // ============ PUBLIC FUNCTIONS ============

    function mint(uint256 numberOfTokens)
        external
        payable
        nonReentrant
        isCorrectPayment(PUBLIC_SALE_PRICE, numberOfTokens)
        publicSaleActive
        canMintNFTs(numberOfTokens)
        whenNotPaused
    {
        for (uint256 i = 0; i < numberOfTokens; i++) {
            uint256 tokenIdToMint = getNextTokenId();
            _safeMint(msg.sender, tokenIdToMint);
            incrementCurrentSupply();
        }
    }

    // ============ V2 MIGRATION FUNCTIONS ============

    function _ownsOldToken(address account, uint256 tokenId)
        private
        view
        returns (bool)
    {
        try oldContract.ownerOf(tokenId) returns (address tokenOwner) {
            return account == tokenOwner;
        } catch Error(
            string memory /*reason*/
        ) {
            return false;
        }
    }

    function claim(uint256 tokenId) external nonReentrant whenNotPaused {
        // require(!claimed[msg.sender], "NFT already claimed by this wallet");
        if (_ownsOldToken(msg.sender, tokenId)) {
            oldContract.transferFrom(msg.sender, address(this), tokenId);

            _safeMint(msg.sender, tokenId);
        }
    }

    function claimAll(uint256[] memory ownedTokens)
        external
        nonReentrant
        whenNotPaused
    {
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

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "Nonexistent token");
        if (REVEAL) {
            return
                string(
                    abi.encodePacked(baseURI, "/", tokenId.toString(), ".json")
                );
        } else {
            return baseURI;
        }
    }

    // ============ OWNER-ONLY ADMIN FUNCTIONS ============

    function setBaseURI(string memory _baseURI1) external onlyOwner {
        baseURI = _baseURI1;
    }

    function setMaxNFTsInTOTALCollection(uint256 _maxNFTs2) external onlyOwner {
        maxNFTs = _maxNFTs2;
    }

    function setPUBLIC_SALE_PRICEinEther(uint256 _PUBLIC_SALE_PRICE)
        external
        onlyOwner
    {
        PUBLIC_SALE_PRICE = _PUBLIC_SALE_PRICE;
    }

    function setREVEAL(bool _REVEAL) external onlyOwner {
        REVEAL = _REVEAL;
    }

    function setVerificationHash(string memory _verificationHash)
        external
        onlyOwner
    {
        verificationHash = _verificationHash;
    }

    function setIsPublicSaleActive(bool _isPublicSaleActive)
        external
        onlyOwner
    {
        isPublicSaleActive = _isPublicSaleActive;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function withdrawTokens(IERC20 token) public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }
}
