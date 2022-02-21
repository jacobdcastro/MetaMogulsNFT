//SPDX-License-Identifier: MIT
//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MetaMoguls is ERC721, IERC2981, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private tokenCounter;

    string private baseURI;
    string public verificationHash;
    //address public openSeaProxyRegistryAddress;
    /*bool private isOpenSeaProxyActive = true;*/

    uint256 public MAX_NFTs_PER_WALLET = 10; //removed constant and added set function
    uint256 public maxNFTs;

    uint256 public PUBLIC_SALE_PRICE = 0.06 ether; //removed constant and added set function
    bool public isPublicSaleActive;

    uint256 public ALLOW_LIST_SALE_PRICE = 0.05 ether; //removed constant and added set function
    uint256 public maxAllowListSaleNFTs;
    bytes32 public allowListSaleMerkleRoot =
        0xa7b3433ed25e71fffc4a706fd54565cc745a603b997ed359114fc405bb57a950;
    bool public isAllowListSaleActive;
    bool public REVEAL;

    uint256 public maxGiftedNFTs;
    uint256 public numGiftedNFTs;
    bytes32 public claimListMerkleRoot;

    mapping(address => uint256) public allowListMintCounts;
    mapping(address => bool) public claimed;

    // ============ ACCESS CONTROL/Function MODIFIERS ============

    modifier publicSaleActive() {
        require(isPublicSaleActive, "Public sale is not open");
        _;
    }

    modifier allowListSaleActive() {
        require(isAllowListSaleActive, "Allow list sale is not open");
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
            tokenCounter.current() + numberOfTokens <= maxNFTs - maxGiftedNFTs,
            "Not enough NFTs remaining to mint"
        );
        _;
    }

    modifier canGiftNFTs(uint256 num) {
        require(
            numGiftedNFTs + num <= maxGiftedNFTs,
            "Not enough NFTs remaining to gift"
        );
        require(
            tokenCounter.current() + num <= maxNFTs,
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

    modifier isValidMerkleProof(bytes32[] calldata merkleProof, bytes32 root) {
        require(
            MerkleProof.verify(
                merkleProof,
                root,
                keccak256(abi.encodePacked(msg.sender))
            ),
            "Address does not exist in list"
        );
        _;
    }

    constructor(
        /*address _openSeaProxyRegistryAddress,*/
        uint256 _maxNFTs1,
        uint256 _maxAllowListSaleNFTs,
        uint256 _maxGiftedNFTs,
        string memory _baseURI,
        bool _isPublicSaleActive,
        bool _isAllowListSaleActive,
        bool _REVEAL
    ) ERC721("Meta Moguls", "MOGUL") {
        /*openSeaProxyRegistryAddress = _openSeaProxyRegistryAddress;*/
        maxNFTs = _maxNFTs1;
        maxAllowListSaleNFTs = _maxAllowListSaleNFTs;
        maxGiftedNFTs = _maxGiftedNFTs;
        baseURI = _baseURI;
        REVEAL = _REVEAL;
        isPublicSaleActive = _isPublicSaleActive;
        isAllowListSaleActive = _isAllowListSaleActive;
    }

    // ============ PUBLIC FUNCTIONS FOR MINTING ============

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
            _safeMint(msg.sender, nextTokenId());
        }
    }

    function mintAllowListSale(
        uint8 numberOfTokens,
        bytes32[] calldata merkleProof
    )
        external
        payable
        nonReentrant
        allowListSaleActive
        canMintNFTs(numberOfTokens)
        isCorrectPayment(ALLOW_LIST_SALE_PRICE, numberOfTokens)
        isValidMerkleProof(merkleProof, allowListSaleMerkleRoot)
    {
        uint256 numAlreadyMinted = allowListMintCounts[msg.sender];

        require(
            numAlreadyMinted + numberOfTokens <= MAX_NFTs_PER_WALLET,
            "Max NFTs to mint in allow list sale is ten"
        );

        require(
            tokenCounter.current() + numberOfTokens <= maxAllowListSaleNFTs,
            "Not enough NFTs remaining to mint"
        );

        allowListMintCounts[msg.sender] = numAlreadyMinted + numberOfTokens;

        for (uint256 i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, nextTokenId());
        }
    }

    function claim(bytes32[] calldata merkleProof)
        external
        isValidMerkleProof(merkleProof, claimListMerkleRoot)
        canGiftNFTs(1)
    {
        require(!claimed[msg.sender], "NFT already claimed by this wallet");

        claimed[msg.sender] = true;
        numGiftedNFTs += 1;

        _safeMint(msg.sender, nextTokenId());
    }

    // ============ PUBLIC READ-ONLY FUNCTIONS ============

    function getBaseURI() external view returns (string memory) {
        return baseURI;
    }

    function getLastTokenId() external view returns (uint256) {
        return tokenCounter.current();
    }

    // ============ OWNER-ONLY ADMIN FUNCTIONS ============

    function setBaseURI(string memory _baseURI1) external onlyOwner {
        baseURI = _baseURI1;
    }

    function setReveal(bool _REVEAL) external onlyOwner {
        REVEAL = _REVEAL;
    }

    function setMaxNFTsInTOTALCollection(uint256 _maxNFTs2) external onlyOwner {
        maxNFTs = _maxNFTs2;
    }

    function setMaxAllowListSaleNFTs(uint256 _maxAllowListSaleNFTs)
        external
        onlyOwner
    {
        maxAllowListSaleNFTs = _maxAllowListSaleNFTs;
    }

    function setMaxGiftedNFTs(uint256 _maxGiftedNFTs) external onlyOwner {
        maxGiftedNFTs = _maxGiftedNFTs;
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

    function setALLOW_LIST_SALE_PRICEinEther(uint256 _ALLOW_LIST_SALE_PRICE)
        external
        onlyOwner
    {
        ALLOW_LIST_SALE_PRICE = _ALLOW_LIST_SALE_PRICE;
    }

    function mintOnBehalfOf(address to, uint256[] calldata tokenIds)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _safeMint(to, tokenIds[i]);
        }
    }

    // function to disable gasless listings for security in case
    // opensea ever shuts down or is compromised
    /*function setIsOpenSeaProxyActive(bool _isOpenSeaProxyActive)
        external
        onlyOwner
    {
        isOpenSeaProxyActive = _isOpenSeaProxyActive;
    }*/

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

    function setIsAllowListSaleActive(bool _isAllowListSaleActive)
        external
        onlyOwner
    {
        isAllowListSaleActive = _isAllowListSaleActive;
    }

    function _generateMerkleLeaf(address account)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(account));
    }

    function setAllowListListMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        allowListSaleMerkleRoot = merkleRoot;
    }

    function setClaimListMerkleRoot(bytes32 merkleRoot) external onlyOwner {
        claimListMerkleRoot = merkleRoot;
    }

    function reserveForGifting(uint256 numToReserve)
        external
        nonReentrant
        onlyOwner
        canGiftNFTs(numToReserve)
    {
        numGiftedNFTs += numToReserve;

        for (uint256 i = 0; i < numToReserve; i++) {
            _safeMint(msg.sender, nextTokenId());
        }
    }

    function giftNFTs(address[] calldata addresses)
        external
        nonReentrant
        onlyOwner
        canGiftNFTs(addresses.length)
    {
        uint256 numToGift = addresses.length;
        numGiftedNFTs += numToGift;

        for (uint256 i = 0; i < numToGift; i++) {
            _safeMint(addresses[i], nextTokenId());
        }
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function withdrawTokens(IERC20 token) public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }

    function rollOverNFTs(address[] calldata addresses)
        external
        nonReentrant
        onlyOwner
    {
        require(
            tokenCounter.current() + addresses.length <= 128,
            "All NFTs are already rolled over"
        );

        for (uint256 i = 0; i < addresses.length; i++) {
            allowListMintCounts[addresses[i]] += 1;
            // use mint rather than _safeMint here to reduce gas costs

            _mint(addresses[i], nextTokenId());
        }
    }

    // ============ SUPPORTING FUNCTIONS ============

    function nextTokenId() private returns (uint256) {
        tokenCounter.increment();
        return tokenCounter.current();
    }

    // ============ FUNCTION OVERRIDES ============

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Override isApprovedForAll to allowlist user's OpenSea proxy accounts to enable gas-less listings.
     */
    /*function isApprovedForAll(address owner, address operator)
        public
        view
        override
        returns (bool)
    {
        // Get a reference to OpenSea's proxy registry contract by instantiating
        // the contract using the already existing address.
        ProxyRegistry proxyRegistry = ProxyRegistry(
            openSeaProxyRegistryAddress
        );
        if (
            isOpenSeaProxyActive &&
            address(proxyRegistry.proxies(owner)) == operator
        ) {
            return true;
        }
        return super.isApprovedForAll(owner, operator);
    }*/

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */

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

    /**
     * @dev See {IERC165-royaltyInfo}.
     */
    function royaltyInfo(uint256 tokenId, uint256 salePrice)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        require(_exists(tokenId), "Nonexistent token");

        return (address(this), SafeMath.div(SafeMath.mul(salePrice, 5), 100));
    }
}

// These contract definitions are used to create a reference to the OpenSea
// ProxyRegistry contract by using the registry's address (see isApprovedForAll).
/*contract OwnableDelegateProxy {
}
contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}*/
