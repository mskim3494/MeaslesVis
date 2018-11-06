# hw7 - Measles data exploration

This final homework assignment creates a simple interactive tool for exploring data about the number
measles cases per US state from 1930 to 2016.  The rates of measles dropped off with the
introduction of the vaccine in the 1960s, and lowered again in the 1980s with the practice of giving
a second dose; see https://en.wikipedia.org/wiki/Measles_vaccine for more of the history and
context.  Since 2000, there have been a few small outbreaks: when and where are these outbreaks, and
what might have caused them?  This tool visualizes the large-scale trends in measles rates, and
assists in learning more about individual outbreaks.

Unlike other homeworks, you have the option of completing this one in a group (of 2 or 3),
formalized via https://work-groups.cs.uchicago.edu .  Unfortunately the server is not smart enough
to re-use an existing repo if you have form the same group of three people twice.  Be sure to commit
your hw7 work in the right repo!

## Getting Started

As always we begin by installing the required dependencies

```sh
npm install

npm run start

# or if yarning

yarn

yarn start
```

The default configuration opens a port on http://localhost:3001/, so simply point a browser to that
address and you'll be up and running.

## What is given

A fair amount of code and infrastructure and framework has been given to you, for you to write
functionality within.  In terms of what you see on the screen, and properties they depend on:

* On the left is the GridView (implemented in src/components/grid-view.js).  At the top is a control
for whether the states are ordered in the grid alphabetically, or by the (per-state) mean rate over
the years for which we have data, or by the (per-state) max rate seen in any of those years.  This
is an "overview" of all the data.
* On the upper right is the HexMap (implemented in src/components/hex-map.js).  At the top is a
control for whether the colormap is of the per state measles rate, or of the per state measles rate
minus the national mean. This colormap determines the coloring in both the HexMap hexagons and the
GridView rectangles.  This gives a view of the rates across the US, for the one selected year.
* On the lower right is the LinePlots (implemented in src/components/line-plots.js) This shows one
line plot per state, as well as (for you to add) the national average rate in orange, overlaying the
other (unselected) states. If one state is selected, its plot appears in blue.
* Properties shared between these components include "selectedYear", which should always be set to
something between 1930 and 2016, and "selectedUSST" which may be null or may be the 2-letter
abbreviation of a single state. We're trying to consistently use "USST" for US-state as identified
by the state abbreviation, so that "state" or "State" in the code refers specifically to React's
state (except when referring to the "StateName" field of the data).

Throughout the code you may see some hard-coded constants, like years 1930 and 2016, and some
aspects of the geometry of the layout.  This is bad form, and the hardcoded-layout hampers
responsive design, but it will do for this assignment. Also unfortunate is how the web page does not
include an adequate textual description of what it is showing, to make it a self-contained
visualization tool.  You do not have to try to fix this.

## What to do

In the interests of time, this is a fairly constrained assignment, so that you can focus on
finishing p2.  You should do the following:

