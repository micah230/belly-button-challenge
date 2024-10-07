// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const metaSamp = metadata.filter(object => object.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");
 
    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (keyInstance in metaSamp){
        panel.append("h6").text(`${keyInstance}: ${metaSamp[keyInstance]}`);
    };
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const filtSamp = samples.filter(object => object.id == sample)[0];
    console.log(filtSamp);

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = filtSamp.otu_ids;
    const otu_labels = filtSamp.otu_labels;
    const sample_values = filtSamp.sample_values;
    console.log(otu_ids.length, otu_labels.length, sample_values.length);

    // Build a Bubble Chart
    const bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];

    const bubbleLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      hovermode: 'closest'
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    yTicks = otu_ids.map(otu_ids => `OTU ${otu_ids}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barData = [{
        x: sample_values.slice(0,10).reverse(),
        y: yTicks,
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
    }];
    const barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        xaxis: { title: "Number of Bacteria" }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
        dropdown
            .append("option")
            .text(names[i])
            .property("value", names[i]);
    };

    // Get the first sample from the list
      const firstSample = names[0];

    // Build charts and metadata panel with the first sample
      buildMetadata(firstSample);
      buildCharts(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
