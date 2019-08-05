// Copyright 2014 The Oppia Authors. All Rights Reserved.
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

require('domain/sidebar/SidebarStatusService.ts');
require('domain/utilities/UrlInterpolationService.ts');
require('services/AlertsService.ts');
require('services/CsrfTokenService.ts');
require('services/contextual/UrlService.ts');

require('app.constants.ts');

/**
 * @fileoverview Oppia's base controller.
 */

angular.module('oppia').controller('Base', [
  '$document', '$rootScope', '$scope', 'AlertsService', 'CsrfTokenService',
  'SidebarStatusService', 'UrlInterpolationService', 'UrlService', 'DEV_MODE',
  'SITE_FEEDBACK_FORM_URL', 'SITE_NAME',
  function(
      $document, $rootScope, $scope, AlertsService, CsrfTokenService,
      SidebarStatusService, UrlInterpolationService, UrlService, DEV_MODE,
      SITE_FEEDBACK_FORM_URL, SITE_NAME) {
    $scope.siteName = SITE_NAME;
    $scope.currentLang = 'en';
    $scope.pageUrl = UrlService.getCurrentLocation().href;
    $scope.getAssetUrl = function(path) {
      return UrlInterpolationService.getFullStaticAssetUrl(path);
    };

    $scope.AlertsService = AlertsService;
    $rootScope.DEV_MODE = DEV_MODE;
    // If this is nonempty, the whole page goes into 'Loading...' mode.
    $rootScope.loadingMessage = '';

    CsrfTokenService.initializeToken();

    // Listener function to catch the change in language preference.
    $rootScope.$on('$translateChangeSuccess', function(evt, response) {
      $scope.currentLang = response.language;
    });

    $scope.siteFeedbackFormUrl = SITE_FEEDBACK_FORM_URL;
    $scope.isSidebarShown = SidebarStatusService.isSidebarShown;
    $scope.closeSidebarOnSwipe = SidebarStatusService.closeSidebar;

    $scope.skipToMainContent = function() {
      var mainContentElement = document.getElementById(
        'oppia-main-content');

      if (!mainContentElement) {
        throw Error('Variable mainContentElement is undefined.');
      }
      mainContentElement.tabIndex = -1;
      mainContentElement.scrollIntoView();
      mainContentElement.focus();
    };
    // TODO(sll): use 'touchstart' for mobile.
    $document.on('click', function() {
      SidebarStatusService.onDocumentClick();
      $scope.$apply();
    });
  }
]);
