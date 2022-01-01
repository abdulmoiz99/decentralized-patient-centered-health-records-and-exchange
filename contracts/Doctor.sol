pragma solidity >=0.4.22 <0.9.0;

contract Doctor {
    
    struct structDoctor {
        uint id;
        string name;
        string hospitalId;
        string position;
        string speciality;
        string qualification;
        string email;
        string phoneNumber;
        string gender;

    }

    mapping(uint => structDoctor) public Doctors;

    constructor () public{

    }
}
