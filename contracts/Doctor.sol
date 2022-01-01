// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Doctor {
    
    struct structDoctor {
        uint id;
        string name;
        uint hospitalId;
        string position;
        string speciality;
        string qualification;
        string email;
        string phoneNumber;
        string gender;

    }

    mapping(uint => structDoctor) public Doctors;

    constructor () {   }

    //Hold doctor count
    uint public doctorsCount;

     function addDoctor (string memory _name, uint _hospitalId, string memory _position, 
                         string memory _speciality, string memory _qualification, string memory _email, 
                         string memory _phoneNumber, string memory _gender) private {
        doctorsCount ++;
        Doctors[doctorsCount] = structDoctor(doctorsCount, _name,_hospitalId,_position,_speciality,_qualification,_email,_phoneNumber,_gender);
    }
}
