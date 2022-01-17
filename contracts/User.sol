// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract User {
    
    struct structUser{
        address id;
        uint roleId;
        string username;
        string password;
        bool active;
        uint dateCreated;
    }

    mapping(uint => structUser) public Users;

    //Holds user count 
    uint public usersCount = 0;
    
    constructor () {
        //For testing purpose only 
        // Users[usersCount] = structUser("0xasdasdasd",1,"admin","123", true, 0);
        Users[usersCount] = structUser(0xf517c1b3917033D7344688600AA0ed8d643BF131, 1,"admin","123", true, 0);
        usersCount ++;
    }
    // user login function
    function checkUser(address _connectedAccount, uint[] memory _roles)  public view returns (bool)
    {
        for(uint i = 0; i < usersCount; i++){

            // if(keccak256(abi.encodePacked(Users[i].username)) == keccak256(abi.encodePacked(_username)) && 
            //    keccak256(abi.encodePacked(Users[i].password)) == keccak256(abi.encodePacked(_password)) )
            // {
            //     return true;
            // }
            if (Users[i].id == _connectedAccount) 
            {
                for (uint j = 0; j < _roles.length; j++) 
                {
                    if (Users[i].roleId == _roles[j])  return true;
                }
            }
        }
        return false;
    }
    function createUser(string memory _username, string memory _password) public returns (bool)
    {
        if(!checkUsername(_username))
        {
            Users[usersCount] = structUser(msg.sender,1,_username,_password, true, 0);
            usersCount ++;
            return true;
        }
        else 
        {
            return false;
        }
    }
    function checkUsername(string memory _username) public view  returns (bool)
    {
        for(uint i = 0; i < usersCount; i++){

            if(keccak256(abi.encodePacked(Users[i].username)) == keccak256(abi.encodePacked(_username)) )
            {
                return true;
            }
        }
        return false;
    }
    function getAll() public view returns (structUser[] memory)
    {
        structUser[] memory UserList = new structUser[](usersCount+1);
        for (uint i = 0; i <= usersCount; i++) 
        {
            UserList[i] = Users[i];
        }
        return UserList;
    }

    modifier isAuthorized (address account, uint[] memory roles) {
    require(checkUser(account, roles));
    _;
}
}
