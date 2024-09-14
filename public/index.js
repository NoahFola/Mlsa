
let obj = document.getElementsByClassName("work_to_do");
let form = document.getElementById("form");

console.log(obj)

function handleFormSubmission(event) {
    // Find all checkboxes in the form
    const checkboxes = document.getElementsByClassName("work_to_do");
    
    checkboxes.forEach(checkbox => {
        // Create a hidden input to represent the unchecked state
        if (!checkbox.checked) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = checkbox.name;
            hiddenInput.value = 'unchecked'; // Value indicating unchecked state
            checkbox.form.appendChild(hiddenInput);
        }
    });
}


for(var ob of obj){
    ob.addEventListener('change' , ()=>{
        form.submit();
        handleFormSubmission("cdhs")
       
    });
};
//#cfd3fc
//#1527e6