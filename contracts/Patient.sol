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
    struct structPatientReport{
        uint reportId;
        address patientAddress;
        string Tittle;
        string Description;
        string Report;
    }
    uint public patientCount = 0;
    uint public reportCount = 0;

    mapping(uint => structPatient) public Patients;
    mapping(uint => structPatientReport) public PatientReports;


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
    function addReport(address _patientAddress, string memory _tittle, string memory _description, string memory _report) public returns (bool) {
            
            PatientReports[reportCount] = structPatientReport(reportCount,_patientAddress, _tittle,  _description,  _report); 
            reportCount ++;
            return true;
    }
    function getReport(address _patientAddress) public view returns(structPatientReport[] memory)
    {
        structPatientReport[] memory patientReport = new structPatientReport[](getReportCount(_patientAddress));
        for (uint i = 0; i <patientCount; i++) 
        {
             if(keccak256(abi.encodePacked(PatientReports[i].patientAddress)) == keccak256(abi.encodePacked(_patientAddress)))
             {
                patientReport[i] = PatientReports[i];
             }
        }
        return patientReport;
    }
    function getReportCount(address _patientAddress) public view returns(uint) {
       
        uint count = 0;
        for (uint i = 0; i <patientCount; i++) 
        {
             if(keccak256(abi.encodePacked(PatientReports[i].patientAddress)) == keccak256(abi.encodePacked(_patientAddress))) count++;
        }
        return count;
    }
}
