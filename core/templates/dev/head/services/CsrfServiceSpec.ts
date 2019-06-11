// Copyright 2018 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Tests that the csrf service is working as expected.
 */

require('services/CsrfService.ts')

describe('CSRF service factory', function() {
  var $httpBackend = null;
  var CsrfService = null;

  beforeEach(angular.mock.inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    CsrfService = $injector.get('CsrfService');
  }));

  it('should return the csrf token', function() {
    var response = {token: 'sample-csrf-token'};
    $httpBackend.expectPOST('/csrf').respond(response);

    CsrfService.setToken();
    expect(constants.csrf_token).toBe('sample-csrf-token');
  });
});
