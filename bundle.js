(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// script.js

// Divya Functions

// Array to hold donation data temporarily
const donationData = [];

// Function to validate donation form inputs
function validateDonationForm(charityName, donationAmount, donationDate, donationMessage){

    const validateInputs = {charity: "", amount: "", date: "", message: ""};

    // Validate Charity Name
    if (charityName.trim() === "") {
        showErrorMessage("charityName", "Charity name cannot be empty.");
    } else {
        validateInputs.charity = charityName.trim();
    }

    // Validate Donation Amount
    if (isNaN(donationAmount) || Number(donationAmount) <= 0) {
        showErrorMessage("donationAmount", "Donation amount must be a positive number.");
    } else {
        validateInputs.amount = Number(donationAmount);
    }

    // Validate Donation Date
    const datePattern = /(\d{4})-(\d{2})-(\d{2})/; // YYYY-MM-DD format
    if (!datePattern.test(donationDate)) {
        showErrorMessage("donationDate", "Donation date must be in YYYY-MM-DD format.");
    } else {
        validateInputs.date = donationDate;
    }
    
    // Validate Donation Message
    if (donationMessage.trim() === "") {
        showErrorMessage("donorMessage", "Donation message cannot be empty.");
    } else {
        validateInputs.message = donationMessage.trim();
    }

    console.log("Validated Inputs:", validateInputs);
    return validateInputs;
}

// Function to display error messages
function showErrorMessage(fieldName, message) {
    const errorField = document.getElementById(fieldName + "_error");
    if(!errorField) 
        return;
    // Set the error message
    errorField.innerText = message;
}

// Function to clear all error messages
function clearErrorMessages() {
    document.querySelectorAll(".error-message").forEach(field => {
        field.innerText = "";
    });
}

// function to save donation data to local storage (part02)
function saveDonationData() {
    localStorage.setItem("donationData", JSON.stringify(donationData));
}   

// function to load donation data from local storage
function loadDonationData() {
    const data = localStorage.getItem("donationData");  
    if (data) {
       const parsed = JSON.parse(data);

       donationData.length = 0; // Clear existing data
       donationData.push(...parsed); // Load saved data
    }
}

// total donation amount calculation
function calculateTotalDonations(donationData) {
    return donationData.reduce((total, donation) => total + donation.amount, 0);                          
}

// render donation table

function renderDonationList() {
    const donationListBody = document.getElementById("donationListBody");
    donationListBody.innerHTML = "";

    donationData.forEach((donation, index) => {
        const item = document.createElement("tr");

        item.innerHTML = `
            <td>${donation.charity}</td>
            <td>$${donation.amount.toFixed(2)}</td>
            <td>${donation.date}</td>
            <td>${donation.message}</td>
            <td>
            <button class="delete-donation" data-index="${index}">Delete</button>
            </td>
        `;
        donationListBody.appendChild(item);
    });

// update total donations display
document.getElementById("totalDonations").textContent = calculateTotalDonations().toFixed(2);

}

// delete donation entry
function deleteDonation(index) {
    donationData.splice(index, 1);
    saveDonationData();
    renderDonationList();
}

// Submission handler for donation page
function initializeDonationForm(){
    const form = document.getElementById("donationForm");

    loadDonationData();
    renderDonationList();

    if (!form) return; 
    {

        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent form submission
            clearErrorMessages();

            // Get form values
            const charityName = document.getElementById("charityName").value;
            const donationAmount = document.getElementById("donationAmount").value;
            const donationDate = document.getElementById("donationDate").value;
            const donationMessage = document.getElementById("donorMessage").value;

            const validatedData = validateDonationForm(charityName, donationAmount, donationDate, donationMessage);

            // If all fields are valid, proceed with form submission logic
            if (validatedData.charity && validatedData.amount && validatedData.date && validatedData.message) {
                donationData.push(validatedData);
                saveDonationData();
                renderDonationList();

                form.reset(); // Clear the form
 }
        });
    }

    // delete button handler
    document.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-donation")) {
            const index = event.target.getAttribute("data-index");
            deleteDonation(index);
        }
    });
}

