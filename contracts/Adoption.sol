// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Adoption {
    address[16] public adopters; // address is a type and 16 is length send and receive from and to with this address
    // adopters is an array variable

    // function to fill address in array
    function adopt(uint petId) public returns (uint) {
        // type of function parameter and output must be specified
        // id value will be between 0 to 15, index starts with 0
        require(petId >= 0 && petId <= 15);
        // if it satisfies then make address call our adopters array
        // address of person or smart contract who called this function is denoted by message.sender
        adopters[petId] = msg.sender;
        return petId; // for confirmation
        // function to return the entire array
    }

    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }
}