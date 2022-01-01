pragma solidity >=0.4.22 <0.9.0;

contract Role {
    
    struct structRole{
        uint id;
        string name;
        uint256 dateCreated;
        bool active;
    }

    mapping(uint => structRole) public Roles;
   
    constructor () public{
        
    }
}
