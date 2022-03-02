/**
 *Submitted for verification at Etherscan.io on 2022-02-07
 */
// File: MetaMogulsV2.sol

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
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract MetaMogulsV2 is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;

    string private baseURI;
    string public verificationHash;
    uint256 public MAX_NFTs_PER_WALLET = 10;
    uint256 public maxNFTs;
    uint256 public PUBLIC_SALE_PRICE = 0.06 ether;
    bool public isPublicSaleActive;
    bool public REVEAL;

    IERC721 public oldContract;

    uint256 public currentSupply;
    uint256 public v1MintedSupply;

    // v2
    mapping(uint256 => bool) public migratedTokens;
    mapping(address => uint256[]) public userOwnedTokens;

    // ============ ACCESS CONTROL/Function MODIFIERS ============

    modifier publicSaleActive() {
        require(isPublicSaleActive, "Public sale is not open");
        _;
    }

    modifier maxNFTsPerWallet(uint256 numberOfTokens) {
        require(
            balanceOf(msg.sender) + numberOfTokens <= MAX_NFTs_PER_WALLET,
            "Max NFTs to mint is ten"
        );
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
        uint256 _currentSupply
    ) ERC721("Meta Moguls", "MOGUL") {
        maxNFTs = _maxNFTs1;
        baseURI = _baseURI;
        REVEAL = _REVEAL;
        isPublicSaleActive = _isPublicSaleActive;
        currentSupply = _currentSupply;
        v1MintedSupply = _currentSupply;

        if (_oldContract != address(0)) {
            oldContract = IERC721(_oldContract);
        }
    }

    // ============ PUBLIC READ-ONLY FUNCTIONS ============

    function getBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function getLastTokenId() external view returns (uint256) {
        return currentSupply;
    }

    // ============ PRIVATE READ-ONLY FUNCTIONS ============

    function getNextTokenId() private view returns (uint256) {
        require(currentSupply < maxNFTs, "All NFTs have been minted");
        return currentSupply + 1;
    }

    // ============ PRIVATE WRITE FUNCTIONS ============
    function incrementCurrentSupply() private {
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
        maxNFTsPerWallet(numberOfTokens)
    {
        for (uint256 i = 0; i < numberOfTokens; i++) {
            uint256 tokenIdToMint = getNextTokenId();
            // userOwnedTokens[msg.sender].push(getNextTokenId());
            _safeMint(msg.sender, tokenIdToMint);
            migratedTokens[tokenIdToMint] = true;
            incrementCurrentSupply();
        }
    }

    // function transferFrom(
    //     address _from,
    //     address _to,
    //     uint256 _token
    // ) public {
    //     require(
    //         owner == msg.sender ||
    //             allowance[_tokenId] == msg.sender ||
    //             authorised[owner][msg.sender]
    //     );
    // }

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

    function claim(uint256 tokenId) external nonReentrant {
        // require(!claimed[msg.sender], "NFT already claimed by this wallet");
        if (_ownsOldToken(msg.sender, tokenId)) {
            oldContract.transferFrom(msg.sender, address(this), tokenId);

            _safeMint(msg.sender, tokenId);
        }
    }

    function claimAll(uint256[] memory ownedTokens) external nonReentrant {
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
            }
        }
    }

    // ============ OWNER-ONLY ADMIN FUNCTIONS ============

    function setBaseURI(string memory _baseURI1) external onlyOwner {
        baseURI = _baseURI1;
    }

    function setMaxNFTsInTOTALCollection(uint256 _maxNFTs2) external onlyOwner {
        maxNFTs = _maxNFTs2;
    }

    function setMAX_NFTs_PER_WALLET(uint256 _MAX_NFTs_PER_WALLET)
        external
        onlyOwner
    {
        MAX_NFTs_PER_WALLET = _MAX_NFTs_PER_WALLET;
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