// Initialize event handlers on page load
//window.addEventListener("DOMContentLoaded", initializeDonationForm);

//export { validateDonationForm, showErrorMessage, clearErrorMessages, initializeDonationForm };



// Jasmine Functions
let eventData = {
        eventName: "",
        representativeName: "",
        representativeEmail: "",
        companyRole: ""
};

function onSubmit(e) {
    // hides the unnecessary errors
    hideAllErrors()
    
    // validation and data handling
    if (formHasErrors()) {
		e.preventDefault();
	} else {
        getEventData(eventData);

        // prevents default but resets form
        e.preventDefault();
        document.getElementById("eventSignupForm").reset();

        // save data and create table
        saveEventData(eventData);
        createEventTableItems();
    }  
}

function getEventData(eventData) {
    eventData['eventName'] = document.getElementById("eventName").value;
    eventData['representativeName'] = document.getElementById("representativeName").value;
    eventData['representativeEmail'] = document.getElementById("representativeEmail").value;
    eventData['companyRole'] = document.getElementById("roleSelection").value;

    console.log(eventData);
}

function formHasErrors() {
    let errorFlag = false;

    // check for empty text field
    let requiredFields = ["eventName", "representativeName", "representativeEmail"];

    for(let i=0; i<requiredFields.length; i++) {
		let textField = document.getElementById(requiredFields[i]);

		if (textField.value == null || trim(textField.value) == "") { 
			document.getElementById(requiredFields[i] + "Error").style.display = "block";
			
			if(!errorFlag) {
				textField.focus();
				textField.select();
			}

		    errorFlag = true;
		}
    }
        
    // check for valid email
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let email = document.getElementById("representativeEmail").value;

    if (!email.match(emailRegex)) {
        document.getElementById("representativeEmailError").style.display = "block";
            
        if(!errorFlag) {
            document.getElementById("representativeEmail").focus();
            document.getElementById("representativeEmail").select();
        }    

        errorFlag = true;   
    }

    // dropdown validation
    if (document.getElementById("roleSelection").value == "") {
        document.getElementById("roleSelectionError").style.display = "block";
            
        errorFlag = true;
    }

    return errorFlag;
	}

function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

function hideAllErrors() {
	let errorFields = document.getElementsByClassName("error");
	
	for(let i=0; i<errorFields.length; i++) {
	    errorFields[i].style.display = "none";
	}
}

// JASMINE PART 2
function saveEventData(eventData) {
    let allEventData = JSON.parse(localStorage.getItem("allEventData")) || [];

    allEventData.push(eventData);

    localStorage.setItem("allEventData", JSON.stringify(allEventData));
}

function createEventTableItems() {
    let allEventData = JSON.parse(localStorage.getItem("allEventData"));

    document.getElementById("eventItems").innerHTML = "";
    
    if (allEventData) {       
        allEventData.forEach((item, index) => {

            let eventNameTD = document.createElement("td");
            eventNameTD.innerHTML = item.eventName;

            let representativeNameTD = document.createElement("td");
            representativeNameTD.innerHTML = item.representativeName;

            let representativeEmailTD = document.createElement("td");
            representativeEmailTD.innerHTML = item.representativeEmail;

            let companyRoleTD = document.createElement("td");
            companyRoleTD.innerHTML = item.companyRole;

            let deleteButton = document.createElement("button");
            deleteButton.textContent = " X ";
            deleteButton.type = "button";
            deleteButton.addEventListener("click", function() {
                deleteEvent(index);
            });

            let deleteButtonTD = document.createElement("td");
            deleteButtonTD.appendChild(deleteButton);

            let tr = document.createElement("tr");
            tr.appendChild(eventNameTD);
            tr.appendChild(representativeNameTD);
            tr.appendChild(representativeEmailTD);
            tr.appendChild(companyRoleTD);
            tr.appendChild(deleteButtonTD);

            document.getElementById("eventItems").appendChild(tr);
        })
    }

    summarizeEvents();
}

