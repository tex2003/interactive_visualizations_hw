function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(function(data) {
    Object.entries(data).map(([key, value]) => (key,value));
    var sample = d3.select("#sample-metadata");
    sample.html("");
    sample.append("div").text(`AGE: ${data.AGE}`);
    sample.append("div").text(`BBTYPE: ${data.BBTYPE}`);
    sample.append("div").text(`ETHNICITY: ${data.ETHNICITY}`);
    sample.append("div").text(`GENDER: ${data.GENDER}`);
    sample.append("div").text(`LOCATION: ${data.LOCATION}`);
    sample.append("div").text(`SAMPLEID: ${data.sample}`);
  }); 
}

function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then(function(data) {
    Object.entries(data).map(([key, value]) => (key,value));
    var topSample = data.sample_values.slice(0,10); 
    var topOtu = data.otu_ids.slice(0,10); 
    var topOtulables= data.otu_labels.slice(0,10);
      var data1 = [{
      values: topSample,
      labels: topOtu,
      hovertext: topOtulables,
      type: 'pie'
    }];   
    var layout = {
    height: 500, 
    width: 600,
    title: `Top 10 OTU IDS for Selected Sample`
    };
    Plotly.react("pie", data1, layout);
      var data2 = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: "markers",
      type: "scatter",
      labels: data.otu_ids,
      hovertext: data.otu_labels,
        marker: {
        color: data.otu_ids,
        size: data.sample_values
      } 
    }];   
    var layout = {
      title: ``,
      yaxis: {title: "Sample Values" },
      xaxis: {title: "OTU ID"}
    };
    Plotly.react("bubble", data2, layout);
  }); 
}

function init() {
  var selector = d3.select("#selDataset");
  d3.json("/names").then((sampleNames) => {
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample)
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample)
}

// Initialize the dashboard
init();
