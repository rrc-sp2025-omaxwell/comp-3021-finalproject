// Require jsdom

const { JSDOM } = require('jsdom');

// Load the HTML file into JSDOM

const {
    validateDonationForm,
    showErrorMessage,
    clearErrorMessages,
    initializeDonationForm,
    saveDonationData,
    loadDonationData,
    calculateTotalDonations,
    deleteDonation
} = require('./script.js');

// ## unit tests ##

// unit tests for validateDonationForm function

test("validateDonationForm returns valid object when all inputs are correct", () => {
    const result = validateDonationForm("Charity A", "100", "2023-10-15", "Keep up the good work!");

    expect(result).toEqual({
        charity: "Charity A",
        amount: 100,
        date: "2023-10-15",
        message: "Keep up the good work!"
    });
});

// unit test for empty charity name error functionality
test("validateDonationForm shows error for empty charity name", () => {
    const dom = new JSDOM(`<!DOCTYPE html><span id="charityName_error" class="error-message"></span>`);
    global.document = dom.window.document;

    validateDonationForm("", "100", "2023-10-15", "Great cause!");

    expect(global.document.getElementById("charityName_error").innerText).toBe("Charity name cannot be empty.");
});

// unit test for invalid donation amount error functionality
test("validateDonationForm shows error for invalid donation amount", () => {
    const dom = new JSDOM(`<!DOCTYPE html><span id="donationAmount_error" class="error-message"></span>`);
    global.document = dom.window.document;

    validateDonationForm("Charity B", "-50", "2023-10-15", "Happy to help!");

    expect(global.document.getElementById("donationAmount_error").innerText).toBe("Donation amount must be a positive number.");
});

// unit test for invalid donation date error functionality
test("validateDonationForm shows error for invalid donation date", () => {
    const dom = new JSDOM(`<!DOCTYPE html><span id="donationDate_error" class="error-message"></span>`);
    global.document = dom.window.document;

    validateDonationForm("Charity C", "75", "15-10-2023", "Best wishes!");

    expect(global.document.getElementById("donationDate_error").innerText).toBe("Donation date must be in YYYY-MM-DD format.");
});

