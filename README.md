<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/becker1998/Sigma-Chi">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Sigma-Chi</h3>

  <p align="center">
    A lightweight, cross-platform statistical visualization tool
    <br />
    <a href="https://github.com/becker1998/Sigma-Chi"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/becker1998/Sigma-Chi">View Demo</a>
    ·
    <a href="https://github.com/becker1998/Sigma-Chi/issues">Report Bug</a>
    ·
    <a href="https://github.com/becker1998/Sigma-Chi/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About the Project

[![Product Name Screen Shot][product-screenshot]](https://github.com/becker1998/Sigma-Chi)

Sigma-Chi is a web-based, lightweight statistical modelling tool intended for academic and professional research. The tool provides easily legible visualizations for small to large multi-column datasets for analysis by researchers.

General features:
* Automatic parsing of data on import
    * Adapt columns to layout specified in data without prompting user for extra formatting
    * Import both integer and float data automatically
* Formatted exportation of data
* Instant visualization of data
    * Using weighted mean
    * Using reduce chi squared
    * Using kernel density estimation

The aim of the tool is twofold:
1. Fast data collection (perhaps in a field setting)
2. Fast data visualization

The tool differentiates itself from other related tools like [KDredX2](https://github.com/miladghaznavi/KDredX2) by its bypass of Java, Gradle requirements, Maven requirements, downloading binaries, manual updates, and outdated documentation.

### Built With

The tool is straightforward, and is built using only modern webstack tools and an open-source third-party library for charting:
* [HTML](https://html.spec.whatwg.org/)
* [CSS](https://www.w3.org/TR/CSS/#css)
* [JavaScript](https://javascript.com)
* [Chart.js](https://www.chartjs.org)

<!-- GETTING STARTED -->
## Getting Started

The tool's design purpose revolves around ease-of-use, and so does not require a large amount of background knowledge to operate.

### Prerequisites

There are no requirements to install or use the tool. The dependencies and third-party libraries are acquired through the modern web-design practice of CDNs which are links specified in the header of the HTML file that are retrieved on page load.

<!-- USAGE EXAMPLES -->
## Usage

As with the installation and the design considerations, the tool is meant to have a straightforward and intuitive usage. It fits a linear use case paradigm, adhereing to the `Import > Modify > Export` pattern.

### Layout

The layout of the tool is sub-divided into three parts. At the top is a menu bar with the main external tools of the app. Import to get data into the app, export to get data out of the app, controls in the middle to restructure the visualizer and data manager, and the evaluation settings dropdown to modify the statistical generation:

[![Main Layout Screenshot][main-layout-screenshot]](https://github.com/becker1998/Sigma-Chi)

1. Menu bar
2. Data manager
3. Visualizer

### Collect data

Before performing any operations within the tool or exporting any data, data must be collected or imported. If you already have data you wish to analyze and therefore do not need to collect any data, proceed to <a href="#import-data">Import data</a>.

Data is structed into the columns below:

[![Data Row Layout][data-row-layout-screenshot]](https://github.com/becker1998/Sigma-Chi)

1. The `#` symbol represents the data entry in the set. The first entry (the top row) is 1, and the last entry is `n` in an `[1, n]` row set.
2. The `R` symbol marks the entry as `Rejected`, meaning it is laballed as a deviation from the dataset and is rejected from the weighted mean. Checking this box will update the weighted mean visualization real-time.
3. The actual data entry value, be it a height measurement, lenth measurement, depth measurement, etc.
4. The tolerated uncertainty (margin of error) for the given data entry. This will be used in calculating all three visualizations.

To collect data, simply begin entering values into the columns above for each row. If you exceed the standard 5 data entries, click the `+` button to the right of the row to add another row.

To create an entirely new dataset, for purposes of comparison, later exportation, saving, etc. then click the `+` button in to the left of the data row. The `+` button sits at the bottom of the scrollable column of dataset names.

### Import data

To import data, click the `Import` button in the top left. Imported data must be in the `.csv` file format to be parsed. If no header column names are specified, the tool will assume column 1 to be the data value and column 2 to be the uncertainty. Warning: uncategorized data may result in a misrepresentation of the data as the tool must guess how the data is to be categorized which may conflict with the intention of the user.

Imported data will be assigned the bottom-most data set name in the scrollable list of all datasets on the left in the data manager. The rejection of data must be done manually to ensure the data is accurate to the wants of the researcher. 

### Visualize data

Sigma-Chi has the ability to provide the following three visualizations of any given data (either collected or imported):

[![Visualization Layout][visualization-layout-screenshot]](https://github.com/becker1998/Sigma-Chi)

1. Weighted mean, calculated from http://seismo.berkeley.edu/~kirchner/Toolkits/Toolkit_12.pdf
2. Reduced chi squared, calculated from https://books.google.com/books?id=MjNwWUY8jx4C&lpg=PA333&dq=variance%20of%20unit%20weight&pg=PA301#v=onepage&q&f=false 
3. Kernel density distribution, calculated from https://doi.org/10.1214%2Faoms%2F1177704472 

To include any of the datasets in the graph, check the tickbox next to the dataset's name in the left-most panel in the data manager.

To include multiple datasets, tick multiple boxes.

### Export data

To export data, click the `Export` button to the right of the `Import` button on the menu bar. In the dropdown menu, there are three options to export: `Datasets`, `Graphs`, and `Both`. `Datasets` produces a `.csv` file with the name of the last dataset, and combines all the selected datasets into one concatenated set. `Graphs` produces a `.png` screenshot of all three graphs. Finally, `Both` produces two exportation dialog windows of the two options above, one after the other; the user is left with a `.csv` and a `.png` after choosing `Both`.

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

### CISC 498 Team
* Project Lead: Christopher Goel - 16cjg3@queensu.ca
* Ryan Protheroe - 17rcp@queensu.ca
* Connor St Louis - 15cmcs@queensu.ca
* Jared Violo - jared.violo@queensu.ca
* Tyler Beckstead - 15tctb@queensu.ca

Project Link: [Sigma-Chi](https://github.com/becker1998/Sigma-Chi)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Professor Mohammad Zulkernine](https://research.cs.queensu.ca/home/mzulker/)
* [Professor Yuan Tian](https://sophiaytian.com)
* [Professor Christopher Spencer](https://www.queensu.ca/geol/christopher-spencer)
* [Queen's School of Computing](https://www.cs.queensu.ca)
* [Queen's School of Geology](https://www.queensu.ca/geol/home)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/screenshot.png
[main-layout-screenshot]: images/main_layout.png
[data-row-layout-screenshot]: images/data_row_layout.png
[visualization-layout-screenshot]: images/visualization_layout.png
