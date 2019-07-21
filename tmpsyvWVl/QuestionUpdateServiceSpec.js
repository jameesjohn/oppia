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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @fileoverview Unit tests for question update service.
 */
// TODO(YashJipkate) Remove the following block of unnnecessary imports once
// QuestionUpdateService.ts is upgraded to Angular 8.
var RuleObjectFactory_ts_1 = require("domain/exploration/RuleObjectFactory.ts");
var WrittenTranslationObjectFactory_ts_1 = require("domain/exploration/WrittenTranslationObjectFactory.ts");
// ^^^ This block is to be removed.
require('App.ts');
require('domain/editor/undo_redo/QuestionUndoRedoService.ts');
require('domain/exploration/SubtitledHtmlObjectFactory.ts');
require('domain/question/QuestionObjectFactory.ts');
require('domain/question/QuestionUpdateService.ts');
require('domain/state/StateObjectFactory.ts');
require('components/question-directives/question-editor/' +
    'question-editor.directive.ts');
describe('Question update service', function () {
    var QuestionUpdateService = null;
    var QuestionObjectFactory = null;
    var QuestionUndoRedoService = null;
    var StateObjectFactory = null;
    var SubtitledHtmlObjectFactory = null;
    var sampleQuestion = null;
    var sampleStateTwo = null;
    var sampleStateDict = null;
    var expectedOutputStateDict = null;
    var expectedOutputState = null;
    var sampleQuestionBackendObject = null;
    beforeEach(angular.mock.module('oppia'));
    beforeEach(angular.mock.module('oppia', function ($provide) {
        $provide.value('WrittenTranslationObjectFactory', new WrittenTranslationObjectFactory_ts_1.WrittenTranslationObjectFactory());
        $provide.value('RuleObjectFactory', new RuleObjectFactory_ts_1.RuleObjectFactory());
    }));
    beforeEach(angular.mock.inject(function ($injector) {
        QuestionUpdateService = $injector.get('QuestionUpdateService');
        QuestionObjectFactory = $injector.get('QuestionObjectFactory');
        QuestionUndoRedoService = $injector.get('QuestionUndoRedoService');
        StateObjectFactory = $injector.get('StateObjectFactory');
        SubtitledHtmlObjectFactory = $injector.get('SubtitledHtmlObjectFactory');
        sampleStateDict = {
            name: 'question',
            classifier_model_id: 0,
            content: {
                html: 'old content',
                content_id: 'content'
            },
            param_changes: [],
            interaction: {
                answer_groups: [{
                        rule_specs: [{ rule_type: 'Contains', inputs: { x: 'hola' } }],
                        outcome: {
                            dest: 'Me Llamo',
                            feedback: {
                                content_id: 'feedback_1',
                                html: 'buen trabajo!'
                            },
                            labelled_as_correct: true
                        }
                    }],
                default_outcome: {
                    dest: 'Hola',
                    feedback: {
                        content_id: 'default_outcome',
                        html: 'try again!'
                    },
                    labelled_as_correct: false
                },
                hints: [],
                id: 'TextInput',
            },
            recorded_voiceovers: {
                voiceovers_mapping: {
                    content: {},
                    default_outcome: {}
                }
            },
            solicit_answer_details: false,
            written_translations: {
                translations_mapping: {
                    content: {},
                    default_outcome: {}
                }
            }
        };
        expectedOutputStateDict = {
            name: 'question',
            classifier_model_id: 0,
            content: {
                html: 'test content',
                content_id: 'content'
            },
            param_changes: [],
            interaction: {
                answer_groups: [{
                        rule_specs: [{ rule_type: 'Contains', inputs: { x: 'hola' } }],
                        outcome: {
                            dest: 'Me Llamo',
                            feedback: {
                                content_id: 'feedback_1',
                                html: 'buen trabajo!'
                            },
                            labelled_as_correct: true
                        }
                    }],
                default_outcome: {
                    dest: 'Hola',
                    feedback: {
                        content_id: 'default_outcome',
                        html: 'try again!'
                    },
                    labelled_as_correct: false
                },
                hints: [],
                id: 'TextInput',
            },
            recorded_voiceovers: {
                voiceovers_mapping: {
                    content: {},
                    default_outcome: {}
                }
            },
            solicit_answer_details: false,
            written_translations: {
                translations_mapping: {
                    content: {},
                    default_outcome: {}
                }
            }
        };
        expectedOutputState = StateObjectFactory.createFromBackendDict('question', expectedOutputStateDict);
        sampleQuestionBackendObject = {
            id: '0',
            question_state_data: sampleStateDict,
            language_code: 'en',
            version: 1
        };
        sampleQuestion = QuestionObjectFactory.createFromBackendDict(sampleQuestionBackendObject);
    }));
    it('should update the language code of the question', function () {
        expect(sampleQuestion.getLanguageCode()).toEqual('en');
        QuestionUpdateService.setQuestionLanguageCode(sampleQuestion, 'zh');
        expect(sampleQuestion.getLanguageCode()).toEqual('zh');
        QuestionUndoRedoService.undoChange(sampleQuestion);
        expect(sampleQuestion.getLanguageCode()).toEqual('en');
    });
    it('should update the state data of the question', function () {
        var oldStateData = angular.copy(sampleQuestion.getStateData());
        var updateFunction = function () {
            var stateData = sampleQuestion.getStateData();
            stateData.content = SubtitledHtmlObjectFactory.createDefault('test content', 'content');
        };
        QuestionUpdateService.setQuestionStateData(sampleQuestion, updateFunction);
        expect(sampleQuestion.getStateData()).toEqual(expectedOutputState);
        QuestionUndoRedoService.undoChange(sampleQuestion);
        expect(sampleQuestion.getStateData()).toEqual(oldStateData);
    });
});
