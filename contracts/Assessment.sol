// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// import "hardhat/console.sol";

contract AmazonMall {
    
    address public owner;
    mapping(uint256=>uint256) itemCount;
    mapping(uint256=>uint256) itemPrice;
    mapping(uint256=>bool) itemExists;
    mapping(address=>uint256) balance;

    constructor() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function addItemCount(uint256 item, uint256 count ) public onlyOwner{
        require(itemExists[item],"item doesn't exist");
        itemCount[item] += count;
    }

    function addNewItem( uint256 item, uint256 count, uint256 price ) public onlyOwner{
        require(!itemExists[item],"item already exist");
        itemExists[item] = true;
        itemCount[item] = count;
        itemPrice[item] = price;
    }

    function buyItem( uint256 item, uint256 count ) public {
        require(itemExists[item],"item doesn't exist");
        require(balance[msg.sender]>=itemPrice[item]*count,"you don't have enough balance");
        require(itemCount[item]>=count,"don't have enough of the item");

        itemCount[item] -= count;
        balance[msg.sender] -= itemPrice[item]*count;
    }

    function addNewUser( address addr) public onlyOwner{
        balance[addr] = 7000;
    }

    function getContractAddress() public view returns (address) {
        return address(this);
    }

}
