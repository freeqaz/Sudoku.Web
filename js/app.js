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

    var methods = {
        defaults: {
            difficulty: "medium"
        },
        init: function () {
            this.config = $.extend({}, this.defaults, this.options);

            this.generateView();

            this.grid = this.generateSudokuPuzzle(this.config.difficulty);

            this.overwriteView(this.grid, true);

            return this;
        },
        // Generates a sudoku grid.
        // Takes in parameter for difficulty.
        // Options: 
        // "easy": 62, "medium": 53,
        // "hard": 44, "very-hard": 35,
        // "insane": 26, "inhuman": 17,
        // Or any int that you specify.
        // Returns a 2d array.
        generateSudokuPuzzle: function(difficulty) {
            var gridString = sudoku.generate(difficulty, false);

            return sudoku.board_string_to_grid(gridString);
        },
        generateView: function () {
            var self = this;

            var sudokuContainer = this.$elem;

            sudokuContainer.addClass("sudokuContainer centered");

            // Yeah... Pretty sure I wouldn't use a table in the future.
            // These things are miserable. Not flexible. :(
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
                    methods.generateCell($(".sudokuCellGrid" + identityString),
                                      sudokuBoxes,
                                      identityString);
                });
            });

            
            $(".sudokuNumberBarItem").click(function () {
                if ($(this).hasClass("disabled")) {
                    console.log("blah");
                    return;
                }

                var inputValue = $(this).text();

                var selectedTile = $(".selectedInput");
                var parsed = methods.parseIdentityString(selectedTile.data("identity"));

                selectedTile.empty().append(inputValue);

                self.grid[parsed.xGrid][parsed.yGrid] = inputValue;
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

            var self = {
                // When we click a tile in the grid that we want
                // To input a number on.
                clickInputTile: function () {
                    $(".sudokuInput").removeClass("selectedInput");
                    $(this).addClass("selectedInput");

                    var parsed = methods.parseIdentityString($(this).data("identity"));

                    var validMoves = sudoku.get_available_moves(grid, parsed.xGrid, parsed.yGrid);

                    $(".activeBarItem").removeClass("activeBarItem");
                    $(".sudokuNumberBarItem").addClass("disabled");

                    _.each(validMoves, function (move, i) {
                        $(".sudokuNumberBarItem[data-inputNumber='" + move + "']").addClass("activeBarItem")
                                                                                  .removeClass("disabled");
                    });
                },
                selectedTile: null
            };

            // Map our grid to the DOM.
            // This will overwrite existing data.
            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) {
                    for (var xCell = 0; xCell < 3; xCell++) {
                        // Inception!
                        for (var yCell = 0; yCell < 3; yCell++) {
                            var identityString = x + "-"
                                               + y + "-"
                                               + xCell + "-"
                                               + yCell;
                            var cell = $(".cellItemContainer" + identityString);
                            cell.removeClass("staticSudokuBackground");
                            cell.removeClass("sudokuInput");
                            cell.empty();

                            var currentTile = grid[(x * 3) + xCell][(y * 3) + yCell];

                            if (currentTile !== ".") {
                                // Immutable cell setup. 'known' values
                                cell.addClass("staticSudokuBackground")
                                    .data("identity", identityString);
                                cell.append("<div class='staticSudoku centered'>" + currentTile + "</div>");
                            }
                            else {
                                // Mutable cell setup. User defined
                                cell.data("identity", identityString);
                                cell.addClass("sudokuInput")
                                    .click(self.clickInputTile);
                            }
                        }
                    }
                }
            }
        },
        // Parses our metadata string into a usable object
        parseIdentityString: function (identityString) {
            var split = identityString.split("-");

            var parsed = {
                x: parseInt(split[0]),
                y: parseInt(split[1]),
                xCell: parseInt(split[2]), 
                yCell: parseInt(split[3])
            };

            parsed.xGrid = (parsed.x * 3) + parsed.xCell;
            parsed.yGrid = (parsed.y * 3) + parsed.yCell;
            
            return parsed;
        }
    };

    Sudoku.prototype = methods;

    Sudoku.defaults = Sudoku.prototype.defaults;

    $.fn.sudokuify = function (options) {
        return this.each(function () {
            new Sudoku(this, options).init();
        });
    };

    window.Sudoku = Sudoku;
})(window, jQuery);