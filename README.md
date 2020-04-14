# Accessible Periodic Table

Simple example of how one might go about creating a periodic table that is accessible.

It operates in two modes:

- default mode (more screen reader accessible)
   + simple html table
   + no explicit keyboard access (screen reader provides it's own table navigation commands)
   + press enter when screen reader is running to get info about an element (most will synthesize a click for you)
- keyboard navigation mode
   + provides arrow key navigation around the table
- minimal formating via stylesheet
- no attempt to colorize (seems to be many common color schemes, but no "standard" one)
   + should be straightforward to add via syltsheet

[See it running here](./periodic-table.html)

[Run the Demo]

## Periodic-Table-JSON
Public domain periodic table data from https://github.com/Bowserinator/Periodic-Table-JSON

A json of the entire periodic table. Feel free to use it in your projects.

Temperatures such as boiling points and melting points are given in degrees kelvin.  Densities are given in g/L and molar heat in (mol*K)
Information that is missing is represented as null. Some elements may have an image link to their spectral bands.

All elements have a three sentence summary from Wikipedia. Currently the color tag is useless, so please use appearance instead.

**Electron configuration** is given as a string, with each orbital separated by a space.  **Electron shells** are given as an array, the first item is the number of electrons in the first shell, the 2nd item is the number of electrons in the second shell, and so on.

Both **ionization energy** and **first electron affinities** are given as the energy required to *detach* an electron from the anion.  Ionization energies are given as an array for successive ionization energy.

A link to the source where the information was from is provided in each element under the key "source".

Here's an example of how it's formatted:
```json
{
  "elements" : [{
		"name": "Hydrogen",
		"symbol": "H",
		"number": 1,
		"period": 1,
		"category": "diatomic nonmetal ",
		"atomic_mass": 1.008,
		"color": null,
		"appearance": "colorless gas",
		"phase": "Gas",
		"melt": 13.99,
		"boil": 20.271,
		"density": 0.08988,
		"discovered_by": "Henry Cavendish",
		"molar_heat": 28.836,
		"source":"https://en.wikipedia.org/wiki/Hydrogen",
		"named_by": "Antoine Lavoisier",
		"spectral_img": "https://en.wikipedia.org/wiki/File:Hydrogen_Spectra.jpg",
		"summary": "Hydrogen is a chemical element with chemical symbol H and atomic number 1. With an atomic weight of 1.00794 u, hydrogen is the lightest element on the periodic table. Its monatomic form (H) is the most abundant chemical substance in the Universe, constituting roughly 75% of all baryonic mass.",
		"ypos": 1,
		"xpos": 1,
		"shells": [
		    1
		],
		"electron_configuration": "1s1",
		"electron_affinity": 72.769,
		"electronegativity_pauling": 2.20,
		"ionization_energies": [
				1312.0
		]
	}
]}
```

