$(document).ready(function() {
    var chosen_numbers_limit = 8;
    var pool_numbers = 68;

    $(document).on("change", ".lottery_number", function() {
        var chosen_numbers = $(this).parents(".lottery_table").find(".lottery_number:checked").length;
        if (chosen_numbers > chosen_numbers_limit) {
            this.checked = false;
        }
    });

    $("#table_generator").click(function() {
        var valid = false;
        $("#step2").empty().fadeOut(0);
        $(".step1_error").fadeOut(0).html("");
        pool_numbers = parseInt($("#pool_number").val());
        chosen_numbers_limit = parseInt($("#drawn_number").val());

        if ($.isNumeric($("#pool_number").val()) && $.isNumeric($("#drawn_number").val())) {
            if (pool_numbers > 0 && chosen_numbers_limit > 0) {
                if (pool_numbers > chosen_numbers_limit) {
                    valid = true;
                } else {
                    $(".step1_error").html("Error: the amount of available numbers has to be larger than the drawn numbers").fadeIn();
                }
            } else {
                $(".step1_error").html("Error: input cannot be negative").fadeIn();
            }
        } else {
            $(".step1_error").html("Error: one of the inputs is not a number").fadeIn();
        }

        if (valid) {
            if (pool_numbers >= chosen_numbers_limit) {
                $("#step2").append("<p class=\"step2_error\"></p>").append("<div class=\"lottery_table\">Lottery table</br>");
                for (var i = 1; i <= pool_numbers; i++) {
                    $(".lottery_table").append("<label class=\"lottery_label\"><input class=\"lottery_number " + i + "\" type=\"checkbox\">" + i + "</label>");
                    if (i % 10 == 0) {
                        $(".lottery_table").append("</br>");
                    }
                }
                $("#step2").append("</br><button type=\"button\" id=\"back_to_settings\">Back</button>");
                $("#step2").append("<button type=\"button\" id=\"play_lottery\">Play</button></br>");
                $("#step1").fadeOut().promise().done(function() {
                    $("#step2").fadeIn();
                });
            }
        }
    });
    $(document).on("click", "#back_to_settings", function() {
        $("#step2").fadeOut().promise().done(function() {
            $("#step2").empty();
            $("#step1").fadeIn();
        });
    });
    $(document).on("click", "#try_again", function() {
        $("#step2").fadeOut().promise().done(function() {
            $("#step2").empty();
            $("#step1").fadeIn();
        });
    });
    $(document).on("click", "#play_lottery", function() {
        var valid = false;
        var checked_checkboxes = $(".lottery_number:checked")
        var checkboxes = $(".lottery_number")
        var chosen_numbers = checked_checkboxes.length;
        var guessed_numbers = 0;
        $(".step2_error").fadeOut(0).html("");
        if (chosen_numbers == chosen_numbers_limit) {
            valid = true;
        }
        if (valid) {
            checkboxes.prop("disabled", true);
            $("#back_to_settings").remove();
            $("#play_lottery").remove();
            $("#step2").append("<div id=\"chosen_numbers_list\">The lottery numbers are:</div>");
            $(".chosen_numbers").fadeOut(0);
            var random_numbers = getRandomNumbers(pool_numbers, chosen_numbers_limit);
            checked_checkboxes.parent().css("background-color", "red");
            for (var i = 0; i < chosen_numbers_limit; i++) {
                $("#chosen_numbers_list").append("<span class=\"random_number " + i + "\">" + random_numbers[i] + "</span>");
                if ($(".lottery_number:checked." + random_numbers[i]).length > 0) {
                    guessed_numbers++;
                    $(".lottery_number:checked." + random_numbers[i]).parent().css("background-color", "#00FF00");
                }
            }

            if (guessed_numbers < chosen_numbers_limit) {
                $("#chosen_numbers_list").append("<p id=\"message\">You have guessed " + guessed_numbers + " numbers out of " + chosen_numbers_limit + "</p>");
            } else {
                $("#chosen_numbers_list").append("<p id=\"message\">Congrugulations you have won the jackpot!</p>");
            }
            $("#chosen_numbers_list").fadeIn(5000);
            $(".random_number").fadeIn(5000).delay(1000);
            $("#message").fadeIn(5000).delay(2000);
            $("#step2").append("</br><button type=\"button\" id=\"try_again\">Try again</button>");
            $("#try_again").fadeIn(5000).delay(3000);
        } else {
            $(".step2_error").html("Error: please choose exactly " + chosen_numbers_limit + " numbers").fadeIn();;
        }
    });

});

function getRandomNumbers(pool_numbers, chosen_numbers_limit) {
    var numbers = [];
    var random_index = 0;
    var temp = 0;

    for (var i = 1; i <= pool_numbers; i++) {
        numbers.push(i);
    }
    for (var current_index = pool_numbers - 1; current_index > 0; current_index--) {
        random_index = Math.floor(Math.random() * (current_index + 1));
        temp = numbers[random_index];
        numbers[random_index] = numbers[current_index];
        numbers[current_index] = temp;
    }
    return numbers.slice(0, chosen_numbers_limit);
}