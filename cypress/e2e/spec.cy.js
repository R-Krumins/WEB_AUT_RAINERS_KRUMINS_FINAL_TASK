import fd from "../fixtures/formData.json"

function genderBtn() {
  if (fd.gender === "male") return '[for="gender-radio-1"]';
  if(fd.gender === "female") return '[for="gender-radio-2"]';
  if(fd.gender === "other") return '[for="gender-radio-3"]';
}

function hobbyBtn() {
  if (fd.hobby === "sports") return '[for="hobbies-checkbox-1"]';
  if(fd.hobby === "reading") return '[for="hobbies-checkbox-2"]';
  if(fd.hobby === "music") return '[for="hobbies-checkbox-3"]';
}

function day() {
  return /^\d$/.test(fd.birthDay) ? "0"+fd.birthDay : fd.birthDay;
}

const correctTable = [
  ["Student Name", fd.firstName+" "+fd.lastName],
  ["Student Email", fd.email],
  ["Gender", fd.gender],
  ["Mobile", fd.phoneNumber],
  ["Date of Birth", fd.formatedDate],
  ["Subjects", fd.subject],
  ["Hobbies", fd.hobby],
  ["Picture", fd.picture],
  ["Address", fd.address],
  ["State and City", fd.state+" "+fd.city],
];


describe("template spec", () => {
  it("Validate From", () => {
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.visit("https://demoqa.com/automation-practice-form");

    cy.get("#firstName").type(fd.firstName);
    cy.get("#lastName").type(fd.lastName);
    cy.get("#userEmail").type(fd.email);
    cy.get(genderBtn()).click();
    cy.get("#userNumber").type(fd.phoneNumber);

    // Input Date of Birth
    cy.get('#dateOfBirthInput').click();
    cy.get('.react-datepicker__year-select').should('be.visible').select(fd.birthYear);
    cy.get('.react-datepicker__month-select').should('be.visible').select(fd.birthMonth)
    cy.get(`.react-datepicker__day.react-datepicker__day--0${day()}`).first().click();

    cy.get(".subjects-auto-complete__value-container").type(fd.subject+"{enter}")
    cy.get(hobbyBtn()).click();
    cy.get('#uploadPicture').selectFile('cypress/files/'+fd.picture);
    cy.get('#currentAddress').type(fd.address);
    cy.get('#state').click().contains('div', fd.state).click();  
    cy.get('#city').click().contains('div', fd.city).click();

    // submit form
    cy.get("#submit").click();

    //Validate that each Labeled row contains the correct information.
    correctTable.forEach((v, i) => {
      cy.get(".table-hover tbody tr").eq(i).contains(v[0], { matchCase: false });
      cy.get(".table-hover tbody tr").eq(i).contains(v[1], { matchCase: false });
    })
    

  })
})