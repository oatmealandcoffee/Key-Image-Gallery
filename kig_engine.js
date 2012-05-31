/* Content */

/* values to help manage image locations */

var imagePath = 'images/';
var thumbImagePrefix = 't';

// this is not entirely necessary but added in case URLs need to change without our knowing
// during development
var fullImagePrefix = '';

/*
chapterContent only holds that content related to the chapters themselves. Each chapter has 
the following data points: chapter ordinal, chapter title, chapter author, first chapter image, 
last chapter image.
*/
var chapterContent = new Array( 
	'chapter_01.html', '1', 'Unicorns', '', '1', '9', 
	'chapter_02.html', '2', 'Ponies', '', '10', '19',
	'chapter_03.html', '3', 'Rainbows', '', '20', '29',
);

var kOffsetChapterFileName = 0;
var kOffsetChapterOrdinal = 1;
var kOffsetChapterTitle = 2;
var kOffsetChapterAuthor = 3;
var kOffsetChapterFirstImage = 4;
var kOffsetChapterLastImage = 5;

// helper constant to sort out how the number of rows is calculated elsewhere in the engine
var kMaxChapterOffset = kOffsetChapterLastImage + 1;

// faux-constant to aid in getting a proper index together
var kNoChapterIndexExclusion = -1;

/*
 figureContent is the main content store for the KIR. Each image has the following data points:
 filename, Callout, Title, Caption, and Credit. Indexes to each of the "rows" are managed in
 the main table in the Table View. Offsets to each of the data points within a row are managed
 in the Content Population section below.

 NB: This array is the only point of common customization for the KIR. Nothing below this
 array needs to be customized unless features are being altered.
 */

// Paste the contents of the contentArray.js file here
var figureContent = new Array(
"fpo.png", "Title 01.01", "Figure 01.01", "Caption 01.01", "Credit 01.01",
"fpo.png", "Title 01.02", "Figure 01.02", "Caption 01.02", "Credit 01.02",
"fpo.png", "Title 01.03", "Figure 01.03", "Caption 01.03", "Credit 01.03",
"fpo.png", "Title 01.04", "Figure 01.04", "Caption 01.04", "Credit 01.04",
"fpo.png", "Title 01.05", "Figure 01.05", "Caption 01.05", "Credit 01.05",
"fpo.png", "Title 01.06", "Figure 01.06", "Caption 01.06", "Credit 01.06",
"fpo.png", "Title 01.07", "Figure 01.07", "Caption 01.07", "Credit 01.07",
"fpo.png", "Title 01.08", "Figure 01.08", "Caption 01.08", "Credit 01.08",
"fpo.png", "Title 01.09", "Figure 01.09", "Caption 01.09", "Credit 01.09",

"fpo.png", "Title 02.01", "Figure 02.01", "Caption 02.01", "Credit 02.01",
"fpo.png", "Title 02.02", "Figure 02.02", "Caption 02.02", "Credit 02.02",
"fpo.png", "Title 02.03", "Figure 02.03", "Caption 02.03", "Credit 02.03",
"fpo.png", "Title 02.04", "Figure 02.04", "Caption 02.04", "Credit 02.04",
"fpo.png", "Title 02.05", "Figure 02.05", "Caption 02.05", "Credit 02.05",
"fpo.png", "Title 02.06", "Figure 02.06", "Caption 02.06", "Credit 02.06",
"fpo.png", "Title 02.07", "Figure 02.07", "Caption 02.07", "Credit 02.07",
"fpo.png", "Title 02.08", "Figure 02.08", "Caption 02.08", "Credit 02.08",
"fpo.png", "Title 02.09", "Figure 02.09", "Caption 02.09", "Credit 02.09",

"fpo.png", "Title 03.01", "Figure 03.01", "Caption 03.01", "Credit 03.01",
"fpo.png", "Title 03.02", "Figure 03.02", "Caption 03.02", "Credit 03.02",
"fpo.png", "Title 03.03", "Figure 03.03", "Caption 03.03", "Credit 03.03",
"fpo.png", "Title 03.04", "Figure 03.04", "Caption 03.04", "Credit 03.04",
"fpo.png", "Title 03.05", "Figure 03.05", "Caption 03.05", "Credit 03.05",
"fpo.png", "Title 03.06", "Figure 03.06", "Caption 03.06", "Credit 03.06",
"fpo.png", "Title 03.07", "Figure 03.07", "Caption 03.07", "Credit 03.07",
"fpo.png", "Title 03.08", "Figure 03.08", "Caption 03.08", "Credit 03.08",
"fpo.png", "Title 03.09", "Figure 03.09", "Caption 03.09", "Credit 03.09"
);

var kOffsetImageFilename = 0;
var kOffsetImageTitle = 1;
var kOffsetImageCallout = 2;
var kOffsetImageCaption = 3;
var kOffsetImageCredit = 4;

