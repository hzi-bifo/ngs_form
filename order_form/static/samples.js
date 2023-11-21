function serializeSamplesAndSubmit() {
    var samples = [];
    // Iterate over each row in the table and collect the data
    // This is a simplified version; adjust it according to your table structure
    $('#sample-table tbody tr').each(function() {
        var sample = {
            sample_name: $(this).find('.sample-name').val(),
            concentration: $(this).find('.concentration').val(),
            // Add other fields similarly
        };
        samples.push(sample);
    });

    // Serialize the samples array and set it to the hidden input field
    $('#serialized-samples').val(JSON.stringify(samples));

    // Submit the form
    $('form').submit();
}