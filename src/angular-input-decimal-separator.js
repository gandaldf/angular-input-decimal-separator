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
          var noOfDecimal = (!attrs.inputDecimalSeparator) ? 2 : Math.floor(Number(attrs.inputDecimalSeparator));
          var enforceDecimal = (attrs.enforceDecimal === 'true') ? true : false;
          var minus = '-';
          var isMinusExists = false;

          ctrl.$parsers.push(function(value) { // view - model
            var str = "[^0-9" + decimalDelimiter + "]";

            var regularExpression = new RegExp(str, 'g');

            var isMinusExists = value.indexOf(minus) == 0;
            
            var outputValue = value.replace(regularExpression, '');

            var tokens = outputValue.split(decimalDelimiter);
            tokens.splice(2, tokens.length - 2);

            if (noOfDecimal >= 0 && tokens[1]) {
              if (noOfDecimal > 0) {
                tokens[1] = tokens[1].substring(0, noOfDecimal);
              } else {
                tokens.splice(1, 1);
              }
            }

            var result = tokens.join(decimalDelimiter);

            var actualNumber = tokens.join(defaultDelimiter);

            if (isMinusExists) {
              actualNumber = minus + actualNumber;
            }

            ctrl.$setValidity('nan', true);
            ctrl.$setValidity('max', true);
            ctrl.$setValidity('min', true);

            if (actualNumber !== null && isNaN(actualNumber)) {
              ctrl.$setValidity('nan', false);
            }

            if (decimalMax !== null && Number(actualNumber) > decimalMax) {
              ctrl.$setValidity('max', false);
            }

            if (decimalMin !== null && Number(actualNumber) < decimalMin) {
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
            }

            if (result != value) {
              ctrl.$setViewValue(result);
              ctrl.$render();
            }

            return actualNumber;
          });

          ctrl.$formatters.push(function(value) { // model - view
            var str = "[^0-9" + defaultDelimiter + "]";

            var regularExpression = new RegExp(str, 'g');
            value = value.toString();

            var isMinusExists = value.indexOf(minus) == 0;
            value = value.replace(regularExpression, '');

            var tokens = value.split(defaultDelimiter);
            tokens.splice(2, tokens.length - 2);

            if (noOfDecimal >= 0 && tokens[1] && enforceDecimal) {
              if (noOfDecimal > 0) {
                tokens[1] = tokens[1].substring(0, noOfDecimal);
              } else {
                tokens.splice(1, 1);
              }
            }

            var result = tokens.join(decimalDelimiter);

            var actualNumber = tokens.join(defaultDelimiter);

            if (isMinusExists) {
              actualNumber = minus + actualNumber;
            }
            
            ctrl.$setValidity('nan', true);
            ctrl.$setValidity('max', true);
            ctrl.$setValidity('min', true);

            if (actualNumber !== null && isNaN(actualNumber)) {
              ctrl.$setValidity('nan', false);
            }

            if (decimalMax !== null && Number(actualNumber) > decimalMax) {
              ctrl.$setValidity('max', false);
            }

            if (decimalMin !== null && Number(actualNumber) < decimalMin) {
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
            }
            
            if (result != value && enforceDecimal) {
              ctrl.$setViewValue(result);
              ctrl.$render();
            }

            return result;
          });
        };
      }
    };
  }
]);
