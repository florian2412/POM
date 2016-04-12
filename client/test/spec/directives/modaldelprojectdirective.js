'use strict';

describe('Directive: modalDelProjectDirective', function () {

  // load the directive's module
  beforeEach(module('pomApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<modal-del-project-directive></modal-del-project-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the modalDelProjectDirective directive');
  }));
});
