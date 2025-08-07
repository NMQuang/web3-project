// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract MyToken is ERC20, Pausable, Ownable {
    using ECDSA for bytes32;

    // Max supply cap (immutable after deploy)
    uint256 public immutable supplyCap;

    // Nonces for EIP-712
    mapping(address => uint256) public nonces;

    string public constant VERSION = "1";
    bytes32 public immutable DOMAIN_SEPARATOR;
    bytes32 public constant TRANSFER_TYPEHASH = keccak256(
        "Transfer(address from,address to,uint256 amount,uint256 nonce,uint256 deadline)"
    );

    constructor(uint256 _cap) ERC20("Demo Token", "DTK") Ownable(msg.sender) {
        require(_cap > 0, "Cap must be > 0");
        supplyCap = _cap;
        _mint(msg.sender, 1000 * 10 ** decimals());

        uint256 chainId;
        assembly {
            chainId := chainid()
        }

        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(name())),
                keccak256(bytes(VERSION)),
                chainId,
                address(this)
            )
        );
    }

    // --- Owner functions ---

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Mint new tokens (onlyOwner)
    function mint(address to, uint256 amount) external onlyOwner whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(totalSupply() + amount <= supplyCap, "Cap exceeded");
        _mint(to, amount);
    }

    // --- Override core ERC20 functions to respect pause ---

    /// @notice Override: transfer with zero address check
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        require(to != address(0), "Invalid recipient");
        return super.transfer(to, amount);
    }

    /// @notice Override: approve
    function approve(address spender, uint256 amount) public override whenNotPaused returns (bool) {
        return super.approve(spender, amount);
    }

    /// @notice Override: transferFrom with zero address check
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused  returns (bool) {
        require(to != address(0), "Invalid recipient");
        return super.transferFrom(from, to, amount);
    }

    // --- EIP-712 Signed Transfer ---

    /// @notice Gasless signed transfer (EIP-712)
    function transferWithSig(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        uint256 deadline,
        bytes memory signature
    ) external {
        require(block.timestamp <= deadline, "Signature expired");
        require(nonce == nonces[from], "Invalid nonce");

        bytes32 structHash = keccak256(
            abi.encode(TRANSFER_TYPEHASH, from, to, amount, nonce, deadline)
        );

        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
        address signer = digest.recover(signature);

        require(signer == from, "Invalid signature");

        nonces[from]++;
        _transfer(from, to, amount);
    }

    /// @notice Signature verification (for frontend)
    function verifySignature(
        address from,
        address to,
        uint256 amount,
        uint256 nonce,
        uint256 deadline,
        bytes memory signature
    ) public view returns (bool) {
        if (block.timestamp > deadline || nonce != nonces[from]) return false;

        bytes32 structHash = keccak256(
            abi.encode(TRANSFER_TYPEHASH, from, to, amount, nonce, deadline)
        );

        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
        address signer = digest.recover(signature);

        return signer == from;
    }
}