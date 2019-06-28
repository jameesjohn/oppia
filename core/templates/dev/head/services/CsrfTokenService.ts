// Copyright 2019 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Service for managing CSRF tokens.
 */

oppia.factory('CsrfTokenService', [function() {
  var token = null;
  var tokenPromise = null;

  return {
    initializeToken: function() {
      if (tokenPromise !== null) {
        throw new Error('Token request already made');
      }
      tokenPromise = new Promise(function(resolve, reject) {
        // We use jQuery here instead of Angular's $http, since the latter
        // creates a circular dependency.
        $.ajax({
          url: '/csrfhandler',
          type: 'GET',
          dataType: 'text',
          dataFilter: function(data) {
            // Remove the XSSI prefix.
            var transformedData = data.substring(5);
            return JSON.parse(transformedData);
          },
        }).done(function(response) {
          token = response.token;
          resolve(response.token);
        });
      });
    },

    getTokenAsync: function() {
      if (token) {
        return new Promise(function(resolve, reject) {
          resolve(token);
        });
      }
      if (tokenPromise) {
        return tokenPromise;
      } else {
        throw new Error('Token needs to be initialized');
      }
    }
  };
}]);
