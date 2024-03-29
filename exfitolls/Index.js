'use strict';

// Importação de módulos necessários
const fs = require('fs');
const handlebars = require('handlebars');
const spedUtils = require('./lib/sped-utils');
const DefaultWriter = require('./lib/default-writer');

// Registro de helpers customizados do Handlebars
require('./lib/custom-helpers').registerCustomHelpers(handlebars);

// Constantes para identificar os layouts
const LAYOUT_FISCAL = 'fiscal';
const LAYOUT_CONTRIB = 'contrib';

// Versões disponíveis para cada tipo de layout
const versoes = {
  FISCAL: ['009', '010', '011'],
  CONTRIB: ['002', '003', '004', '005']
};

// Opções padrão
const DEFAULT_OPTIONS = {
  layoutSped: LAYOUT_FISCAL,
  versaoLayout: null,
  template: null,
  templateFile: null,
  fileName: null,
  singleFile: false,
  filter: () => true,
  handler: () => {},
  mapper: reg => reg,
  writer: null,
  aditionalFields: {},
  helpers: null
};

// Função principal de geração
const generate = options => {
  // Validação das opções fornecidas
  validateOptions(options);

  // Mescla opções fornecidas com opções padrão
  let opts = Object.assign({}, DEFAULT_OPTIONS, options);

  // Se o nome do arquivo for uma função, o nome é gerado dinamicamente
  if (typeof opts.fileName === 'function') {
    opts.fileName = opts.fileName(opts);
  }

  // Validação da versão do layout
  validateVersion(opts);

  // Se a versão do layout não foi especificada, usa a última disponível
  if (opts.versaoLayout == null) {
    const versions = getVersions(opts.layoutSped);
    opts.versaoLayout = versions[versions.length - 1]
  }

  // Carrega metadados do layout específico
  const metadata = require(`./meta/metadados-${opts.layoutSped}-v${opts.versaoLayout}`);

  // Compila o template Handlebars
  const template = opts.template != null ? opts.template : fs.readFileSync(opts.templateFile).toString();
  const compiledTemplate = handlebars.compile(template);

  // Se o escritor não foi fornecido, usa o escritor padrão
  opts.writer = opts.writer || new DefaultWriter(opts, handlebars);
  if (typeof opts.writer === 'function') {
    const write = opts.writer;
    opts.writer = { write };
  }

  // Se os helpers não foram fornecidos, inicializa como um objeto vazio
  opts.helpers = opts.helpers || {};
  // Registra os helpers fornecidos
  Object.keys(opts.helpers).forEach(name => registerHelper(name, opts.helpers[name]));

  // Itera sobre cada registro nos metadados
  metadata.filter(opts.filter).forEach(registro => {
    // Configura campos adicionais no registro
    registro.bloco = registro.id[0];
    registro.abertura = spedUtils.ehAbertura(registro.id);
    registro.encerramento = spedUtils.ehEncerramento(registro.id);
    registro.layoutSped = opts.layoutSped;
    registro.campos.shift(); // remove campo REG

    const newFields = Object.assign({}, DEFAULT_OPTIONS.aditionalFields, opts.aditionalFields);
    registro = Object.assign({}, registro, newFields);

    // Manipula o registro conforme necessário
    opts.handler(registro);

    // Mapeia o registro conforme necessário
    registro = opts.mapper(registro);

    // Compila o template com os dados do registro e escreve o resultado
    const result = compiledTemplate(registro);
    if (result.trim() !== '') {
      opts.writer.write(result, registro, opts);
    }
  });

  // Desregistra os helpers após o uso
  Object.keys(opts.helpers).forEach(name => handlebars.unregisterHelper(name));
};

// Função para validar as opções
const validateOptions = opts => {
  if (opts.template == null && (opts.templateFile == null || opts.templateFile === '')) {
    throw new Error('Opção template ou templateFile não informada');
  }
};

// Função para validar a versão do layout
const validateVersion = opts => {
  const layout = opts.layoutSped;
  const version = opts.versaoLayout;

  if (version == null) return;

  const validVersions = getVersions(layout);

  if (validVersions.indexOf(version) === -1) {
    const msg = `Versão '${version}' inválida para o layout '${layout}'. Versões válidas: ${validVersions.join(', ')}`;
    throw new Error(msg);
  }
};

// Função para obter as versões disponíveis para um determinado layout
const getVersions = layout => versoes[layout.toUpperCase()];

// Função para registrar um helper no Handlebars
const registerHelper = (name, func) => {
  handlebars.registerHelper(name, func);
};

// Exportação de todas as funções e constantes necessárias
module.exports = generate;
module.exports.layouts = { FISCAL: LAYOUT_FISCAL, CONTRIB: LAYOUT_CONTRIB };
module.exports.versoes = versoes;
module.exports.utils = spedUtils;
module.exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
module.exports.registerHelper = registerHelper;