function deleteEvent(eventIndex) {
    let allEventData = JSON.parse(localStorage.getItem("allEventData"));

    allEventData.splice(eventIndex, 1);

    localStorage.setItem("allEventData", JSON.stringify(allEventData));
    console.log(localStorage.getItem("allEventData"));

    createEventTableItems();
}

function summarizeEvents() {
    let allEventData = JSON.parse(localStorage.getItem("allEventData"));
    
    let sponsor = 0;
    let organizer = 0;
    let participant = 0;

    // get data summary
    if (allEventData) {
        document.getElementById("eventSummaryTable").innerHTML =
        `<table class="inter-general" id="eventSummaryTable">
                <thead>
                    <tr>
                        <th>Sponsor</th>
                        <th>Organizer</th>
                        <th>Participant</th>
                    </tr>
                </thead>
                <tbody id="eventSummaryItems">
                    <!-- Event Summary goes here -->
                </tbody>
            </table>`

        allEventData.forEach((item) => {
            let companyRole = item.companyRole;
    
            if(companyRole == "Sponsor") {
                sponsor += 1;
            } else if(companyRole == "Organizer"){
                organizer += 1;
            } else if(companyRole == "Participant") {
                participant += 1;
            }
        });
        
        // make table
        document.getElementById("eventSummaryItems").innerHTML = "";

        let sponsorTD = document.createElement("td");
        sponsorTD.innerHTML = sponsor;

        let organizerTD = document.createElement("td");
        organizerTD.innerHTML = organizer;
        
        let participantTD = document.createElement("td");
        participantTD.innerHTML = participant;

        let tr = document.createElement("tr");
        tr.appendChild(sponsorTD);
        tr.appendChild(organizerTD);
        tr.appendChild(participantTD);

        document.getElementById("eventSummaryItems").appendChild(tr);
    } else {
        document.getElementById("eventSummaryTable").innerHTML = 
        `<p>There are currently no upcoming events :)`
    }
 

    console.log(`Sponsor: ${sponsor} | Organizer: ${organizer} | Participant: ${participant}`);
}

// Owen Functions

let retrievedVolunteerData = []

// Form validation

function validateVolunteerForm(charityNameInput, volunteerHoursInput, 
    volunteerDateInput, volunteerRatingInput, retrievedVolunteerData) {

    // date validation setup
    const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
    const [, year, month, day] = volunteerDateInput.match(dateRegex);
    const inputDate = new Date(year, month - 1, day);
    const todayDate = new Date();

    // temp data object
    const validatedInputs = {name: null, hours: null, date: null, rating: null};

    // Charity name validation 

    if (charityNameInput === "") {
        console.log("Charity name blank")
        showFormErrorMessage("charity_name", "Charity name cannot be blank.")
    } else {
        validatedInputs.name = charityNameInput;
    }

    // Hours validation

    if (typeof(volunteerHoursInput) !== "number") {
        console.log("Volunteer Hours Input: Invalid data type.")
        showFormErrorMessage("hours_volunteered", "Invalid data type.")
    } else if (volunteerHoursInput < 0) {
        console.log("Volunteer Hours Input: Value must be positive.")
        showFormErrorMessage("hours_volunteered", "Hours must be a positive number.")
    } else {
        validatedInputs.hours = volunteerHoursInput;
    }

    // Date validation  

    if (!(inputDate instanceof Date)) {
        console.log("Volunteer Date Input: Invalid data type.")
        showFormErrorMessage("date_volunteered", "Invalid data type.")
    } else if (inputDate >= todayDate) {
        console.log("Volunteer Date Input: Invalid date.")
        showFormErrorMessage("date_volunteered", "Invalid date.")
    } else {
        validatedInputs.date = volunteerDateInput;
    }

    // Rating validation 

    if (typeof(volunteerRatingInput) !== "number") {
        console.log("Volunteer Rating Input: Invalid data type.")
        showFormErrorMessage("volunteer_experience_rating", "Invalid data type.")
    } else if (volunteerRatingInput < 0 || volunteerRatingInput > 6) {
        console.log("Volunteer Rating Input: Value must be positive.")
        showFormErrorMessage("volunteer_experience_rating", "Volunteer rating must be greater than zero or less than or equal to 5")
    } else {
        validatedInputs.rating = volunteerRatingInput;
    }

    console.log(validatedInputs);


    let volunteerDataLength = retrievedVolunteerData.length;

    retrievedVolunteerData.splice(volunteerDataLength, 0, validatedInputs);

    
    storeVolunteerData(retrievedVolunteerData);
    
};

