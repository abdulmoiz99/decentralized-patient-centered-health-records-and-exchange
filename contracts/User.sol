pragma solidity >=0.4.22 <0.9.0;

contract User {
    
    struct structUser{
        uint id;
        uint roleId;
        string fullName;
        string username;
        string password;
        bool active;
        uint dateCreated;
    }

    mapping(uint => structUser) public Users;
   
    constructor () public{
    }
}
