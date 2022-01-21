// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Hospital {
    
    struct structHospital{
        uint id;
        string name;
        string location;
        string city;
        string state;
        string postalCode;
        string country;
        string phoneNumber;
    }
    uint hospitalCount = 0;

    mapping(uint => structHospital) public Hospitals;


    constructor ()
    {
        CreateHospital("name","location","city","state","postalcode","country","phoneNumber");
        CreateHospital("name1","location1","city1","state1","postalcode1","country1","phoneNumber1");
        CreateHospital("name2","location1","city1","state1","postalcode1","country1","phoneNumber1");
        CreateHospital("name3","location1","city1","state1","postalcode1","country1","phoneNumber1");

    }
    function getCount() public view returns(uint)
    {
        return hospitalCount;
    }
    function CreateHospital(string memory _name, string memory _location, string memory _city, string memory _state, 
                            string memory _postalCode, string memory _country, string memory _phoneNumber)  public  returns (bool)
    {

        
       if(!checkHospital(_name))
       {
           Hospitals[hospitalCount] = structHospital(hospitalCount, _name, _location, _city, _state,_postalCode, _country, _phoneNumber);
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
                Hospitals[i].location = _location;
                Hospitals[i].city = _city;
                Hospitals[i].state = _state;
                Hospitals[i].postalCode = _postalCode;
                Hospitals[i].country = _country;
                Hospitals[i].phoneNumber = _phoneNumber;
                return true; // record updated successfully
            }
        }
        return false; // invalid hospital name
    }
    function checkHospital(string memory _name) public view  returns (bool)
    {
        for(uint i = 0; i < hospitalCount; i++){

            if(keccak256(abi.encodePacked(Hospitals[i].name)) == keccak256(abi.encodePacked(_name)) )
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
