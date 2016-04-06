'use strict';

describe('Service: projectsService', function () {

  // load the service's module
  beforeEach(module('pomApp'));

  // instantiate service
  var projectsService;
  beforeEach(inject(function (_projectsService_) {
    projectsService = _projectsService_;
  }));

  it('should do something', function () {
    expect(!!projectsService).toBe(true);
  });

});