// helper constant to sort out how the number of rows is calculated elsewhere in the engine
var kMaxImageOffset = kOffsetImageCredit + 1;

// column span for a table is held here for easy editing
var stdColspan = 5;

/* Navigation */

/*
 Manages the opening of the full size image window, which in turn calls the content population
 functions back to here.
 */

function openFullWindow( tIndex ) {
	indexSelected = tIndex;
	window.open('full_image.html?' + tIndex, '_blank', 'width=800,height=600,resizable=yes,scrollbars=1', 'false');
}

function getIndexFromURL( tURL ) {
	var theHREF = document.location.href;
	var delimiterIndex = theHREF.indexOf('?'); // get the location of the delimiter to sort out the index location
	return theHREF.substring(delimiterIndex + 1, theHREF.length);
}

/*
 Chapter content getter. Accepts the "row" for the desired content, and the "column" in which
 it resides
 */

function getChapterContentAtIndexAndOffset( idx , offset ) {
	return chapterContent[ ( idx * kMaxChapterOffset ) + offset ];
}

/*
 Image content getter. Similar profile as chapter content only also accepts a flag for whether
 we want the thumbnail version of an image or not.
 */

function getImageContentAtIndexAndOffset( idx , offset, thumb ) {
	
	var c = figureContent[ ( idx * kMaxImageOffset ) + offset ];
	
	if ( offset == kOffsetImageFilename ) {
		if ( thumb ) {
			return imagePath + thumbImagePrefix + c;
		} else {
			return imagePath + fullImagePrefix + c;
		}
	}
	
	return c;
}

/*
 Returns the HTML for a chapter's thumbnail view table given the chapter's number and indexes
 for the first and last numbers.
 */
function makeChapterTable( chNum , imgStart, imgStop ) {

	var t = createMainTableHeader( chNum , imgStart, imgStop, stdColspan );

	var startCol = 0;
	var thisCol = startCol;

	for ( var img = imgStart ; img <= imgStop ; img++ ) {
		
		// add a comment for debugging use
		
		t += '<!-- CHAPTER CONTENT -->\n';
		
		// if the column count is the same as the start column, start a new row, and up the 
		// column count for later
		
		if ( thisCol == startCol ) {
			t += '<tr valign="top">\n';
			thisCol = startCol;
		}
		thisCol++;
		
		// new cell
		t += '<td class="figureTableCell">\n';
		t += createImageTable( img );
		t += '</td>\n';
		
		// if the column count is the same as the end column, close the row, reset the column 
		
		// count
		if ( thisCol == stdColspan ) {
			t += '</tr>\n';
			thisCol = startCol;
		}
	}

	t += createMainTableFooter();

	return t;
}

/*
 Returns the HTML for a thumbnail view table given an array of image indexes
*/
function makeResultsTable( indexes ) {
	
	var startCol = 0;
	var thisCol = startCol;
	var imgStop = indexes.length;

	var t = '<!-- CHAPTER START -->\n';
	t +=  '<table class="mainLayoutTable" id="0_0_' + imgStop + '">\n';
	t +=  '<!-- CHAPTER HEADER -->\n';
	t +=  '<tr valign="top"><td class="chapterLabel" colspan=' + stdColspan + '>\n';
	t +=  '<p>Search Results for "' + parseSearchURL( document.URL ) + '"</p></td></tr>\n';
	
	for ( var img = 0 ; img <= imgStop ; img++ ) {
		
		if ( ( indexes[img] != undefined ) || ( indexes[img] > figureContent.length ) ) {
		
			// add a comment for debugging use
			
			t += '<!-- CHAPTER CONTENT -->\n';
			
			// if the column count is the same as the start column, start a new row, and up the 
			// column count for later
			
			if ( thisCol == startCol ) {
				t += '<tr valign=\'top\'>\n';
				thisCol = startCol;
			}
			thisCol++;
			
			// new cell
			t += '<td class=\'figureTableCell\'>\n';
			t += createImageTable( indexes[img] );
			t += '</td>\n';
			
			// if the column count is the same as the end column, close the row, reset the column 
			// count
			
			if ( thisCol == stdColspan ) {
				t += '</tr>\n';
				thisCol = startCol;
			}
		}
	}

	t += createMainTableFooter();
	
	return t;
}

