// contracts/TreasureNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract AbstraNFTV2 is ERC721EnumerableUpgradeable, OwnableUpgradeable {
    string internal baseURI;
    bool public paused;
    uint256 public airdropAllocation;
    bytes32 public merkleRoot;
    mapping(address => bool) public whitelistAirdrop; // keep track of the number of NFTs per wallet

    event Claimed(address indexed account, uint256 tokenId);

    error InvalidProof();
    error AlreadyClaimed(address account);
    error AirdropHasEnded(uint256 _maxAirdrop);

    /**
      * @dev Emitted when the pause is triggered by `account`.
      */
    event Paused(address account);

    /**
      * @dev Emitted when the pause is lifted by `account`.
      */
    event Unpaused(address account);

    modifier whenNotPaused() {
        require(!paused, "AbstraNFT: paused");
        _;
    }

    function initialize(
        string memory _name,
        string memory _symbol,
        address _admin,
        uint256 _airdropAllocation,
        bytes32 _merkleRoot
    ) external initializer {
        __ERC721_init(_name, _symbol);
        __Ownable_init(_admin);

        airdropAllocation = _airdropAllocation;
        merkleRoot = _merkleRoot;
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(_msgSender());
    }

    function unPause() external onlyOwner {
        paused = false;
        emit Unpaused(_msgSender());
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory baseTokenURI) external onlyOwner {
        baseURI = baseTokenURI;
    }

    function setAirdropAllocation(uint256 allocation) external onlyOwner {
        airdropAllocation = allocation;
    }

    function mint(uint256 tokenId) public whenNotPaused {
        if (tokenId > airdropAllocation) revert AirdropHasEnded(tokenId);
        _safeMint(_msgSender(), tokenId);
    }

    function claim(bytes32[] calldata _merkleProof) external {
        if (whitelistAirdrop[_msgSender()]) revert AlreadyClaimed(_msgSender());

        // Verify the merkle proof.
        bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
        if (!MerkleProof.verify(_merkleProof, merkleRoot, leaf)) revert InvalidProof();

        // Mark it claimed and send the token.
        whitelistAirdrop[_msgSender()] = true;
        uint256 tokenId = totalSupply() + 1;

        mint(tokenId);

        emit Claimed(_msgSender(), tokenId);
    }
}