// test clearing error messages
test("clearErrorMessages clears all error messages", () => {
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <span id="charityName_error" class="error-message">Error</span>
        <span id="donationAmount_error" class="error-message">
        Error</span><span id="donationDate_error" class="error-message">Error</span>
        <span id="donorMessage_error" class="error-message">Error</span>`);

    global.document = dom.window.document;

    clearErrorMessages();

    expect(global.document.getElementById("charityName_error").innerText).toBe("");
    expect(global.document.getElementById("donationAmount_error").innerText).toBe("");
    expect(global.document.getElementById("donationDate_error").innerText).toBe("");
    expect(global.document.getElementById("donorMessage_error").innerText).toBe("");
});

// test for total donation calculation
test("calculateTotalDonations returns correct total", () => {
    const donations = [
        { amount: 100 },
        { amount: 50 },
        { amount: 25.5 }
    ];

    const total = calculateTotalDonations(donations);

  expect(total).toBe(175.5);
});    
  
  
// Jasmine Tests
  
const {
    onSubmit, getEventData, formHasErrors,
    validateVolunteerForm, clearFormErrors, showFormErrorMessage, 
    onVolunteerPageLoadHandler, createEventTableItems, deleteEvent,
    summarizeEvents, deleteAllVolunteerData, clearTable, 
    removeVolunteerEntry, retrieveVolunteerData, storeVolunteerData
} = require("./script");

// INTEGRATION TEST
test("onSubmit updates DOM correctly on empty and invalid inputs.", () => {
    const dom = new JSDOM(
        `<!DOCTYPE html>
        <form id="eventSignupForm">
            <input type="text" id="eventName" />
            <span class="error" id="eventNameError" style="display: none">* Event Name field must not be blank.</span>

            <input type="text" id="representativeName" value="Jaclyn Robins"/>
            <span class="error" id="representativeNameError" style="display: none">* Representative Name field must not be blank.</span>

            <input type="text" id="representativeEmail" value="jrobins2gmail.com"/>
            <span class="error" id="representativeEmailError" style="display: none">* Please enter a valid email.</span>
            
            <select name="roleSelection" id="roleSelection" value="Sponsor">
                <option value="">Select a role</option>
                <option value="Sponsor">Sponsor</option>           
            </select>
            <span class="error" id="roleSelectionError" style="display: none">* Please make a selection.</span>
            
            <button type="submit">Submit</button>
        </form>`
	);

    global.document = dom.window.document;

    const form = dom.window.document.getElementById("eventSignupForm");
	form.addEventListener("submit", onSubmit);

    // Simulate the form submission
	const submitEvent = new dom.window.Event("submit", {
		bubbles: true,
		cancelable: true,
	});
	form.dispatchEvent(submitEvent);

    expect(global.document.getElementById("eventNameError").style.display)
    .toBe(`block`);
    expect(global.document.getElementById("representativeEmailError").style.display)
    .toBe(`block`);
})

// UNIT TESTS
test("formHasErrors identifies empty required field.", () => {
    const dom = new JSDOM(
        `<!DOCTYPE html>
        <form id="eventSignupForm">
            <input type="text" id="eventName" value="Inspire Conference"/>
            <span class="error" id="eventNameError" style="display: none">* Event Name field must not be blank.</span>

            <input type="text" id="representativeName" />
            <span class="error" id="representativeNameError" style="display: none">* Representative Name field must not be blank.</span>

            <input type="text" id="representativeEmail" value="jrobins@gmail.com"/>
            <span class="error" id="representativeEmailError" style="display: none">* Please enter a valid email.</span>
            
            <select name="roleSelection" id="roleSelection">
                <option value="">Select a role</option>
                <option value="Sponsor">Sponsor</option>
            </select>
            <span class="error" id="roleSelectionError" style="display: none">* Please make a selection.</span>
            
            <button type="submit">Submit</button>
        </form>`
	);

    global.document = dom.window.document;
    
    formHasErrors();

    expect(global.document.getElementById("representativeNameError").style.display)
    .toBe("block");
})

test("formHasErrors flags invalid email.", () => {
    const dom = new JSDOM(
        `<!DOCTYPE html>
        <form id="eventSignupForm">
            <input type="text" id="eventName" value="Inspire Conference"/>
            <span class="error" id="eventNameError" style="display: none">* Event Name field must not be blank.</span>

            <input type="text" id="representativeName" value="Jaclyn Robins"/>
            <span class="error" id="representativeNameError" style="display: none">* Representative Name field must not be blank.</span>

            <input type="text" id="representativeEmail" value="jrobins2gmail.com"/>
            <span class="error" id="representativeEmailError" style="display: none">* Please enter a valid email.</span>
            
            <select name="roleSelection" id="roleSelection" value="Sponsor">
                <option value="">Select a role</option>
                <option value="Sponsor">Sponsor</option>
            </select>
            <span class="error" id="roleSelectionError" style="display: none">* Please make a selection.</span>
            
            <button type="submit">Submit</button>
        </form>`
	);

    global.document = dom.window.document;

    formHasErrors();

    expect(global.document.getElementById("representativeEmailError").style.display)
    .toBe(`block`);
})

test("getEventData returns object with valid inputs", () => {
    const dom = new JSDOM(
        `<!DOCTYPE html>
        <form id="eventSignupForm">
            <input type="text" id="eventName" value="Inspire Conference"/>
            <span class="error" id="eventNameError" style="display: none">* Event Name field must not be blank.</span>

            <input type="text" id="representativeName" value="Jaclyn Robins"/>
            <span class="error" id="representativeNameError" style="display: none">* Representative Name field must not be blank.</span>

            <input type="text" id="representativeEmail" value="jrobins@gmail.com"/>
            <span class="error" id="representativeEmailError" style="display: none">* Please enter a valid email.</span>
            
            <select name="roleSelection" id="roleSelection">
                <option value="">(select an option)</option>
                <option value="Sponsor" selected>Sponsor</option>
            </select>
            <span class="error" id="roleSelectionError" style="display: none">* Please make a selection.</span>
            
            <button type="submit">Submit</button>
        </form>`
	);

    global.document = dom.window.document;

    let eventData = {
        eventName: "",
        representativeName: "",
        representativeEmail: "",
        companyRole: ""
    };
    
    getEventData(eventData);

    expect(eventData).toEqual({
        eventName: "Inspire Conference",
        representativeName: "Jaclyn Robins",
        representativeEmail: "jrobins@gmail.com",
        companyRole: "Sponsor"
    })
})

// Jasmine Part 2
test("createEventTableItems updates table according to localStorage", () => {
    const dom = new JSDOM(
        `<!DOCTYPE html>
        <table id="eventTable">
            <thead></thead>
            <tbody id="eventItems"></tbody>
        </table>
        <table id="eventSummaryTable">
            <thead></thead>
            <tbody id="eventSummaryItems"></tbody>
        </table>`,
         { url: "http://localhost" }
    );

    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;

    global.localStorage.setItem("allEventData", JSON.stringify([
        {
            eventName: "Inspire Conference",
            representativeName: "Jaclyn Robins",
            representativeEmail: "jrobins@pixell-river.com",
            companyRole: "Sponsor"
        }
    ]));

    createEventTableItems();

    const rows = document.querySelectorAll("#eventItems tr");
    expect(rows.length).toBe(1);

    const cells = rows[0].querySelectorAll("td");
    expect(cells[0].textContent).toBe("Inspire Conference");
    expect(cells[1].textContent).toBe("Jaclyn Robins");
    expect(cells[2].textContent).toBe("jrobins@pixell-river.com");
    expect(cells[3].textContent).toBe("Sponsor");
    expect(cells[4].querySelector("button")).not.toBeNull();
    
})

test("summarizeEvents generates correct summary.", () => {
        const dom = new JSDOM(
        `<!DOCTYPE html>
        <table id="eventSummaryTable">
            <thead></thead>
            <tbody id="eventSummaryItems"></tbody>
        </table>`, { url: "http://localhost" }
    );

    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;

    global.localStorage.setItem("allEventData", JSON.stringify([
        {
            eventName: "Inspire Conference",
            representativeName: "Jaclyn Robins",
            representativeEmail: "jrobins@pixell-river.com",
            companyRole: "Sponsor"
        }
    ]));

    summarizeEvents();

    const rows = document.querySelectorAll("#eventSummaryItems tr");
    expect(rows.length).toBe(1);

    const cells = rows[0].querySelectorAll("td");
    expect(cells[0].textContent).toBe("1");
    expect(cells[1].textContent).toBe("0");
    expect(cells[2].textContent).toBe("0");

})

test("deleteEvent deletes event in table and localStorage", () => {
    const dom = new JSDOM(
        `<!DOCTYPE html>
        <table id="eventTable">
            <thead></thead>
            <tbody id="eventItems"></tbody>
        </table>
        <table id="eventSummaryTable">
            <thead></thead>
            <tbody id="eventSummaryItems"></tbody>
        </table>`,
         { url: "http://localhost" }
    );


    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;

    global.localStorage.setItem("allEventData", JSON.stringify([
        {
            eventName: "Inspire Conference",
            representativeName: "Jaclyn Robins",
            representativeEmail: "jrobins@pixell-river.com",
            companyRole: "Sponsor"
        },
        {
            eventName: "Mystery Book Club",
            representativeName: "Tim Drake",
            representativeEmail: "tdrake@pixell-river.com",
            companyRole: "Organizer"
        }
    ]));

    createEventTableItems();
    deleteEvent(0);

    const rows = document.querySelectorAll("#eventItems tr");
    expect(rows.length).toBe(1);

    const cells = rows[0].querySelectorAll("td");
    expect(cells[0].textContent).toBe("Mystery Book Club");
    expect(cells[1].textContent).toBe("Tim Drake");
    expect(cells[2].textContent).toBe("tdrake@pixell-river.com");
    expect(cells[3].textContent).toBe("Organizer");
    expect(cells[4].querySelector("button")).not.toBeNull();

    expect(JSON.parse(localStorage.getItem("allEventData"))).toEqual([{
            eventName: "Mystery Book Club",
            representativeName: "Tim Drake",
            representativeEmail: "tdrake@pixell-river.com",
            companyRole: "Organizer"
        }]);

})

test("deleteEvent updates summary", () => {
    const dom = new JSDOM(
        `<!DOCTYPE html>
        <table id="eventTable">
            <thead></thead>
            <tbody id="eventItems">
            </tbody>
        </table>
        <table id="eventSummaryTable">
            <thead></thead>
            <tbody id="eventSummaryItems"></tbody>
        </table>`,
         { url: "http://localhost" }
    );

    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;

    global.localStorage.setItem("allEventData", JSON.stringify([
        {
            eventName: "Inspire Conference",
            representativeName: "Jaclyn Robins",
            representativeEmail: "jrobins@pixell-river.com",
            companyRole: "Sponsor"
        },
        {
            eventName: "Mystery Book Club",
            representativeName: "Tim Drake",
            representativeEmail: "tdrake@pixell-river.com",
            companyRole: "Organizer"
        }
    ]));


    createEventTableItems();
    
    deleteEvent(0);

    const rows = document.querySelectorAll("#eventSummaryItems tr");
    expect(rows.length).toBe(1);

    const cells = rows[0].querySelectorAll("td");
    expect(cells[0].textContent).toBe("0");
    expect(cells[1].textContent).toBe("1");
    expect(cells[2].textContent).toBe("0");


})



// Owen Testing

test("validateVolunteerForm valid inputs", () => {

    validatedForm = validateVolunteerForm("Community Service", 
        3, "2025-11-10", 4)
        
    expect(validatedForm).toEqual({name: "Community Service", hours: 3,
            date: "2025-11-10", rating: 4})
});

test("validateVolunteerForm identifies empty field and displays error", () => {
    const dom = new JSDOM(`<!DOCTYPE html><span id="charity_name_error" 
                            class="error-message" aria-live="polite"></span>`)

    global.document = dom.window.document;

    validateVolunteerForm("", 
        4, "2025-11-10", 4)
    
    expect(global.document.getElementById("charity_name_error").textContent).toEqual(
        "Charity name cannot be blank."
    );
});

test("validateVolunteerForm flags invalid hours and displays error", () => {
    const dom = new JSDOM(`<!DOCTYPE html><span id="hours_volunteered_error" 
                            class="error-message" aria-live="polite"></span>`)

    global.document = dom.window.document;

    validateVolunteerForm("Community Service", 
        "Three", "2025-11-10", 4)
    
    expect(global.document.getElementById("hours_volunteered_error").textContent).toEqual(
        "Invalid data type."
    );
});

test("validateVolunteerForm flags invalid experience rating and displays error", () => {
    const dom = new JSDOM(`<!DOCTYPE html><span id="volunteer_experience_rating_error" 
                            class="error-message" aria-live="polite"></span>`)

    global.document = dom.window.document;

    validateVolunteerForm("Community Service", 
        3, "2025-11-10", 99)
    
    expect(global.document.getElementById("volunteer_experience_rating_error").textContent).toEqual(
        "Volunteer rating must be greater than zero or less than or equal to 5"
    );
});

test("showFormErrorMessage takes flagged input id and displays error", () => {
    const dom = new JSDOM(`<!DOCTYPE html><span id="hours_volunteered_error" 
                            class="error-message" aria-live="polite"></span>`)

    global.document = dom.window.document;

    showFormErrorMessage("hours_volunteered", "Hours must be a positive number.")
    
    expect(global.document.getElementById("hours_volunteered_error").textContent).toEqual(
        "Hours must be a positive number."
    );
});

// Owen Part 2 testing

test("RetrieveVolunteerdata(), Total hours calculated from localstorage." , () => {
    
    const dom = new JSDOM(`<!DOCTYPE html>
        <html>
        <body>
            <div id="volunteerSummary">
                <p id="totalVolunteeringHours"></p>
            </div>
        </section>
        </body>
        </html>`);

    global.document = dom.window.document;
    global.localStorage = dom.window.localStorage;

    global.localStorage.setItem("volunteerData_0", JSON.stringify(
        [
            {name: "Public Service", hours: "2", date: "2025-11-10", rating: 3}
        ]
    ));

    global.localStorage.setItem("volunteerData_1", JSON.stringify(
        [
            {name: "Park Trash Pickup", hours: "3", date: "2025-10-10", rating: 4}
        ]
    ))

    global.localStorage.setItem("volunteerData_2", JSON.stringify(
        [
            {name: "School Superivision", hours: "6", date: "2025-09-10", rating: 2}
        ]
    ))

    
    const totalTime = global.document.getElementById(id="totalVolunteeringHours").textContent

    retrieveVolunteerData();

    expect(totalTime).toEqual("11");
    
});