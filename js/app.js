$(document).ready(function () {
    $("#maincontainer").sudokuify({});
});

;(function (window, $) {
    'use strict'; // JSLint stuff

    var Sudoku = function (elem, options) {
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
    };

    Sudoku.prototype = {
        defaults: {
            message: 'Hello world!'
        },
        init: function () {
            this.config = $.extend({}, this.defaults, this.options);

            this.generateView(this);

            var gridString = sudoku.generate("easy");

            this.overwriteView(sudoku.board_string_to_grid(gridString), true);

            return this;
        },
        generateSudokuPuzzle: function(difficulty) {
            var gridString = sudoku.generate(difficulty, false);


        },
        generateView: function (self) {

            var sudokuContainer = this.$elem;

            sudokuContainer.addClass("sudokuContainer centered");

            // Yeah... Pretty sure I wouldn't use a table in the future.
            // These things are miserable. :(
            // I'd probably hardcode the HTML as well, since
            // I'm never going to have a dynamically sized sudoku puzzle!
            // If I get a chance, maybe I'll rewrite this to use divs.
            // Bit more CSS but at least it will be reliable!
            sudokuContainer.append("<table class='sudokuGrid' />");

            // Used purely to iterate over something 3 times.
            var sudokuBoxes = [];
            for (var i = 0; i < 3; i++) {
                sudokuBoxes.push(i);
            }

            // Dynamically generates our sudoku grid
            _.each(sudokuBoxes, function (row) {

                $(".sudokuGrid").append("<tr class='sudokuRow row" + row + "' />");

                // Creates cells and sub-grids in each cell
                _.each(sudokuBoxes, function (column) {

                    // Our label that we use as an id
                    var identityString = column + "-" + row;

                    // Set our classes for styling purposes
                    var borderstring = "";
                    if (column > 0 && column < sudokuBoxes.length - 1) {
                        borderstring += "v ";
                    }

                    if (row > 0 && row < sudokuBoxes.length - 1) {
                        borderstring += "h ";
                    }

                    var appendCell = "<td class='sudokuCell cell" + identityString + " " + borderstring + "' />";

                    $(".row" + row).append(appendCell);

                    var cell = $(".cell" + identityString);

                    cell.append("<table class='sudokuCellGrid sudokuCellGrid" + identityString + "' />");

                    // Generate us a sub-cell
                    self.generateCell($(".sudokuCellGrid" + identityString),
                                      sudokuBoxes,
                                      identityString);
                });
            });
        },
        generateCell: function (cell, sudokuBoxes, origin) {
            _.each(sudokuBoxes, function (cellRow) {
                cell.append("<tr class='sudokuCellRow cellRow" + origin + "-" + cellRow + "' />");

                _.each(sudokuBoxes, function (cellColumn) {

                    // Our label that we use as an id.
                    // Looks like 1-1-2-1
                    // Format is:
                    // column-row-cellcolumn-cellrow
                    var identityString = origin + "-" + cellColumn + "-" + cellRow;

                    var appendCell = "<td class='sudokuCellColumn cellColumn" + identityString + "' />";

                    $(".cellRow" + origin + "-" + cellRow).append(appendCell);

                    // Final layer that will hold content.
                    $(".cellColumn" + identityString).append("<div class='cellItemContainer centered " +
                                                             "cellItemContainer" + identityString + "'></div>");
                });
            });
        },
        overwriteView: function (grid) {

            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) {
                    for (var xCell = 0; xCell < 3; xCell++) {
                        for (var yCell = 0; yCell < 3; yCell++) {
                            var identityString = x + "-" + y + "-" + xCell + "-" + yCell;
                            var cell = $(".cellItemContainer" + identityString);
                            cell.removeClass("staticSudokuBackground");
                            cell.removeClass("pure-button");
                            cell.empty();
                            if (grid[x + xCell][y + yCell] !== ".") {
                                cell.addClass("staticSudokuBackground");
                                cell.append("<div class='staticSudoku centered'>" + grid[x + xCell][y + yCell] + "</div>");
                            }
                            else {
                                cell.addClass("sudokuInput").click(function () { console.log("wow"); });
                            }
                        }
                    }
                }
            }
        }
    };

    Sudoku.defaults = Sudoku.prototype.defaults;

    $.fn.sudokuify = function (options) {
        return this.each(function () {
            new Sudoku(this, options).init();
        });
    };

    window.Sudoku = Sudoku;
})(window, jQuery);