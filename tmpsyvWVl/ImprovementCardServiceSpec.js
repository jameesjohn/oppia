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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileoverview Unit tests for the ImprovementCardService.
 */
// TODO(YashJipkate) Remove the following block of unnnecessary imports once
// ImprovementCardService.ts is upgraded to Angular 8.
var AnswerClassificationResultObjectFactory_ts_1 = require("domain/classifier/AnswerClassificationResultObjectFactory.ts");
var ExplorationDraftObjectFactory_ts_1 = require("domain/exploration/ExplorationDraftObjectFactory.ts");
var ClassifierObjectFactory_ts_1 = require("domain/classifier/ClassifierObjectFactory.ts");
var RuleObjectFactory_ts_1 = require("domain/exploration/RuleObjectFactory.ts");
var WrittenTranslationObjectFactory_ts_1 = require("domain/exploration/WrittenTranslationObjectFactory.ts");
// ^^^ This block is to be removed.
require('domain/statistics/FeedbackImprovementCardObjectFactory.ts');
require('domain/statistics/PlaythroughImprovementCardObjectFactory.ts');
require('domain/statistics/SuggestionImprovementCardObjectFactory.ts');
require('services/ImprovementCardService.ts');
describe('ImprovementCardService', function () {
    var $q = null;
    var $rootScope = null;
    var ImprovementCardService = null;
    var FeedbackImprovementCardObjectFactory = null;
    var PlaythroughImprovementCardObjectFactory = null;
    var SuggestionImprovementCardObjectFactory = null;
    beforeEach(angular.mock.module('oppia'));
    beforeEach(angular.mock.module('oppia', function ($provide) {
        $provide.value('AnswerClassificationResultObjectFactory', new AnswerClassificationResultObjectFactory_ts_1.AnswerClassificationResultObjectFactory());
        $provide.value('ClassifierObjectFactory', new ClassifierObjectFactory_ts_1.ClassifierObjectFactory());
        $provide.value('ExplorationDraftObjectFactory', new ExplorationDraftObjectFactory_ts_1.ExplorationDraftObjectFactory());
        $provide.value('RuleObjectFactory', new RuleObjectFactory_ts_1.RuleObjectFactory());
        $provide.value('WrittenTranslationObjectFactory', new WrittenTranslationObjectFactory_ts_1.WrittenTranslationObjectFactory());
    }));
    beforeEach(angular.mock.inject(function (_$q_, _$rootScope_, _ImprovementCardService_, _FeedbackImprovementCardObjectFactory_, _PlaythroughImprovementCardObjectFactory_, _SuggestionImprovementCardObjectFactory_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
        ImprovementCardService = _ImprovementCardService_;
        FeedbackImprovementCardObjectFactory =
            _FeedbackImprovementCardObjectFactory_;
        PlaythroughImprovementCardObjectFactory =
            _PlaythroughImprovementCardObjectFactory_;
        SuggestionImprovementCardObjectFactory =
            _SuggestionImprovementCardObjectFactory_;
        this.expectedFactories = [
            FeedbackImprovementCardObjectFactory,
            PlaythroughImprovementCardObjectFactory,
            SuggestionImprovementCardObjectFactory,
        ];
    }));
    describe('.getImprovementCardObjectFactoryRegistry', function () {
        it('contains all known improvement card object factories', function () {
            var actualFactories = ImprovementCardService.getImprovementCardObjectFactoryRegistry();
            // The registry should not be modifiable.
            expect(Object.isFrozen(actualFactories)).toBe(true);
            // Ordering isn't important, so allow the checks to be flexible.
            expect(actualFactories.length).toEqual(this.expectedFactories.length);
            this.expectedFactories.forEach(function (expectedFactory) {
                expect(actualFactories).toContain(expectedFactory);
            });
        });
    });
    describe('.fetchCards', function () {
        // Each individual factory should test their own fetchCards function.
        describe('from factories which all return empty cards', function () {
            beforeEach(function () {
                this.expectedFactories.forEach(function (factory) {
                    spyOn(factory, 'fetchCards').and.callFake(function () {
                        return $q.resolve([]);
                    });
                });
            });
            it('returns an empty list', function (done) {
                var onSuccess = function (cards) {
                    expect(cards).toEqual([]);
                    done();
                };
                var onFailure = function (error) {
                    done.fail(error);
                };
                ImprovementCardService.fetchCards().then(onSuccess, onFailure);
                // $q Promises need to be forcibly resolved through a JavaScript digest,
                // which is what $apply helps kick-start.
                $rootScope.$apply();
            });
        });
    });
});