// Volunteer Data Persistent Storage

function storeVolunteerData(dataToStore) {
    for (let i = 0; i < dataToStore.length; i++) {
        localStorage.setItem(`volunteerData_${i}`, JSON.stringify(dataToStore[i]));
    }
};

const volunteerTableSection = document.getElementById("volunteerDataTable");
const volunteerTable = document.getElementById("volunteerTable");

function retrieveVolunteerData() {


    for (let i = 0; i < localStorage.length; i++) {
        
        if (localStorage.getItem(`volunteerData_${i}`) === null) {
            let localVolunteerEntry = localStorage.getItem(`volunteerData_${i}`);
            retrievedVolunteerData.push(JSON.parse(localVolunteerEntry));
            localStorage.setItem(`volunteerData_${i}`, localStorage.getItem(`volunteerData_${i + 1}`))
            localStorage.removeItem(`volunteerData_${i + 1}`)
        } else {
            let localVolunteerEntry = localStorage.getItem(`volunteerData_${i}`);
            retrievedVolunteerData.push(JSON.parse(localVolunteerEntry));
            localStorage.setItem(`volunteerData_${i}`, localStorage.getItem(`volunteerData_${i}`))
        }

        
    }

    // Volunteer Table Creation

    if (localStorage.length !== 0) {
        volunteerTableSection.classList.remove("volunteerTableHidden");

        const volunteerFormKeys = Object.keys(retrievedVolunteerData[0]);

        const volunteerTableBody = document.createElement("tbody");
        volunteerTable.appendChild(volunteerTableBody);

        const volunteerTableRow = document.createElement("tr");
        volunteerTableBody.appendChild(volunteerTableRow);

        // Table Headers

        for (let i = 0; i < volunteerFormKeys.length; i++) {
            const volunteerTableHeader = document.createElement("th");
            volunteerTableHeader.textContent = volunteerFormKeys[i];
            volunteerTableRow.appendChild(volunteerTableHeader);
        }

        // Table Rows

        for (let i = 0; i < retrievedVolunteerData.length; i++) {
            const volunteerTableEntryRow = document.createElement("tr");
            volunteerTableBody.appendChild(volunteerTableEntryRow);
            key = volunteerFormKeys[i];
            const volunteerRowEntry = retrievedVolunteerData[i];

            for (let i = 0; i < volunteerFormKeys.length; i++) {
                const volunteerTableCell = document.createElement("td");
                volunteerTableCell.textContent = volunteerRowEntry[volunteerFormKeys[i]];
                volunteerTableEntryRow.appendChild(volunteerTableCell);
            };

            const deleteVolunteerButton = document.createElement("button");
            deleteVolunteerButton.innerText = "Delete Entry";
            let deleteButtonId = i;
            deleteVolunteerButton.id = `deleteVolunteerButton_${deleteButtonId}`;
            volunteerTableEntryRow.appendChild(deleteVolunteerButton);
        }

        // calculate total volunteering hours
        let totalVolunteerHours = 0;

        for (let i = 0; i < localStorage.length; i++) {
            let hoursToAdd = parseInt(retrievedVolunteerData[i]["hours"]);
            
            totalVolunteerHours += hoursToAdd;
        }

        // Summary Contents

        hourlyResults = document.getElementById("totalVolunteeringHours");
        hourlyResults.textContent = `Total Volunteer Hours: ${totalVolunteerHours}`;

        const volunteerSummaryBlock = document.getElementById("volunteerSummary");
        const clearAllVolunteerDataButton = document.createElement("button");
        clearAllVolunteerDataButton.innerText = "Delete All Volunteer Data";
        clearAllVolunteerDataButton.id = "deleteAllVolunteerData"
        volunteerSummaryBlock.appendChild(clearAllVolunteerDataButton);

    
    } else {
        volunteerTableSection.classList.add("volunteerTableHidden");
    }

}

