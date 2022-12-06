/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const { MetaModelNamespace } = require('@accordproject/concerto-metamodel');

const ClassDeclaration = require('../../lib/introspect/classdeclaration');
const ScalarDeclaration = require('../../lib/introspect/scalardeclaration');
const Field = require('../../lib/introspect/field');
const ModelFile = require('../../lib/introspect/modelfile');

const should = require('chai').should();
const sinon = require('sinon');

describe('Field', () => {

    let mockClassDeclaration;
    let mockModelFile;
    let mockScalarDeclaration;

    beforeEach(() => {
        mockClassDeclaration = sinon.createStubInstance(ClassDeclaration);
        mockModelFile = sinon.createStubInstance(ModelFile);
        mockScalarDeclaration = sinon.createStubInstance(ScalarDeclaration);
        mockClassDeclaration.getModelFile.returns(mockModelFile);
        mockModelFile.getType.returns(mockScalarDeclaration);
        mockScalarDeclaration.isScalarDeclaration.returns(true);
        mockScalarDeclaration.ast = {
            $class: `${MetaModelNamespace}.StringScalar`,
            name: 'MyScalar',
            defaultValue: 'abc'
        };
    });

    describe('#constructor', () => {

        it('should not have a validator by default', () => {
            let f = new Field(mockClassDeclaration, {
                $class: `${MetaModelNamespace}.StringProperty`,
                name: 'field',
            });
            should.equal(f.validator, null);
        });

        it('should save the incoming string validator', () => {

            let f = new Field(mockClassDeclaration, {
                $class: `${MetaModelNamespace}.StringProperty`,
                name: 'field',
                validator: {
                    pattern: '^suchValidator$',
                    flags: ''
                }
            });
            f.getValidator().validate('id', 'suchValidator');
        });

        it('should save the incoming string validator (with flag)', () => {

            let f = new Field(mockClassDeclaration, {
                $class: `${MetaModelNamespace}.StringProperty`,
                name: 'field',
                validator: {
                    pattern: '^suchValidator$',
                    flags: 'u'
                }
            });
            f.getValidator().validate('id', 'suchValidator');
        });

        it('should not have a default value by default', () => {
            let f = new Field(mockClassDeclaration, {
                $class: `${MetaModelNamespace}.StringProperty`,
                name: 'field',
            });
            should.equal(f.defaultValue, null);
        });

        it('should save the incoming default value', () => {
            let f = new Field(mockClassDeclaration, {
                $class: `${MetaModelNamespace}.StringProperty`,
                name: 'field',
                defaultValue: 'wowSuchDefault'
            });
            f.defaultValue.should.equal('wowSuchDefault');
        });

        it('should not be optional by default', () => {
            let f = new Field(mockClassDeclaration, {
                $class: `${MetaModelNamespace}.StringProperty`,
                name: 'field',
            });
            f.optional.should.equal(false);
        });

        it('should detect if field is optional', () => {
            let f = new Field(mockClassDeclaration, {
                $class: `${MetaModelNamespace}.StringProperty`,
                name: 'field',
                isOptional: true
            });
            f.optional.should.equal(true);
        });

        it('should unbox a Scalar Property', () => {
            let p = new Field(mockClassDeclaration, {
                $class: `${MetaModelNamespace}.ObjectProperty`,
                name: 'property',
                type: {
                    name: 'MyScalar',
                }
            });
            p.type.should.equal('String');
            p.ast.defaultValue.should.equal('abc');
        });

    });

    describe('#toString',()=>{
        it('regular toString',()=>{
            let f = new Field(mockClassDeclaration, {
                $class: `${MetaModelNamespace}.StringProperty`,
                name: 'field',
            });
            let stub = sinon.stub(f,'getFullyQualifiedTypeName');
            stub.returns('fqn');
            f.toString().should.equal('Field {name=field, type=fqn, array=false, optional=false}');
        });

    });

});