/*
PRIVATE
Returns a string of HTML for the header for a chapter table
*/
function createMainTableHeader( chNum, imgStart, imgStop, stdColspan ) {
	var t = '<!-- CHAPTER START -->\n';
	t +=  '<table class="mainLayoutTable" id="' + chNum + '_' + imgStart + '_' + imgStop + '">\n';
	t +=  '<!-- CHAPTER HEADER -->\n';
	t +=  '<tr valign="top"><td class="chapterLabel" colspan=' + stdColspan + '>\n';
	//t +=  '<p>Chapter ' + getChapterContentAtIndexAndOffset( chNum , kOffsetChapterOrdinal ) + '<br/>' + getChapterContentAtIndexAndOffset( chNum , kOffsetChapterTitle ) + '<br/> by ' + getChapterContentAtIndexAndOffset( chNum , kOffsetChapterAuthor ) + '</p></td></tr>\n';
	t +=  '<p>Chapter ' + getChapterContentAtIndexAndOffset( chNum , kOffsetChapterOrdinal ) + '<br/>' + getChapterContentAtIndexAndOffset( chNum , kOffsetChapterTitle ) + '</p></td></tr>\n';

	return t;
}

/*
PRIVATE
Returns a string of HTML for the complete picture and metadata pair for an image
*/
function createImageTable( img ) {
	var t = '<!-- FIGURE TABLE START --><table class="figureTable">\n';
	t += '<!-- FIGURE IMAGE START --><tr valign="top"><td class="figureThumbnailImage">\n';
	t += '<a onMouseDown="javascript:openFullWindow(' + img + ')" name="callout">\n';
	t += '<img src="' + getImageContentAtIndexAndOffset( img , kOffsetImageFilename , true ) + '" width=100 /></a></td></tr>\n';
	t += '<!-- FIGURE IMAGE END --><!-- FIGURE METADATA START -->\n';
	t += '<tr valign="top"><td class="figureThumbnailCallout">\n';
	t += '<b>' + getImageContentAtIndexAndOffset( img , kOffsetImageCallout , false ) + '</b><br />\n';
	t += getImageContentAtIndexAndOffset( img , kOffsetImageTitle , false ) + '<br />\n';
	//t += getImageContentAtIndexAndOffset( img , kOffsetImageCredit , false ) + '<br /></td>\n';
	t += '</tr><!-- FIGURE METADATA END --></table><!-- FIGURE TABLE END -->\n';
	return t;
}

/*
PRIVATE
Returns a string of HTML for the footer for a chapter table
*/
function createMainTableFooter() {
	var t = '</table>\n';
	t +=  '<!-- CHAPTER END -->\n';
	return t;
}

/*
Returns a string of HTML for the complete chapter listing with links
*/
function createChapterLinkIndexWithExclusion( excludeChapter, includeHomeLink ) {

	/*
	Example index with both a linkable and non-linkable chapter (meaning that is the chapter they 
	are currently viewing
	<!-- Chapter Index -->
	<table class="chapterIndex">
		<tr><td class="chapterIndexLink"><a href="__filename__">Chapter __ordinal__: __title__></a></td></tr>
		<tr><td class="chapterIndexItem">Chapter __ordinal__: __title__</td></tr>
	</table>
	*/

	var t = '<table class="chapterIndex">';
	
	if ( includeHomeLink ) {
		t += '<tr><td class="componentIndexLink"><a href="index.html">Index and Search</a></td></tr>';
	}
	
	var lastChapter = chapterContent.length / kMaxChapterOffset;
	for ( var thisChapter = 0 ; thisChapter < lastChapter ; thisChapter++ ) {
		if ( thisChapter == excludeChapter) {
			t += '<tr><td class="chapterIndexLink">Chapter ' + getChapterContentAtIndexAndOffset( thisChapter , kOffsetChapterOrdinal ) + ': ' + getChapterContentAtIndexAndOffset( thisChapter , kOffsetChapterTitle ) + '</td></tr>';
		} else {
			t += '<tr><td class="chapterIndexItem"><a href="' + getChapterContentAtIndexAndOffset( thisChapter , kOffsetChapterFileName ) + '">Chapter ' + getChapterContentAtIndexAndOffset( thisChapter , kOffsetChapterOrdinal ) + ': ' + getChapterContentAtIndexAndOffset( thisChapter , kOffsetChapterTitle ) + '</a></td></tr>';
		}
	}
	
	t += '</table>';
	return t;
}

/* SEARCH STACK */

/*
Triggers the searching functionality. Accepts the search terms, generates a URL,
then moves the browser forward. Actual searching is triggered once the new
window loads
*/
function prepSearch( terms ) {

	// catch the obvious errors
	
	if ( !termsAreSearchable( terms ) ) {
		return;
	}

	// sanitize terms
	var sanitizedTerms = sanitizeSearchTerms( terms );
	
	// create a URL for the search so the user can use it later
	window.location.href = 'search_results.html?' + sanitizedTerms;
	
	// at this point, actual searching is triggered by the search results window
}

/*
PRIVATE
Helper method that checks the validity of the entry for alphanumeric characters. Returns false 
when it finds no alphanumerics of any kind. So, spaces, punctuation, and the like, and only
those in the string are 
*/

