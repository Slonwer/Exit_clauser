'use strict';

const rewire = require('rewire');
const spedGen = rewire('../index');
const sinon = require('sinon');
const should = require('should');
const fs = require('fs');
const rmrf = require('rimraf');
require('should-sinon');
require('mocha-sinon')();

describe('Sped Gen', function () {
  it('deve exportar uma função', function () {
    spedGen.should.be.a.Function();
  });

  it('deve exportar hash de layouts', function () {
    spedGen.should.have.property('layouts').which.is.an.Object();

    const layouts = spedGen.layouts;
    layouts.should.have.property('FISCAL').which.is.an.String();
    layouts.should.have.property('CONTRIB').which.is.an.String();
  });

  it('deve exportar hash de versões de layout', function () {
    spedGen.should.have.property('versoes').which.is.an.Object();

    const layouts = spedGen.versoes;
    layouts.should.have.property('FISCAL').which.is.an.Array();
    layouts.should.have.property('CONTRIB').which.is.an.Array();
  });

  it('deve exportar funções do módulo sped-utils', function () {
    spedGen.should.have.property('utils').which.is.an.Object();
  });

  it('deve exportar função para registrar helpers do handlebars', function() {
    spedGen.should.have.property('registerHelper').which.is.a.Function();
  });

  describe('Default options', () => {
    it('deve ser exportado pelo modulo', function () {
      spedGen.should.have.property('DEFAULT_OPTIONS').which.is.an.Object();
    });

    it('deve ter filter que retorna true', () => {
      spedGen.DEFAULT_OPTIONS.filter().should.be.true();
    });
  });

  describe('Função principal', function () {
    let revertRequireStub;

    beforeEach(function() {
      this.noop_opts = {
        template: 'no template',
        writer: () => {},
        filter: () => false
      };

      rmrf.sync('./test/generated/');
    });

    afterEach(function clearCache() {
      if (revertRequireStub) {
        revertRequireStub();
      }
    });

    it('deve extender opções default com opções informadas', function () {
      sinon.spy(Object, "assign");

      spedGen(this.noop_opts);

      Object.assign.should.be.calledWithMatch({}, spedGen.DEFAULT_OPTIONS, this.noop_opts);
    });

    it('deve invocar opção filename se for função', function () {
      const fileName = this.noop_opts.fileName = sinon.spy();

      spedGen(this.noop_opts);

      fileName.should.be.calledOnce();
    });

    it('deve lançar exceção se versão for incompatível com o layout informado', function() {
      this.noop_opts.layoutSped = spedGen.layouts.CONTRIB;
      this.noop_opts.versaoLayout = '011';

      (() => spedGen(this.noop_opts)).should.throw(/Versão '011' inválida para o layout 'contrib'/);
    });

    it('deve carregar última versão dos metadados do layout Sped informado nas opções se versão não informada', function () {
      const req = sinon.stub().returns([]);
      revertRequireStub = spedGen.__set__('require', req);
      this.noop_opts.layoutSped = 'fiscal';
      const versoes = spedGen.versoes.FISCAL;
      const versao = versoes[versoes.length - 1];

      spedGen(this.noop_opts);

      req.should.be.calledWith(`./meta/metadados-fiscal-v${versao}`);
    });

    it('deve carregar metadados do layout Sped e versão informados nas opções', function () {
      const req = sinon.stub().returns([]);
      revertRequireStub = spedGen.__set__('require', req);
      this.noop_opts.layoutSped = 'fiscal';
      this.noop_opts.versaoLayout = '009';

      spedGen(this.noop_opts);

      req.should.be.calledWith('./meta/metadados-fiscal-v009');
    });

    it('deve lançar exceção se a opção template ou templateFile não informada', function(done) {
      this.noop_opts.template = null;
      this.noop_opts.templateFile = null;

      try {
        spedGen(this.noop_opts);
        should.fail('Exceção não foi lançada');
      } catch (error) {
        error.message.should.equal('Opção template ou templateFile não informada');
        done();
      }
    });

    it('deve compilar template', function () {
      const compile = sinon.spy(require('handlebars'), 'compile');

      spedGen(this.noop_opts);

      compile.should.be.calledWith(this.noop_opts.template);
    });

    it('deve carregar templateFile informado nas opções, se houver', function () {
      this.noop_opts.template = null;
      this.noop_opts.templateFile = './test/test.hbs';
      const read = sinon.spy(fs, 'readFileSync');

      spedGen(this.noop_opts);

      read.should.be.calledWith(this.noop_opts.templateFile);
    });

    it('deve usar filter informado nas opções, se houver', function () {
      const filter = this.noop_opts.filter = sinon.stub().returns(false);

      spedGen(this.noop_opts);

      filter.should.be.called();
    });

    it('deve usar writer informado nas opções, se houver', function () {
      const writer = this.noop_opts.writer = sinon.spy();
      this.noop_opts.filter = reg => reg.id === '0000';

      spedGen(this.noop_opts);

      writer.should.be.called();
    });

    it('deve incluir campos default aos registros', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      const forEach = sinon.stub(Array.prototype, 'forEach');

      spedGen(this.noop_opts);

      let registro = forEach.getCall(0).thisValue
      registro.should.have.property('bloco');
      registro.should.have.property('abertura');
      registro.should.have.property('encerramento');
      registro.should.have.property('layoutSped');

      forEach.restore();
    });

    it('deve incluir campos adicionais aos registros', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      this.noop_opts.aditionalFields = { foo: 'bar' };
      const forEach = sinon.stub(Array.prototype, 'forEach');

      spedGen(this.noop_opts);

      let registro = forEach.getCall(0).thisValue
      registro.should.have.property('foo');

      forEach.restore();
    });

    it('deve usar handler informado nas opções, se houver', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      const handler = this.noop_opts.handler = sinon.spy();

      spedGen(this.noop_opts);

      handler.should.be.called();
    });

    it('deve usar mapper informado nas opções, se houver', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      const mapper = this.noop_opts.mapper = sinon.spy();

      spedGen(this.noop_opts);

      mapper.should.be.called();
    });

    it('deve escrever arquivo quando opção singleFile true', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      this.noop_opts.singleFile = true;
      this.noop_opts.writer = null; // força o uso do writer interno
      const fileName = this.noop_opts.fileName = './test/generated/singleFileTest';

      spedGen(this.noop_opts);

      fs.existsSync(fileName).should.be.true();
    });

    it('não deve escrever arquivo se não gerar conteúdo', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      this.noop_opts.singleFile = true;
      this.noop_opts.writer = null; // força o uso do writer interno
      this.noop_opts.template = ""; // template vazio não gera conteúdo
      const fileName = this.noop_opts.fileName = './test/generated/singleFileTest2';

      spedGen(this.noop_opts);

      fs.existsSync(fileName).should.be.false();
    });

    it('deve escrever arquivos com multiFileWriter', function() {
      this.noop_opts.filter = reg => reg.id === '0000' || reg.id === '0001';
      this.noop_opts.singleFile = false;
      this.noop_opts.writer = null; // força o uso do writer interno
      this.noop_opts.fileName = './test/generated/multiFilesTest{{id}}';

      spedGen(this.noop_opts);

      const file0000 = './test/generated/multiFilesTest0000';
      const file0001 = './test/generated/multiFilesTest0001';
      fs.existsSync(file0000).should.be.true();
      fs.existsSync(file0001).should.be.true();
    });

    it('não deve invocar writer se não gerar conteúdo', function () {
      this.noop_opts.filter = reg => reg.id === '0000';
      this.noop_opts.singleFile = true;
      const writer = this.noop_opts.writer = sinon.spy()
      this.noop_opts.template = ""; // template vazio não gera conteúdo

      spedGen(this.noop_opts);

      writer.should.not.be.called();
    });

    it('deve escrever template computado no arquivo gerado', function () {
      this.noop_opts.filter = reg => reg.id === '0000' || reg.id === '0001';
      this.noop_opts.singleFile = true;
      this.noop_opts.writer = null; // força o uso do writer interno
      this.noop_opts.template = 'Registro {{id}}';
      const fileName = this.noop_opts.fileName = './test/generated/singleFileTest3';

      spedGen(this.noop_opts);

      const content = fs.readFileSync(fileName).toString();
      content.should.be.equal('Registro 0000\nRegistro 0001\n');
    });

    it('deve excluir arquivo gerado se já existir', function () {
      this.noop_opts.template = "{{id}}";
      this.noop_opts.filter = reg => reg.id === '0000';
      this.noop_opts.singleFile = true;
      this.noop_opts.writer = null; // força o uso do writer interno
      const fileName = this.noop_opts.fileName = './test/generated/singleFileTest4';

      spedGen(this.noop_opts);
      spedGen(this.noop_opts);

      const content = fs.readFileSync(fileName).toString();
      content.should.be.equal('0000\n');
    });

    it('deve registrar helpers informados nas opções, se houver', function () {
      this.noop_opts.helpers = { sayHello: who => 'Hello, ' + who };
      const registerHelper = sinon.spy(require('handlebars'), 'registerHelper');

      spedGen(this.noop_opts);

      registerHelper.should.be.calledWith('sayHello', this.noop_opts.helpers.sayHello);
    });

    it('deve remover helpers informados nas opções, se houver', function () {
      this.noop_opts.helpers = { foo: () => 'bar' };
      const forEach = sinon.spy(Array.prototype, 'forEach');
      const unregisterHelper = sinon.spy(require('handlebars'), 'unregisterHelper');

      spedGen(this.noop_opts);

      unregisterHelper.should.be.calledWith('foo');
      unregisterHelper.calledAfter(forEach).should.be.true();
    });
  });
});
// Importação de Módulos:

// rewire: Módulo para modificar variáveis internas de outros módulos durante os testes.
const rewire = require('rewire');

// sinon: Biblioteca para criação de spies, stubs e mocks em testes.
const sinon = require('sinon');

// should: Framework de assertion para testes.
const should = require('should');

// fs: Módulo para lidar com operações de arquivo.
const fs = require('fs');

// rmrf: Módulo para remover diretórios recursivamente.
const rmrf = require('rimraf');

// should-sinon: Extensão para should que adiciona assertions específicas para Sinon.js.
require('should-sinon');

// mocha-sinon: Extensão do Mocha para integração com Sinon.js.
require('mocha-sinon')();

// Descrição dos Testes:

// O código descreve uma suíte de testes para o módulo spedGen usando o Mocha.
// Cada teste verifica um aspecto específico do comportamento do spedGen.

// Testes de Exportação de Funções e Constantes:

// Os testes verificam se o módulo spedGen exporta corretamente as funções, constantes e objetos esperados.

// Testes de Opções Padrão:

// Verifica se as opções padrão do módulo estão corretamente definidas e funcionando como esperado.

// Testes da Função Principal:

// A suíte de testes para a função principal spedGen.
// Cada teste verifica um cenário diferente da execução da função principal.

// Configuração dos Testes:

// Utiliza os hooks beforeEach e afterEach para configurar o ambiente de teste antes e depois de cada teste, respectivamente.
// No beforeEach, define-se um objeto noop_opts que contém opções padrão para os testes.
// Utiliza rmrf.sync para remover o diretório de testes antes de cada teste.

// Execução dos Testes:

// Cada teste chama a função spedGen com diferentes opções e verifica se o comportamento está de acordo com o esperado.
// Utiliza asserts should e Sinon.js para verificar os resultados e comportamentos esperados.

// Testes de Comportamento:

// Os testes cobrem diferentes aspectos do comportamento do spedGen, incluindo manipulação de opções, compilação de template, execução de funções auxiliares, geração de arquivos, entre outros.
// No geral, esses testes garantem que o módulo spedGen funcione conforme o esperado em diferentes cenários e que qualquer alteração futura no código não quebre o comportamento existente.
