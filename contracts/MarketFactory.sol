// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Market.sol";  // Import the Market contract

contract MarketFactory {
    
    address public owner;
    uint public marketCount;
    uint public createFee = 1 ether;
    
    // Mapping of market ID to contract address
    mapping(uint => address) public markets;
    
    // Events
    event MarketCreated(uint indexed marketId, address marketAddress);
    event FeeChanged(uint oldFee, uint newFee);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;  // Set the contract deployer as the owner
    }

    // Create a new market contract
    function createMarket(string memory _statement, string memory _yes, string memory _no) external payable onlyOwner {
        require(msg.value == createFee, "Incorrect Ether amount sent");

        marketCount++;
        Market newMarket = new Market{value: msg.value}(_statement, _yes, _no);
        markets[marketCount] = address(newMarket);

        emit MarketCreated(marketCount, address(newMarket));
    }

    // Update the create fee
    function setCreateFee(uint _newFee) external onlyOwner {
        emit FeeChanged(createFee, _newFee);
        createFee = _newFee;
    }

    // Transfer ownership of the factory contract
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        emit OwnershipTransferred(owner, _newOwner);
        owner = _newOwner;
    }

    // Get the market contract address by ID
    function getMarketAddress(uint _marketId) external view returns (address) {
        return markets[_marketId];
    }

    // Fallback function to accept Ether
    receive() external payable {}

    // Reset the market count (for special cases)
    function resetMarketCount() external onlyOwner {
        marketCount = 0;
    }
}