function termsAreSearchable ( terms ) {

	// check for the simp
	
	// check for an accidental click on the search button
	if ( terms == null || terms == '' ) {
		 return false;
	}
	
	// a lot of other things can happen at this point, so we check to see if alphanumerics 
	// are at least present.
	
	var alphaNumericRegExp = /([a-zA-Z0-9]+)$/;
	if ( alphaNumericRegExp.test( terms ) == false)
	{
		return false;
	}
	
	return true;
}

/*
PRIVATE
Returns a URL-ready version of the search terms. Remove any common words not relevant
to any chapter content
*/
function sanitizeSearchTerms( terms ) {

	var cleanWords = [];
	// split the text to get the individual search terms
	var rawWords = terms.split( ' ' );
	// for each raw word
	//     remove all non-alphanumerics
	for ( var i = 0, lastWord = rawWords.length ; i < lastWord ; i++ ) {
		var rawWord = rawWords[i];
		// this tackles common yet specific punctuation
		var cleanWord = rawWord.replace( /[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g , "" );
		cleanWords.push( cleanWord );
	}
	// combine into URL-ready string: var url = myData.join('&');
	return cleanWords.join( '&' );
}

/*
parses the terms in the given URL. Returns HTML tables with results
*/
function searchWithResults( searchURL ) {

	var searchTerms = parseSearchURL( searchURL );
	var lastSearchTerm = searchTerms.length;
	var resultRows = [];
	
	// for each term
	// get the rows with the titles in the title and caption
	// pile everything into a single list
	
	for ( var thisSearchTerm = 0 ; thisSearchTerm < lastSearchTerm ; thisSearchTerm++ ) {
		resultRows = resultRows.concat( searchDataPointWithTerm( kOffsetImageFilename, searchTerms[thisSearchTerm] ) );
		resultRows = resultRows.concat( searchDataPointWithTerm( kOffsetImageTitle, searchTerms[thisSearchTerm] ) );
		resultRows = resultRows.concat( searchDataPointWithTerm( kOffsetImageCallout, searchTerms[thisSearchTerm] ) );
		resultRows = resultRows.concat( searchDataPointWithTerm( kOffsetImageCaption, searchTerms[thisSearchTerm] ) );
		resultRows = resultRows.concat( searchDataPointWithTerm( kOffsetImageCredit, searchTerms[thisSearchTerm] ) );
	}
	
	// sort the terms
	resultRows = mergeSort( resultRows );
	
	// remove the dupes
	resultRows = removeDuplicateValuesFromArray( resultRows );
	
	// for each index, build the results HTML table and return
	
	if ( resultRows.length == 0 ) {
		return '<p>No results found.</p>';
	}
	
	
	var html = makeResultsTable( resultRows );
	
	// prototype code for troubleshooting
	//html += '<p>' + resultRows + '</p>';
	
	return html;
	
}

/*
PRIVATE
Core function that checks a single data point for a single term
*/
function searchDataPointWithTerm( dataOffset , searchTerm ) {
	
	var matchingRows = [];
	
	// use regex to get case-insensitive partials
	var regex = new RegExp( searchTerm, 'gi');
			
	var lastRow = figureContent.length / kMaxImageOffset;
	
	for ( var thisRow = 0 ; thisRow < lastRow ; thisRow++ ) {
		if ( figureContent[ ( thisRow * kMaxImageOffset ) + dataOffset ].search( regex ) > -1 ) {
			matchingRows.push( thisRow );
		}
	}
	
	// return the array of indexes that contain that term
	return matchingRows;
}

/*
PRIVATE
returns an array of the search terms in the given URL
*/
function parseSearchURL( searchURL ) {
	var urlParts = searchURL.split( '?' );
	return urlParts[1].split( '&' );
}

/*
PRIVATE
Merge sort
*/
function mergeSort( arr )
{
    if (arr.length < 2)
        return arr;
 
    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);
 
    return merge(mergeSort(left), mergeSort(right));
}
 
function merge( left, right )
{
    var result = [];
 
    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
 
    while (left.length)
        result.push(left.shift());
 
    while (right.length)
        result.push(right.shift());
 
    return result;
}


/*
PRIVATE
returns an array of only the unique items in an array
*/
function removeDuplicateValuesFromArray( arr ) {

	/*
	This utilizes the key-value functionality of Javascript objects by placing each item in
	the array as both the key and values. Since each key has to be unique, this is handled
	for us.
	*/
	var cacheObj = {};
	var lastItem = arr.length;
	for ( var i = 0 ; i < lastItem ; i++ ) {
		cacheObj[ arr[i] ] = arr[i];
	}
	// now that all of the keys have been populated, let's get them out
	var lastKey = cacheObj.length;
	var keys = [];
	for ( var key in cacheObj ) {
		keys.push( key );
	}
	return keys;
}