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

    mapping(uint => structHospital) public Hospitals;


    constructor () {
    }
}
