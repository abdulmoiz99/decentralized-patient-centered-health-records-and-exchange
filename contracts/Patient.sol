// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Patient {
    
    struct structPatient{
        uint id;
        string fullName;
        string dateOfBirth;
        string CNIC;
        uint hospitalId;
        string PhoneNo;
        string email;
        string status;
        string gender;
       // commonMedicalConditions MedicalConditions;
    }
    struct commonMedicalConditions{
        bool AlcoholDependence;
        bool DurgDependence;
        bool SeizureCerebral;
        bool SeizureAlcoholRelated;
        bool HeatDisease;
        bool Blackout;
        bool Stroke;
        bool VisualImpairment;
        bool VisualAcuityImpairment;
        bool VisualFieldImpairment;
        bool Diabetes;
        bool MentalOrEmotionalIllness;
        bool DementiaOrAlzheimer;
        bool SleepApnea;
        bool Narcolesy;
        bool MotorFucntionAbilityImpaired;
        bool Other;
    }
    uint patientCount = 0;
    mapping(uint => structPatient) public Patients;

    constructor () {
        AddPatient("AbdulMoiz", "08/05/2025", "42401123123123", 1, "923142313111", "abdulmoiz@gmail.com", "healthy", "male");
    }
     function AddPatient( string memory _fullname, string memory _dateOfBirth, string memory _cnic, 
                        uint _hospitalId, string memory _phoneNo, string memory _email, string memory _status, string memory _gender) public returns (bool)
    {
            Patients[patientCount] = structPatient( patientCount,_fullname, _dateOfBirth,  _cnic,  _hospitalId, _phoneNo, _email,  _status, _gender); 
            patientCount ++;
            return true;
      
    }
    function getAll() public view returns (structPatient[] memory)
    {
        structPatient[] memory hospitalList = new structPatient[](patientCount+1);
        for (uint i = 0; i <patientCount; i++) 
        {
            hospitalList[i] = Patients[i];
        }
        return hospitalList;
    }
}
