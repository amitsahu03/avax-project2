import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import amitKumarWalletAbi from "../artifacts/contracts/Assessment.sol/AmazonMall.json"

export default function HomePage() {
  const [amitWallet, setAmitWallet] = useState(undefined);
  const [amitAccount, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [itemList, setItemList] = useState({});

  const newItemIdRef = useRef();
  const newItemNameRef = useRef();
  const newItemPriceRef = useRef();
  const newItemCountRef = useRef();

  const addItemIdRef = useRef();
  const addItemCountRef = useRef();

  const addUserRef = useRef();

  const contractAddress = "0xD9020c84eF2209323204484ab58106773e686303";
  const owner = "0xD9020c84eF2209323204484ab58106773e686303";
  const atmABI = amitKumarWalletAbi.abi;

  const getWalletAddress = async () => {
    if (window.ethereum) {
      setAmitWallet(window.ethereum);
    }

    if (amitWallet) {
      try {
        const accounts = await amitWallet.request({ method: "eth_accounts" });
        accoundHandler(accounts);
      } catch (error) {
        console.log("error", error)
      }
    }
  };

  const accoundHandler = (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No amitAccount found");
    }
  };


  const connectToMetamask = async () => {
    if (!amitWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await amitWallet.request({ method: "eth_requestAccounts" });
    accoundHandler(accounts);

    // once wallet is set, we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(amitWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const addNewItem = async () => {

    let ID = parseInt(newItemIdRef.current.value);
    let count = parseInt(newItemCountRef.current.value);
    let price = parseInt(newItemPriceRef.current.value);
    let name = newItemNameRef.current.value;


    try {
      if (atm) {
        let tx = await atm.addNewItem(ID, count, price);
        await tx.wait();

        let amazonitems = JSON.parse(localStorage.getItem('amazonitems'));
        let newAmazonItems = {
          ...amazonitems,
          [`${ID}`]: {
            id: ID, price, count, name
          }
        }
        newAmazonItems = JSON.stringify(newAmazonItems);
        localStorage.setItem('amazonitems', newAmazonItems);

        newItemIdRef.current.reset();
        newItemNameRef.current.reset();
        newItemCountRef.current.reset();
        newItemPriceRef.current.reset();

        console.log(`new item added successfully`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }

  const addItemCount = async () => {

    let count = parseInt(addItemCountRef.current.value);
    let ID = parseInt(addItemIdRef.current.value);

    try {
      if (atm) {
        let tx = await atm.addItemCount(ID, count);
        await tx.wait();

        let amazonitems = JSON.parse(localStorage.getItem('amazonitems'));

        let newAmazonItems = { ...amazonitems };
        amazonitems[`${ID}`].count += count;

        newAmazonItems = JSON.stringify(newAmazonItems);
        localStorage.setItem('amazonitems', newAmazonItems);

        addItemCountRef.current.reset();
        addItemIdRef.current.reset();

        console.log(`new item updated successfully`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }

  const buyItem = async (itemkey) => {
    const li = document.querySelector(`#id${itemkey} .buycount`);
  
    let item = parseInt(itemkey);
    let count = parseInt(li.value);

    try {
      if (atm) {
        let tx = await atm.buyItem(item, count);
        await tx.wait();

        let amazonitems = JSON.parse(localStorage.getItem('amazonitems'));
        let newAmazonItems = { ...amazonitems };

        newAmazonItems[itemkey].count -= count;

        newAmazonItems = JSON.stringify(newAmazonItems);
        localStorage.setItem('amazonitems', newAmazonItems);

        console.log(`item bought`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }

  const addNewUser = async () => {

    let addr = addUserRef.current.value;

    try {
      if (atm) {
        let tx = await atm.addNewUser(addr);
        await tx.wait();

        console.log(`user registered`);
      }
    } catch (error) {
      console.log("SOMETHING WENT WRONG");
      console.log(error);
    }
  }

  const getAllItems = () => {
    let amazonitems = JSON.parse(localStorage.getItem('amazonitems') ) || {};
    setItemList(amazonitems);

    console.log(amazonitems);
  }


  useEffect(() => {
    getWalletAddress();
  }, []);


  return (
    <main className="container">
      <header>
        <h1>Amazon Mall</h1>
      </header>
      <div className="content">
        {!amitAccount ? (<button onClick={connectToMetamask}>Start Amazon Mall</button>)
          : (
            <>
              <div className="mydiv">
                <h2>Only for Admin</h2>
                <div className="btn-input">
                  <button onClick={addNewItem}>Add New Item</button>
                  <div>
                    <input ref={newItemIdRef} type="number" placeholder="Item Id"></input>
                    <input ref={newItemNameRef} type="text" placeholder="name"></input>
                    <input ref={newItemPriceRef} type="number" placeholder="Price"></input>
                    <input ref={newItemCountRef} type="number" placeholder="Count"></input>
                  </div>

                </div>

                <div className="btn-input">
                  <button onClick={addItemCount}>Add Item Count</button>
                  <div>
                    <input ref={addItemIdRef} type="number" placeholder="Item Id"></input>
                    <input ref={addItemCountRef} type="number" placeholder="Count"></input>
                  </div>
                </div>

                <div className="btn-input">
                  <button onClick={addNewUser}>Add new user</button>
                  <div>
                    <input ref={addUserRef} type="text" placeholder="Address"></input>
                  </div>
                </div>

              </div>
            </>
          )
        }

        {
          !amitAccount ? <></> :
            <>
              <div className="mydiv">
                <h2>For all Users</h2>

                <h3>List of Items <button onClick={getAllItems}>Get</button></h3>
                <ul className="item-list">
                  {
                    Object.keys(itemList).length === 0 ?
                  <li>No Items added</li>
                  :
                    Object.keys(itemList).map(itemKey => (
                  <li id={"id" + itemKey} key={itemKey}>
                    {itemList[itemKey].name} 
                    <br></br>
                    Price : { itemList[itemKey].price }
                    <br></br>
                    Count : { itemList[itemKey].count }
                    <div className="btn-input">
                      <button onClick={() => buyItem(itemKey)}>buyItem</button>
                      <input className="buycount" type="number" placeholder="count"></input>
                    </div>
                  </li>
                  ))
                  }
                </ul>
              </div>
            </>
        }
      </div>


      <style jsx>{`
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f0f0f0;
      }
      
      header {
        background-color: #1976d2;
        color: #fff;
        text-align: center;
        padding: 20px 0;
      }
      
      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
      }
      
      .mydiv {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 20px;
        width: 60vw;
        
      }
      
      .mydiv h2 {
        margin-bottom: 10px;
        color: #333;
      }
      
      .btn-input {
        margin-bottom: 10px;
      }
      
      .btn-input button {
        padding: 10px 20px;
        background-color: #4CAF50;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      .btn-input button:hover {
        background-color: #45a049;
      }
      
      .btn-input input {
        margin-right: 5px;
        padding: 8px;
        border-radius: 5px;
        border: 1px solid #ccc;
      }
      
      .item-list {
        list-style-type: none;
        padding: 0;
      }
      
      .item-list li {
        margin-bottom: 20px;
        padding: 15px;
        background-color: #f9f9f9;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .item-list li:last-child {
        margin-bottom: 0;
      }
      
      .item-list li .btn-input {
        display: flex;
        align-items: center;
      }
      
      .item-list li .btn-input button {
        padding: 8px 15px;
        background-color: #4CAF50;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }
      
      .item-list li .btn-input button:hover {
        background-color: #45a049;
      }
      
      .item-list li .btn-input input {
        margin-left: 10px;
        padding: 8px;
        border-radius: 5px;
        border: 1px solid #ccc;
      }

      .item-list li {
        font-size : 1.5rem;
        font-weight : bold;
        
      }
      
`}</style>
    </main>
  );
}
