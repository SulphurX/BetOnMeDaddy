// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Market
 * @dev A decentralized market for trading options with an order book system using Ether.
 * Users can place buy and sell orders for two options, specifying minimum and maximum prices in Ether.
 */
contract Market {
    enum MarketStage { Inactive, Active, Resolved }  // Stages of the market
    MarketStage public currentStage;       // Current stage of the market

    struct Order {
        address user;        // The address of the user who placed the order
        uint amount;        // The amount of options in the order (in native token)
        uint minPrice;      // Minimum price per option (in wei)
        uint maxPrice;      // Maximum price per option (in wei)
    }

    string public statement;  // The statement or description of the market
    string public yes;        // Name of option "yes"
    string public no;         // Name of option "no"
    string public outcome;     // Final outcome ("yes" or "no")
    address public deployer;   // Address of the deployer

    uint public startTime;     // Start time of the market
    uint public endTime;       // End time of the market

    // Order books for both options
    Order[] public buyOrdersYes;  // List of buy orders for "yes"
    Order[] public sellOrdersYes;  // List of sell orders for "yes"
    Order[] public buyOrdersNo;   // List of buy orders for "no"
    Order[] public sellOrdersNo;  // List of sell orders for "no"

    mapping(address => uint) public holdingsYes;  // User holdings for "yes"
    mapping(address => uint) public holdingsNo;   // User holdings for "no"

    uint voteOnYes;
    uint voteOnNo;

    uint public totalFundsYes;  // Total funds collected for "yes"
    uint public totalFundsNo;   // Total funds collected for "no"

    // List of users who have participated in the market
    address[] public users;

    event BuyOrderPlaced(address indexed user, uint amount, uint price);
    event SellOrderPlaced(address indexed user, uint amount, uint price);
    event OutcomeSet(string outcome);
    event FundsDistributed(address indexed user, uint amount);

    /**
     * @dev Constructor to initialize the market with a statement and two options.
     * The constructor requires an initial funding amount to be sent.
     * @param _statement The statement describing the market.
     * @param _yes The name of option "yes".
     * @param _no The name of option "no".
     */
    constructor(string memory _statement, string memory _yes, string memory _no) payable {
        statement = _statement;
        yes = _yes;
        no = _no;

        // Initial liquidity provision
        totalFundsYes = msg.value / 2; // Half of the initial funds for option 1
        totalFundsNo = msg.value / 2; // Half of the initial funds for option 2

        // Initialize votes
        voteOnYes = 0;
        voteOnNo = 0;
    }

    /**
     * @dev Sets the start and end times for the market.
     * Can only be called by the deployer.
     * @param _duration Duration in seconds for which the market will be active.
     */
    function startMarket(uint _duration) external {
        require(msg.sender == deployer, "Only deployer can start the market");
        require(currentStage == MarketStage.Inactive, "Market is already active");

        startTime = block.timestamp;
        endTime = block.timestamp + _duration;
        currentStage = MarketStage.Active;
    }

    /**
     * @dev Stops the market, preventing further buy/sell actions.
     * Can only be called by the deployer.
     */
    function stopMarket() external {
        require(msg.sender == deployer, "Only deployer can stop the market");
        require(currentStage == MarketStage.Active, "Market is not active");

        currentStage = MarketStage.Inactive;
    }

    /**
     * @dev Normal buy function that buys options at current market prices without specifying a range.
     */
    function buyOption1(uint amount) public payable {
        require(currentStage == MarketStage.Active,"Market is not active");
        require(block.timestamp < endTime,"Market has ended");

        uint totalCost = calculateCurrentMarketPrice(buyOrdersYes) * amount;
        require(msg.value >= totalCost,"Insufficient funds sent");

        holdingsYes[msg.sender] += amount;
        totalFundsYes += msg.value;

        // Add user to users array if they haven't been added yet
        if (holdingsYes[msg.sender] == amount) {
            users.push(msg.sender);
        }

        matchOrders(buyOrdersYes, sellOrdersYes); 

        emit BuyOrderPlaced(msg.sender, amount, totalCost);  // Emit event

        // Refund any excess Ether sent
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost); // Refund excess
        }
    }

    /**
     * @dev Normal sell function that sells options at current market prices without specifying a range.
     */
    function sellOption1(uint amount) public {
        require(currentStage == MarketStage.Active,"Market is not active");
        require(block.timestamp < endTime,"Market has ended");

        require(holdingsYes[msg.sender] >= amount, "Insufficient holdings");

        holdingsYes[msg.sender] -= amount;

        uint totalSaleValue = calculateCurrentMarketPrice(sellOrdersYes) * amount;

        matchOrders(buyOrdersYes, sellOrdersYes); 

        payable(msg.sender).transfer(totalSaleValue);  // Transfer sale value to seller

        emit SellOrderPlaced(msg.sender, amount, totalSaleValue);  // Emit event
    }

    /**
     * @dev Normal buy function that buys options at current market prices without specifying a range.
     */
    function buyOption2(uint amount) public payable {
        require(currentStage == MarketStage.Active,"Market is not active");
        require(block.timestamp < endTime,"Market has ended");

        uint totalCost = calculateCurrentMarketPrice(buyOrdersNo) * amount;
        require(msg.value >= totalCost,"Insufficient funds sent");

        holdingsNo[msg.sender] += amount;
        totalFundsNo += msg.value;

        // Add user to users array if they haven't been added yet
        if (holdingsNo[msg.sender] == amount) {
            users.push(msg.sender);
        }

        matchOrders(buyOrdersNo, sellOrdersNo); 

        emit BuyOrderPlaced(msg.sender, amount, totalCost);  // Emit event

        // Refund any excess Ether sent
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost); // Refund excess
        }
    }

    /**
     * @dev Normal sell function that sells options at current market prices without specifying a range.
     */
    function sellOption2(uint amount) public {
        require(currentStage == MarketStage.Active,"Market is not active");
        require(block.timestamp < endTime,"Market has ended");

        require(holdingsNo[msg.sender] >= amount, "Insufficient holdings");

        holdingsNo[msg.sender] -= amount;

        uint totalSaleValue = calculateCurrentMarketPrice(sellOrdersNo) * amount;

        matchOrders(buyOrdersNo, sellOrdersNo); 

        payable(msg.sender).transfer(totalSaleValue);  // Transfer sale value to seller

        emit SellOrderPlaced(msg.sender, amount, totalSaleValue);  // Emit event
    }

    /**
     * @dev Calculates the current market price based on existing orders.
     */
    function calculateCurrentMarketPrice(Order[] storage orders) internal view returns (uint) {
        if (orders.length == 0) return 0;

        uint totalValue = 0;
        uint totalAmount = 0;

        for (uint i = 0; i < orders.length; i++) {
            totalValue += orders[i].minPrice * orders[i].amount;
            totalAmount += orders[i].amount;
        }

        return totalValue / totalAmount;
    }

    /**
     * @dev Allows the deployer to set the final outcome ("yes" or "no").
     */
    function setOutcome(string memory _outcome) public {
        require(msg.sender == deployer,"Only deployer can set outcome");
        
        require(keccak256(abi.encodePacked(_outcome)) == keccak256(abi.encodePacked("yes")) || 
               keccak256(abi.encodePacked(_outcome)) == keccak256(abi.encodePacked("no")), 
               "Outcome must be 'yes' or 'no'");
        
        outcome = _outcome;

        distributeFunds();  // Distribute funds based on final outcome

        currentStage = MarketStage.Resolved;  // Set stage to Resolved

        emit OutcomeSet(outcome);  // Emit outcome set event
    }

    /**
     * @dev Distributes total funds to users based on their holdings after resolution.
     */
    function distributeFunds() internal {
        if (keccak256(abi.encodePacked(outcome)) == keccak256(abi.encodePacked("yes"))) {
            uint totalHoldings = getTotalHoldings(holdingsYes);
            if (totalHoldings == 0) return;

            for (uint i = 0; i < users.length; i++) {
                address user = users[i];
                uint payout = (totalFundsYes * holdingsYes[user]) / totalHoldings;
                payable(user).transfer(payout);
                emit FundsDistributed(user, payout);  // Emit fund distribution event
            }
            clearOrderData(true);  // Clear data after distribution
                
        } else if (keccak256(abi.encodePacked(outcome)) == keccak256(abi.encodePacked("no"))) {
            uint totalHoldings = getTotalHoldings(holdingsNo);
            if (totalHoldings == 0) return;

            for (uint i = 0; i < users.length; i++) {
                address user = users[i];
                uint payout = (totalFundsNo * holdingsNo[user]) / totalHoldings;
                payable(user).transfer(payout);
                emit FundsDistributed(user, payout);  // Emit fund distribution event
            }
            clearOrderData(false);  // Clear data after distribution
        }
    }

    /**
     * @dev Internal function to get total holdings from a mapping.
     */
    function getTotalHoldings(mapping(address => uint) storage holdings) internal view returns (uint total) {
        total = 0;
        for (uint i = 0; i < users.length; i++) {
            total += holdings[users[i]];
        }
        return total;
    }

    /**
     * @dev Clears order data after distribution.
     */
    function clearOrderData(bool isYesOutcome) internal {
        if (isYesOutcome) {
            delete buyOrdersYes;
            delete sellOrdersYes;
            totalFundsYes = 0;

        } else {
            delete buyOrdersNo;
            delete sellOrdersNo;
            totalFundsNo = 0;
        }
    }

    /**
     * @dev Internal function to match buy and sell orders based on their specified prices in wei.
     */
    function matchOrders(Order[] storage buyOrders, Order[] storage sellOrders) internal {
        while (buyOrders.length > 0 && sellOrders.length > 0) {
            Order memory buyOrder = buyOrders[0];
            Order memory sellOrder = sellOrders[0];

            if (buyOrder.maxPrice >= sellOrder.minPrice) {
                uint tradeAmount = (buyOrder.amount < sellOrder.amount) ? buyOrder.amount : sellOrder.amount;

                payable(sellOrder.user).transfer(tradeAmount * sellOrder.minPrice);

                if (buyOrder.amount > tradeAmount) {
                    buyOrder.amount -= tradeAmount;
                    buyOrders[0] = buyOrder;
                } else {
                    buyOrders[0] = buyOrders[buyOrders.length - 1];
                    buyOrders.pop();
                }

                if (sellOrder.amount > tradeAmount) {
                    sellOrder.amount -= tradeAmount;
                    sellOrders[0] = sellOrder;
                } else {
                    sellOrders[0] = sellOrders[sellOrders.length - 1];
                    sellOrders.pop();
                }
            } else {
                break;
            }
        }
    } 
}