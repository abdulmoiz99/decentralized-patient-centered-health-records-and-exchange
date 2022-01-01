// SPDX-License-Identifier: MIT
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
    //Holds user count 
    uint public usersCount;
    
    constructor () {
    }
    // user login function
    function login(string memory _username, string memory _password)  public view returns (bool)
    {
        for(uint i = 0; i < usersCount; i++){

            if(keccak256(abi.encodePacked(Users[i].username)) == keccak256(abi.encodePacked(_username)) && 
               keccak256(abi.encodePacked(Users[i].password)) == keccak256(abi.encodePacked(_password)) )
            {
                return true;
            }
        }
        return false;
    }

    function createUser(string memory _username, string memory _password) public returns (bool)
    {
        if(!checkUsername(_username))
        {
            usersCount ++;
            Users[usersCount] = structUser(usersCount,1,"Abdul Moiz",_username,_password, true, 0);
            return true;
        }
        else 
        {
            return false;
        }
    }
    function checkUsername(string memory _username) private view  returns (bool)
    {
        for(uint i = 0; i < usersCount; i++){

            if(keccak256(abi.encodePacked(Users[i].username)) == keccak256(abi.encodePacked(_username)) )
            {
                return true;
            }
        }
        return false;
    }

}
