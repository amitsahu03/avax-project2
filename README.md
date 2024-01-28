# AmazonMall Contract

## Overview

AmazonMall is a smart contract written in Solidity that simulates a basic e-commerce system. It allows the owner to manage inventory, add new items, and handle user transactions.

## Features

- **Inventory Management**: The owner can add new items to the inventory and update the quantity of existing items.

- **User Transactions**: Users can purchase items from the inventory, and their balances are adjusted accordingly.

## Prerequisites

- Solidity ^0.8.9

## Contract Details

### Constructor

The constructor initializes the contract with the owner's address.

### Functions

- **addItemCount**: Allows the owner to update the quantity of an existing item in the inventory.

- **addNewItem**: Allows the owner to add a new item to the inventory along with its initial quantity and price.

- **buyItem**: Allows users to purchase items from the inventory. It deducts the item price from the user's balance and updates the item quantity.

- **addNewUser**: Allows the owner to add a new user to the system with an initial balance of 7000 wei.

- **getContractAddress**: Returns the address of the contract.

## Usage

1. Deploy the `AmazonMall` contract to your preferred Ethereum network.

2. Use the provided functions to manage inventory and handle user transactions.

## License

This contract is provided under an unlicensed status. See the [UNLICENSE](UNLICENSE) file for details.

## Project Setup Instructions

To run this project on your computer after cloning the GitHub repository, follow the steps below:

1. **Install Dependencies:**
   - Navigate to the project directory in the terminal.
   - Run the following command to install project dependencies:
     ```bash
     npm install
     ```

2. **Start Ethereum Node:**
   - Open two additional terminals in your Visual Studio Code or preferred code editor.

   - In the second terminal, start the local Ethereum node using Hardhat:
     ```bash
     npx hardhat node
     ```

3. **Deploy Smart Contract:**
   - In the third terminal, deploy the smart contract to the local Ethereum network:
     ```bash
     npx hardhat run --network localhost scripts/deploy.js
     ```

4. **Launch Front-end:**
   - Go back to the first terminal and start the front-end application:
     ```bash
     npm run dev
     ```

5. **Access the Project:**
   - The project will be accessible on your local machine, typically at [http://localhost:3000/](http://localhost:3000/).

Now, the project is successfully running on your localhost. Ensure to follow these steps in sequence for a smooth setup process.
