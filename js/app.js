$(document).ready(function () {
    $("#maincontainer").sudokuify();
});

// Prevents other libraries that also use $ from causing issues
// Has scoping advantages as well
(function ($, _) {
    'use strict'; // JSLint stuff

    var sudokuBoxes = [];
    for (var i = 0; i < 3; i++) {
        sudokuBoxes.push(i);
    }

    var generateCell = function (cell, sudokuBoxes, origin) {
        _.each(sudokuBoxes, function (cellRow) {
            cell.append("<tr class='sudokuCellRow cellRow{0}-{1}' />".format(origin, cellRow));
            
            _.each(sudokuBoxes, function (cellColumn) {

                // Our label that we use as an id.
                // Looks like 1-1-2-1
                // Format is:
                // column-row-cellcolumn-cellrow
                var identityString = "{0}-{1}-{2}".format(origin, cellColumn, cellRow);

                var appendCell = "<td class='sudokuCellColumn cellColumn{0}' />".format(identityString);

                $(".cellRow{0}-{1}".format(origin, cellRow)).append(appendCell);

                // Finally layer that will hold content.
                $(".cellColumn{0}".format(identityString)).append("<div class='cellItemContainer cellItemContainer{0}'></div>".format(identityString));
            });
        });
    };

    $.fn.sudokuify = function () {
        var sudokuContainer = $(this);

        sudokuContainer.addClass("sudokuContainer centered");

        sudokuContainer.append("<table class='sudokuGrid' />");

        // Dynamically generates our sudoku grid
        _.each(sudokuBoxes, function (row) {


            $(".sudokuGrid").append("<tr class='sudokuRow row{0} {1}' />".format(row, row === 0 ? "gay" : ""));

            // Creates cells and sub-grids in each cell
            _.each(sudokuBoxes, function (column) {

                // Our label that we use as an id
                var identityString = "{0}-{1}".format(column, row);

                var appendCell = "<td class='sudokuCell cell{0}' />".format(identityString);
                
                $(".row{0}".format(row)).append(appendCell);

                var cell = $(".cell{0}".format(identityString));

                cell.append("<table class='sudokuCellGrid sudokuCellGrid{0}' />".format(identityString));

                generateCell($(".sudokuCellGrid{0}".format(identityString)),
                             sudokuBoxes,
                             identityString);
            });
        });

        console.log($(".sudokuGrid"));
    };
}(jQuery, _));