function removeVolunteerEntry(rowId){
    clearTable();
    let rowToRemove = `volunteerData_${rowId}`
    localStorage.removeItem(rowToRemove)
    window.location.reload();
    retrieveVolunteerData();

}

function clearTable(){
    volunteerTable.innerHTML = ""
}

function deleteAllVolunteerData() {
    localStorage.clear();
    window.location.reload();
}

// Volunteer Form Error Messages

function showFormErrorMessage(fieldName, message) {
    const errorFieldId = `${fieldName}_error`;
    const errorField = document.getElementById(errorFieldId);

    if (!errorField) {
        console.error(`Error field with ID '${errorFieldId}' not found.`)
        return;
    }
    errorField.textContent = message;
    errorField.classList.add("error-visible");
};

const clearFormErrors = () => {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((errorField) => {
        errorField.textContent = "";
        errorField.classList.remove("error-visible");
    });
};

// Listen for submit
function onVolunteerPageLoadHandler() {

    const volunteerForm = document.getElementById("volunteer_form");
    
    volunteerForm.addEventListener("DOMContentLoaded", retrieveVolunteerData());
        
    if (volunteerForm) {
        volunteerForm.addEventListener("submit", (event) => {
        
        clearFormErrors();

        // Form values
        const charityNameInput = volunteerForm.elements["charity_name"].value;
        const volunteerHoursInput = Number(volunteerForm.elements["hours_volunteered"].value);
        const volunteerDateInput = volunteerForm.elements["date_volunteered"].value;
        const volunteerRatingInput = Number(volunteerForm.elements["volunteer_experience_rating"].value);

        validateVolunteerForm(charityNameInput, volunteerHoursInput, 
            volunteerDateInput, volunteerRatingInput, retrievedVolunteerData)
        })

        document.addEventListener("click", (event) => {
            const buttonClickedId = event.target.id;
            if (buttonClickedId.slice(0,22) === "deleteVolunteerButton_") {
                let buttonId = buttonClickedId.slice(22,23);
                removeVolunteerEntry(buttonId);
            }

            if (buttonClickedId === "deleteAllVolunteerData"){
                deleteAllVolunteerData();
            }
        })

        
        
    };
    
    // Jasmine
    const eventForm = document.getElementById("eventSignupForm");
	if (eventForm) {
		eventForm.addEventListener("submit", onSubmit);

        createEventTableItems();
	}

    // Divya initialize
    const donationForm = document.getElementById("donation-form");
    if (donationForm) {
        donationForm.addEventListener("DOMContentLoaded", initializeDonationForm);
    }



}

if (typeof window !== "undefined") {
	window.onload = onVolunteerPageLoadHandler;
} else {
	module.exports = {
        validateVolunteerForm, clearFormErrors, showFormErrorMessage, onVolunteerPageLoadHandler,
        onSubmit, getEventData, formHasErrors, validateDonationForm, showErrorMessage, 
        clearErrorMessages, initializeDonationForm , saveDonationData, loadDonationData, 
        calculateTotalDonations, renderDonationList, deleteDonation, deleteEvent, 
        summarizeEvents, createEventTableItems, deleteAllVolunteerData, clearTable, 
        removeVolunteerEntry, retrieveVolunteerData, storeVolunteerData,
    }
}

},{}]},{},[1]);
