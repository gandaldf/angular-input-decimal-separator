angular.module('ng-inputdecimalseparator', [])
    .directive('inputDecimalSeparator', [
  '$locale',
  function($locale) {
    return {
      restrict: 'A',
      require: '?ngModel',
      compile: function(element, attrs) {
        return function(scope, element, attrs, ctrl) {
          if (!ctrl) {
            return;
          }

          var decimalDelimiter = (!attrs.decimalDelimiter) ? $locale.NUMBER_FORMATS.DECIMAL_SEP : attrs.decimalDelimiter;
          var thousandsDelimiter = (!attrs.thousandsDelimiter) ? $locale.NUMBER_FORMATS.GROUP_SEP : attrs.thousandsDelimiter;
          var defaultDelimiter = '.';
          var decimalMax = isNaN(attrs.decimalMax) ? null : parseFloat(attrs.decimalMax);
          var decimalMin = isNaN(attrs.decimalMin) ? null : parseFloat(attrs.decimalMin);
          var noOfDecimal = null;
          var minus = '-';
          var isMinusExists = false;

          if (noOfDecimal || noOfDecimal != '') {
            noOfDecimal = isNaN(attrs.inputDecimalSeparator) ? 2 : Number(attrs.inputDecimalSeparator);
            noOfDecimal = Math.floor(noOfDecimal);
          }

          ctrl.$parsers.push(function(value) { // view - model
            if (!value || value === '') {
              return null;
            }

            var str = "[^0-9" + decimalDelimiter + "]";

            var regularExpression = new RegExp(str, 'g');

            var isMinusExists = value.indexOf(minus) == 0;

            var outputValue = value.replace(regularExpression, '');

            var tokens = outputValue.split(decimalDelimiter);
            tokens.splice(2, tokens.length - 2);

            if (noOfDecimal && tokens[1]) {
              tokens[1] = tokens[1].substring(0, noOfDecimal);
            }

            var result = tokens.join(decimalDelimiter);

            var actualNumber = tokens.join(defaultDelimiter);

            ctrl.$setValidity('max', true);
            ctrl.$setValidity('min', true);

            if (decimalMax && Number(actualNumber) > decimalMax) {
              ctrl.$setValidity('max', false);
            }

            if (decimalMin && Number(actualNumber) < decimalMin) {
              ctrl.$setValidity('min', false);
            }

            // apply thousand separator
            if (result) {
              tokens = result.split(decimalDelimiter);

              if (tokens[0]) {
                tokens[0] = tokens[0].split(/(?=(?:...)*$)/).join(thousandsDelimiter);
              }

              result = tokens.join(decimalDelimiter);
            }

            if (isMinusExists) {
              result = minus + result;
              actualNumber = minus + actualNumber;
            }

            if (result != value) {
              ctrl.$setViewValue(result);
              ctrl.$render();
            }

            return actualNumber;
          });

          ctrl.$formatters.push(function(value) { // model - view
            if (!value || value === '') {
              return null;
            }

            var str = "[^0-9" + defaultDelimiter + "]";

            var regularExpression = new RegExp(str, 'g');
            value = value.toString();

            var isMinusExists = value.indexOf(minus) == 0;
            value = value.replace(regularExpression, '');

            var tokens = value.split(defaultDelimiter);
            tokens.splice(2, tokens.length - 2);

            if (noOfDecimal && tokens[1]) {
              tokens[1] = tokens[1].substring(0, noOfDecimal);
            }

            var result = tokens.join(decimalDelimiter);

            var actualNumber = Number(tokens.join(defaultDelimiter));

            if (decimalMax && actualNumber > decimalMax) {
              ctrl.$setValidity('max', false);
            }

            if (decimalMin && actualNumber < decimalMin) {
              ctrl.$setValidity('min', false);
            }

            // apply thousand separator
            if (result) {
              tokens = result.split(decimalDelimiter);

              if (tokens[0]) {
                tokens[0] = tokens[0].split(/(?=(?:...)*$)/).join(thousandsDelimiter);
              }

              result = tokens.join(decimalDelimiter);

              if (isMinusExists) {
                result = minus + result;
              }
            }

            return result;
          });
        };
      }
    };
  }
]);
