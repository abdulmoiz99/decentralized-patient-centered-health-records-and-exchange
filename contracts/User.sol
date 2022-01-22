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
        Users[usersCount] = structUser(0xE882dB2cF4338Ed26165106D53b573E69154a8e4, 1,"Admin","", true, 0);
        usersCount++;
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
            if (Users[i].id == _connectedAccount && Users[i].active == true) 
            {
                for (uint j = 0; j < _roles.length; j++) 
                {
                    if (Users[i].roleId == _roles[j])  return true;
                }
            }
        }
        return false;
    }

    function getUsername(address _connectedAccount) public view returns (string memory) 
    {
        for(uint i = 0; i < usersCount; i++)
        {
            if (Users[i].id == _connectedAccount) 
            {
                return Users[i].username;
            }
        }

        return "unnamed";
    }

    function getRoleId(address _connectedAccount) public view returns (uint) 
    {
        for(uint i = 0; i < usersCount; i++)
        {
            if (Users[i].id == _connectedAccount) 
            {
                return Users[i].roleId;
            }
        }

        return 0;
    }

    function createUser(address _id, uint _roleId, string memory _username, string memory _password) public returns (bool)
    {
        if(!checkAddress(_id))
        {
            Users[usersCount] = structUser(_id, _roleId, _username, _password, true, block.timestamp);
            usersCount++;
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
    function checkAddress(address _id) public view returns (bool)
    {
        for(uint i = 0; i < usersCount; i++){

            if(Users[i].id == _id)
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

    function getStatus(address _id) public view returns (bool)
    {
        for(uint i = 0; i < usersCount; i++){

            if(Users[i].id == _id)
            {
                return Users[i].active;
            }
        }
        return false;
    }

    function toggleActive(address _id) public returns (bool)
    {
        for(uint i = 0; i < usersCount; i++){

            if(Users[i].id == _id)
            {
                structUser storage user = Users[i];
                if (user.active == true) 
                {
                    user.active = false;
                }
                else
                {
                    user.active = true;
                }
                return true;
            }
        }
        return false;
    }

    function changeName(address _id, string memory _newName) public returns (bool) 
    {
        for(uint i = 0; i < usersCount; i++){

            if(Users[i].id == _id)
            {
                structUser storage user = Users[i];
                user.username = _newName;
                return true;
            }
        }
        return false;
    }

    modifier isAuthorized (address account, uint[] memory roles) {
    require(checkUser(account, roles));
    _;
    }
}
