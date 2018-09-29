"use strict";

(function () {
    // constants
    const BASE_WIDTH = "#base-width";
    const BASE_HEIGHT = "#base-height";
    const RESULT_WIDTH = "#result-width";
    const RESULT_HEIGHT = "#result-height";
    const MESSAGE = "#message";
    const MOD_WIDTH = "#width-";
    const MOD_HEIGHT = "#height-";
    const MOD_MIN_CORRECTION = "#correction-min-";
    const MOD_SUM_CORRECTION = "#correction-sum-";
    const RESET_BUTTON = "#reset";

    // init values
    resetAll();

    // events
    $(BASE_WIDTH).keyup(() => {
        if (validate([BASE_WIDTH])) {
            calculateRatio();
        }
    });
    $(BASE_HEIGHT).keyup(() => {
        if (validate([BASE_HEIGHT])) {
            calculateRatio();
        }
    });
    $(RESULT_WIDTH).keyup(() => doCalculation(RESULT_WIDTH, RESULT_HEIGHT));
    $(RESULT_HEIGHT).keyup(() => doCalculation(RESULT_HEIGHT, RESULT_WIDTH));
    $(RESET_BUTTON).click(() => resetAll());

    /* FUNCTIONS */
    function calculateRatio() {
        var baseRatio = $(BASE_WIDTH).val() / $(BASE_HEIGHT).val();
        var resultRatio = $(RESULT_WIDTH).val() / $(RESULT_HEIGHT).val();
        var message = "";
        if (isFinite(baseRatio)) {
            message = "Your base ratio is " + baseRatio.toFixed(2) + ":1";
        }
        if (isFinite(resultRatio)) {
            message = message + "<br>Your result ratio is " + resultRatio.toFixed(2) + ":1";
        }
        showMessage(message);
    }

    function doCalculation(entry, result) {
        if (validate([entry])) {
            $(result).val(calculate(entry));
            if (validate([result])) {
                processAllMod();
                calculateRatio();
            }
        } else {
            $(result).val("");
            resetAllMods();
        }
    }

    function isEmpty(element) {
        return $(element).val() === undefined || $(element).val().trim() === "";
    }

    function resetAllMods() {
        resetMods([16, 8, 4, 2]);
    }

    function calculate(a) {
        var result = "";
        if ($(a).val() !== "") {
            result = Math.round(($(BASE_HEIGHT).val() * $(a).val()) / $(BASE_WIDTH).val());
        }
        return result;
    }

    function resetAll() {
        $(BASE_WIDTH).val("1280");
        $(BASE_HEIGHT).val("720");
        $(RESULT_WIDTH).val("");
        $(RESULT_HEIGHT).val("");
        hideMessage();
        resetAllMods();
        setValidInput([BASE_WIDTH, BASE_HEIGHT, RESULT_WIDTH, RESULT_HEIGHT]);
        calculateRatio();
    }

    function validate(inputs) {
        var isAllValid = true;

        var validations = new Array();
        inputs.forEach(input => validations[input] = isValid(input));

        Object.keys(validations).forEach(key => {
            if (validations[key] === false) {
                isAllValid = false;
                setInvalidInput([key]);
            } else {
                setValidInput([key]);
            }
        })

        if (isAllValid) {
            hideMessage();
        } else {
            showError("Invalid number found");
        }

        return isAllValid;
    }

    function showMessage(msg) {
        $(MESSAGE).html(msg);
        $(MESSAGE).removeClass('text-danger');
        $(MESSAGE).addClass('text-dark');
    }

    function showError(msg) {
        $(MESSAGE).html(msg);
        $(MESSAGE).addClass('text-danger');
        $(MESSAGE).removeClass('text-dark');
    }

    function hideMessage() {
        $(MESSAGE).html("");
        $(MESSAGE).removeClass('text-danger');
        $(MESSAGE).removeClass('text-dark');
    }

    function isValid(id) {
        return !isEmpty(id) && !isNaN($(id).val());
    }

    function processAllMod() {
        doMod([16, 8, 4, 2]);
    }

    function doMod(mods) {
        var width = $(RESULT_WIDTH).val();
        var height = $(RESULT_HEIGHT).val();

        const checkMod = (size, mod, element) => {
            if (size % mod == 0) {
                setValidMod(element + mod);
                return true;
            } else {
                setInvalidMod(element + mod);
                doCorrection(mod);
                return false;
            }
        };

        mods.forEach(mod => {
            var widthValid = checkMod(width, mod, MOD_WIDTH);
            var heightValid = checkMod(height, mod, MOD_HEIGHT);
            if (widthValid && heightValid) {
                cleanCorrection(mod);
            }
        });
    }

    function cleanCorrection(mod) {
        $(MOD_SUM_CORRECTION + mod).html("");
        $(MOD_MIN_CORRECTION + mod).html("");
    }

    function doCorrection(mod) {
        var minWidth = $(RESULT_WIDTH).val();
        var minHeight = $(RESULT_HEIGHT).val();
        var sumWidth = minWidth.valueOf();
        var sumHeight = minHeight.valueOf();

        while (sumWidth % mod != 0) sumWidth++;
        while (sumHeight % mod != 0) sumHeight++;
        while (minWidth % mod != 0) minWidth--;
        while (minHeight % mod != 0) minHeight--;

        $(MOD_SUM_CORRECTION + mod).html(sumWidth + " x " + sumHeight);
        $(MOD_MIN_CORRECTION + mod).html(minWidth + " x " + minHeight);
    }

    function setValidInput(inputs) {
        inputs.forEach(input => $(input).removeClass('is-invalid'));
    }

    function setInvalidInput(inputs) {
        inputs.forEach(input => $(input).addClass('is-invalid'));
    }

    function setValidMod(element) {
        $(element).addClass('text-white');
        $(element).addClass('bg-success');
        $(element).removeClass('bg-danger');
        $(element).html('Valid');
    }

    function setInvalidMod(element) {
        $(element).addClass('text-white');
        $(element).addClass('bg-danger');
        $(element).removeClass('bg-success');
        $(element).html('Invalid');
    }

    function resetMods(mods) {
        mods.forEach(mod => {
            resetMod(MOD_WIDTH + mod);
            resetMod(MOD_HEIGHT + mod);
            resetMod(MOD_MIN_CORRECTION + mod);
            resetMod(MOD_SUM_CORRECTION + mod);
        });
    }

    function resetMod(element) {
        $(element).removeClass('bg-danger');
        $(element).removeClass('bg-success');
        $(element).html('');
    }
})();
