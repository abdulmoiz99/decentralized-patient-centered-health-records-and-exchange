// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Patient {
    
    struct structPatient{
        uint id;
        string fullName;
        string dateOfBirth;
        string CNIC;
        string creatorAddress;
        string PhoneNo;
        string email;
        string status;
        string gender;
        string accountAddress;
        uint dateCreated;
    }
    struct commonMedicalConditions{
        bool AlcoholOrDrugDependence;
        bool Seizure;
        bool HeartDisease;
        bool Blackout;
        bool Stroke;
        bool VisualFieldOrAcuityImpairment;
        bool Diabetes;
        bool MentalOrEmotionalIllness;
        bool DementiaOrAlzheimer;
        bool SleepApneaOrNarcolepsy;
        string other;
    }
    struct structPatientReport{
        uint reportId;
        address patientAddress;
        string Title;
        string Description;
        string Report;
    }
    uint public patientCount = 0;
    uint public reportCount = 0;

    mapping(uint => structPatient) public Patients;
    mapping(uint => commonMedicalConditions) public MedicalConditions;
    mapping(uint => structPatientReport) public PatientReports;

    constructor () {
    }
     function AddPatient(string memory _fullName, string memory _dateOfBirth, string memory _cnic, 
                        string memory _hospitalId, string memory _phoneNo, string memory _email, string memory _status, string memory _gender, string memory _accountAddress) public returns (bool)
    {
            structPatient memory patient;
            patient.fullName = _fullName;
            patient.dateOfBirth = _dateOfBirth;
            patient.CNIC = _cnic;
            patient.creatorAddress = _hospitalId;
            patient.PhoneNo = _phoneNo;
            patient.email = _email;
            patient.status = _status;
            patient.gender = _gender;
            patient.accountAddress = _accountAddress;
            patient.dateCreated = block.timestamp;
            Patients[patientCount] = patient;  
            return true;
      
    }

    function AddMedicalCondition(bool _dependence, bool _seizure, bool _heartDisease, bool _blackout, bool _stroke, bool _VFAI, bool _diabetes, bool _mentalIllness, bool _dementia, bool _sleepApneaOrNarcolepsy, string memory _other) public returns (bool)
    {
        MedicalConditions[patientCount] = commonMedicalConditions(_dependence, _seizure, _heartDisease, _blackout, _stroke, _VFAI, _diabetes, _mentalIllness, _dementia, _sleepApneaOrNarcolepsy, _other);
        patientCount++;
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
