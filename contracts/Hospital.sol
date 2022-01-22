// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Hospital {
    
    struct structHospital{
        uint id;
        string name;
        string email;
        string city;
        string state;
        string postalAddress;
        string country;
        string phoneNumber;
        string accountAddress;
    }
    uint hospitalCount = 0;

    mapping(uint => structHospital) public Hospitals;


    constructor ()
    {

    }
    function getCount() public view returns(uint)
    {
        return hospitalCount;
    }
    function CreateHospital(string memory _name, string memory _email, string memory _city, string memory _state, 
                            string memory _postalAddress, string memory _country, string memory _phoneNumber, string memory _accountAddress)  public  returns (bool)
    {

        
       if(!checkHospital(_accountAddress))
       {
           Hospitals[hospitalCount] = structHospital(hospitalCount, _name, _email, _city, _state,_postalAddress, _country, _phoneNumber, _accountAddress);
           hospitalCount ++;

           return true;
       }
        else {
            return false; // Hospital with the same name already exist
        }
    }
    function updateHospital(uint _id, string memory _name, string memory _location, string memory _city, string memory _state, 
                            string memory _postalCode, string memory _country, string memory _phoneNumber)  public  returns (bool)
    {
         for(uint i = 0; i < hospitalCount; i++){

            if(keccak256(abi.encodePacked(Hospitals[i].id)) == keccak256(abi.encodePacked(_id)) )
            {
                Hospitals[i].name = _name;
                Hospitals[i].email = _location;
                Hospitals[i].city = _city;
                Hospitals[i].state = _state;
                Hospitals[i].postalAddress = _postalCode;
                Hospitals[i].country = _country;
                Hospitals[i].phoneNumber = _phoneNumber;
                return true; // record updated successfully
            }
        }
        return false; // invalid hospital name
    }
    function checkHospital(string memory _address) public view  returns (bool)
    {
        for(uint i = 0; i < hospitalCount; i++){

            if(keccak256(abi.encodePacked(Hospitals[i].accountAddress)) == keccak256(abi.encodePacked(_address)) )
            {
                return true;
            }
        }
        return false;
    }
    function getAll() public view returns (structHospital[] memory)
    {
        structHospital[] memory hospitalList = new structHospital[](hospitalCount+1);
        for (uint i = 0; i <= hospitalCount; i++) 
        {
            hospitalList[i] = Hospitals[i];
        }
        return hospitalList;
    }
    
}