* Finish the function calculateRates() in src/components/util.js that computes the rates of measles
cases (quantified as: number of cases per 1,000,000 people in state population).
* Finish the function calculateUSMeanRate() in src/components/util.js that computes the national
average measles rate (weighing each state's contribution by the state's population). NOTE: The
structure of the objects returned from calculateRates() and from calculateUSMeanRate() must conform
to what is described in the comments, but you should feel free to pre-compute and save other
arrangements of the data that you believe will be easier to work with (see how state is set after
CSV files are read in src/components/root.js).
* Finish functions buildColormapValue() and buildColormapValueMinusMean() (also in
src/components/util.js) to create useful colormaps for the computed measles rates, and use these
colormaps based on the "Colormap: value" and "Colormap: value-mean" radiobutton choices above the
HexMap. The goal of the first colormap is to enable *ordinal* comparisons of rates between different
states, over all times. The goal of the second colormap is to show how far each state is (again,
only in the sense of ordinal comparisons) above or below the national mean.  The colormaps should
enable visual detection of the outbreaks in the most recent years.  The colormap design takes some
care, because from 1930 to 2016 measles rates have decreased by many orders of magnitude.
* Enable sorting of per-state rows in the GridView according to the "Sort rows: alphabetical",
"mean", and "max" radiobutton at the top of the GridView.
* Display the national average measles rate in the LinePlot as a line plot.  This plot should be
fully opaque and be colored "orange".
* Display all the per-state rates, also in the LinePlot.  These should be colored "gray", and
only partially opaque (so we can judge where there are more plots overlapping).  The "stroke-width"
of these, and of the national average measles rate line plot (above), should balance visibility of
each line with clarity of the whole; width 2 does ok but you can adjust this.
* Permit the GridView to be used to select one year and one US-state, and, visually indicate the
selected year (a grid column) and state (a grid row). In src/components/root.js the selected year
and US-state are stored in the RootComponent's state as "selectedYear" and "selectedUSST".
You implement interactivity by responding to mouse events with
React. Users should be able to change the selected state and year by using the mouse;
responding to onMouseOver events may be easiest.  Exactly how you indicate the selected state or
year is up to you, but a simple way is to draw a rectangle around the selected grid row or column,
respectively.
* In the HexMap, changes to selectedYear will be apparent in the large-font year written above the
map. You should add to the HexMap event handling so that users can select a state with the mouse.
This should also (thanks to react) update the selected state in the GridView.  You should also add
to the HexMap some visual indication of which state is selected. Consider drawing another hexagonal
path as a some sort of outline or halo; something so that the underlying colormapped color of the
selected state can still be interpreted the same as non-selected states.
* The LinePlot shows the variation of rates with time with a clear spatial encoding that permits
approximate quantitative read-out and ratio comparisons.  Because the rates
vary so much over the years, you need to create and use different vertical scales depending on
the selected year; these can be hard-coded based on the (real) data that is given. One strategy
would be to use one vertical scale for 1930 to about 1968 (when the rates were highest), a different
vertical scale for about 1968 to 1995 (when the rates were much lower, thanks to the vaccine), and a
final scale for about 1995 to 2016 (when the rates were even lower, thanks to the second dose,
except for outbreaks).  It might be useful to divide the 1968 to 1995 interval again, or create
other sub-divisions, but don't create a different vertical scale for every year: the changes in the
vertical scaling shouldn't be visually confusing.
* With the given code, the LinePlot already shows the selected year. You should also indicate the
selected state by making its line plot (or over-drawing a new line plot that is) fully opaque and colored "blue".
This permits comparing the selected state to the national average.
* The LinePlot should support mouse interaction as well. Mousing over or clicking on (or some other
mouse interaction you choose) a state's line
plot (but not the national average plot) should select that state; thanks to react this
selection is shown in the other views. Using the mouse in the blank space between any per-state
plots should allow changing the selected year.  Using the mouse along the bottom horizontal scale
(below all the per-state plots) should enable changing the selected year without changing the
selected state.
* Finally, there should be a way of learning (via a google search) more about the recent outbreaks
that cause spikes in the per-state rates.  Somehow, the combination of the selected year and the
selected state, should produce a clickable link to a google search about the spike. One way is via
a tooltip that appears whenever you mouse-over or click on a per-state plot in the LinePlot view;
tooltips in the other views are welcome too. Either within the tooltip or some other
text element on the page, you should display:
"YEAR ST RATE.nn" where
 - YEAR is the 4-digit year
 - ST is the two-letter state abbreviation
 - RATE.nn is the calculated rate, shown to two decimal places (consider using d3's format)
This little bit of text must appear as an href link to:
https://www.google.com/search?q=measles+YEAR+STATE where
 - YEAR is the 4-digit year
 - STATE is the full state name (not the abbreviation)
For example, the LinePlot view should show some spikes for recent
outbreaks; one of them is 2014 in Ohio. The first few hits here
describe what caused it:
https://www.google.com/search?q=measles+2014+Ohio
For example, the full link should be appear as:
<a href="https://www.google.com/search?q=measles+2014+Ohio" rel="noopener noreferrer" target="_blank">2014 OH 32.90</a>
so that the link opens safely in a new window.

# What to modify:

You should be able to get all this work done by modifying:

* src/components/utils.js
* src/components/grid-view.js
* src/components/hex-map.js
* src/components/line-plots.js
* src/components/root.js (no changes required)
* src/stylesheets/main.cs (no changes required)

You're free to modify these files however you want, but the changes you need to make are (we hope)
flagged by "YOUR CODE HERE" or "ACTUALLY". There may be styles in main.css that aren't actually
used; that's ok. Lint will also flag some of these locations with "Unexpected comment inline with
code"; remove these comments once you've understood or acted on them (you can also make lint happy
by putting { and /* (or */ and }) on separate lines).

Do not modify other files without prior permission.

## Grading

* Lint must pass.  Lint errors in the given code arise from things that you
  should modify to complete the steps above.
* Tests must pass. However, the tests only assess calculateRates and calculateUSMeanRate
  in src/components/util.js.
* Graders will load your page and assess the 12 functionality points listed above in "What to do"
  You should make it so that graders can discover (by playing around) the interactivity enabled
  by mouse overs or clicking.  If you enabled interactivity by some other means, document that in a
  write-up.md.  A write-up.md file is not otherwise needed.  The 12 functionality points will
  have roughly equal value.
* Graders may notice if your page is sluggish in what should be fluidly interactive operations.
  Avoid redundant function calls (computing things repeatedly when the result will be the same as
  last time) by thinking about when things actually need to be computed: only once when
  that visualization component is first created?  In response to each and every mouse event?
  In response to some but not all events and property changes? The given code makes an effort
  to model good practice in this respect (with the hope that you can exercise the same
  thoughtfulness in how you code your p2), in how it uses the elements of a React.Component,
  such as constructor(), state, componentDidMount(), and componentWillReceiveProps().  See
  https://reactjs.org/docs/react-component.html for more details.
