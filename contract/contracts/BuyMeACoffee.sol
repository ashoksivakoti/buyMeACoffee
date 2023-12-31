//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;


contract BuyMeACoffee {

    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );
    
    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    
    // Address of contract deployer. Marked payable so that we can withdraw to this address later.
    address payable owner;

    // List of all memos received from coffee purchases.
    Memo[] memos;

    constructor() {
        // Store the address of the deployer as a payable address. When we withdraw funds, we'll withdraw here.
        owner = payable(msg.sender);
    }

        // fetches all stored memos
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

        // function to buy coffee means send tip
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "can't buy coffee for free!");

        // Add the memo to storage!
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a NewMemo event with details about the memo.
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

        // withdrawing the tips
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }
}