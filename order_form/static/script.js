function addSampleRow() {
    var table = document.getElementById("sample-table").getElementsByTagName('tbody')[0];
    var row = table.insertRow();
    row.className = 'sample-row';

    var fields = ['sample-name', 'concentration', 'vol', 'ratio', 'a260230', 'comments'];
    fields.forEach(function(field) {
        var cell = row.insertCell();
        var input = document.createElement("input");
        input.type = "text";
        input.name = field;
        input.className = 'rounded border-gray-300 p-2 w-full'; // Tailwind classes
        cell.appendChild(input);
    });

    var deleteCell = row.insertCell();
    var deleteButton = document.createElement("button");
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() { deleteSampleRow(this); };
    deleteButton.className = 'py-2 px-4 bg-red-500 text-white rounded'; // Tailwind classes
    deleteCell.appendChild(deleteButton);
}

function deleteSampleRow(btn) {
    var row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function addMultipleRows(numberOfRows) {
    for (let i = 0; i < numberOfRows; i++) {
        addSampleRow();
    }
}
function serializeSamplesAndSubmit() {
    var formData = {
        'name': $('#name').val(),
        'billing_address': $('#billing-address').val(),
        'ag_and_hzi': $('#ag-and-hzi').val(),
        'date': $('#date').val(),
        'quote_no': $('#quote-no').val(),
        'contact_phone': $('#contact-phone').val(),
        'email': $('#email').val(),
        'data_delivery': $('#data-delivery').val(),
        'signature': $('#signature').val(),
        'experiment_title': $('#title').val(),
        'dna': $('#dna').val(),
        'rna': $('#rna').val(),
        'library': $('#library').val(),
        'method': $('#method').val(),
        'buffer': $('#buffer').val(),
        'organism': $('#organism').val(),
        'isolated_from': $('#isolated-from').val(),
        'isolation_method': $('#isolation-method').val(),
        'samples': []
    };

    $('#sample-table tbody tr').each(function() {
        var sample = {
            'sample_name': $(this).find('input[name="sample-name"]').val(),
            'concentration': $(this).find('input[name="concentration"]').val(),
            'volume': $(this).find('input[name="vol"]').val(),
            'ratio_260_280': $(this).find('input[name="ratio"]').val(),
            'a260_230': $(this).find('input[name="a260230"]').val(),
            'comments': $(this).find('input[name="comments"]').val()
        };
        formData.samples.push(sample);
    });

    $.ajax({
        type: "POST",
        url: "/submit",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function(response) {
            console.log("Form submitted successfully");
            // Redirect or handle the response as needed
        },
        error: function(error) {
            console.error("Error submitting form: ", error);
            // Handle the error as needed
        }
    });
}
