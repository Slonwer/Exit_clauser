#include <math.h>        // Biblioteca para funções matemáticas
#include <stdio.h>       // Biblioteca para entrada e saída padrão
#include <stdlib.h>      // Biblioteca para funções de alocação de memória e outras utilidades
#include <string.h>      // Biblioteca para manipulação de strings

// Inclusão condicional de bibliotecas para manipulação de tipos inteiros
#ifdef __sun
#include <sys/int_types.h>
#elif defined(__FreeBSD__) || defined(__IBMCPP__) || defined(_AIX)
#include <inttypes.h>
#else
#include <stdint.h>
#endif

#include "bfg.h"         // Inclusão do arquivo de cabeçalho "bfg.h"

// Estrutura para armazenar opções de configuração
bf_option bf_options;

#ifdef HAVE_MATH_H

extern int32_t debug;    // Variável externa para controle de debug

// Função para adicionar um único caractere ao conjunto de caracteres
static int32_t add_single_char(char ch, char flags, int32_t *crs_len) {
  // Verifica se o caractere é um dígito e se já foi definido um intervalo de números
  if ((ch >= '2' && ch <= '9') || ch == '0') {
    if ((flags & BF_NUMS) > 0) {
      printf("[ERROR] caractere %c definido em -x embora o intervalo numérico "
             "já tenha sido definido por '1', ignorado\n", ch);
      return 0;
    }
    // printf("[WARNING] adicionando caractere %c para -x, note que '1' adicionará todos
    // os números de 0-9\n", ch);
  }
  // Verifica se o caractere está na faixa de letras e se já foi definido um intervalo de letras
  if (tolower((int32_t)ch) >= 'b' && tolower((int32_t)ch) <= 'z') {
    if ((ch <= 'Z' && (flags & BF_UPPER) > 0) || (ch > 'Z' && (flags & BF_UPPER) > 0)) {
      printf("[ERROR] caractere %c definido em -x embora o intervalo de letras já tenha sido definido por '%c', ignorado\n",
             ch, ch <= 'Z' ? 'A' : 'a');
      return 0;
    }
    // printf("[WARNING] adicionando caractere %c para -x, note que '%c' adicionará todas as letras em %s\n", ch, ch <= 'Z' ? 'A' : 'a', ch <= 'Z' ? "maiúsculas" : "minúsculas");
  }
  (*crs_len)++;
  // Verifica se o tamanho do conjunto de caracteres excede o máximo permitido
  if (BF_CHARSMAX - *crs_len < 1) {
    free(bf_options.crs);
    fprintf(stderr, "Erro: especificação do conjunto de caracteres excede %d caracteres.\n", BF_CHARSMAX);
    return 1;
  } else {
    bf_options.crs[*crs_len - 1] = ch;
    bf_options.crs[*crs_len] = '\0';  // Adiciona o terminador de string
  }
  return 0;
}

// Função para inicializar as opções de bruteforce
// Retorna 0 em caso de sucesso e 1 em caso de erro
int32_t bf_init(char *arg) {
  int32_t i = 0;
  int32_t crs_len = 0;
  char flags = 0;
  char *tmp = strchr(arg, ':'); // Encontra o primeiro ':' na string de argumentos

  // Verifica se o formato do argumento é válido
  if (!tmp) {
    fprintf(stderr, "Erro: formato de opção inválido para -x\n");
    return 1;
  } else {
    tmp[0] = '\0'; // Substitui o ':' por '\0' para separar a string
  }
  bf_options.from = atoi(arg); // Converte o argumento para um número inteiro
  if (bf_options.from < 1 || bf_options.from > 127) {
    fprintf(stderr, "Erro: o comprimento mínimo deve estar entre 1 e 127, formato: -x min:max:types\n");
    return 1;
  }
  arg = tmp + 1; // Avança para a próxima parte da string
  tmp++;
  if (!arg[0]) {
    fprintf(stderr, "Erro: comprimento máximo não especificado para -x min:max:types!\n");
    return 1;
  }
  tmp = strchr(arg, ':'); // Encontra o próximo ':'
  if (!tmp) {
    fprintf(stderr, "Erro: formato de opção inválido para -x\n");
    return 1;
  } else {
    tmp[0] = '\0'; // Substitui o ':' por '\0' para separar a string
  }
  bf_options.to = atoi(arg); // Converte o argumento para um número inteiro
  tmp++;

  if (bf_options.from > bf_options.to) {
    fprintf(stderr, "Erro: você especificou um comprimento mínimo maior que o comprimento máximo!\n");
    return 1;
  }

  if (tmp[0] == 0) {
    fprintf(stderr, "Erro: conjunto de caracteres não especificado!\n");
    return 1;
  }
  bf_options.crs = malloc(sizeof(char) * BF_CHARSMAX); // Aloca memória para o conjunto de caracteres

  if (bf_options.crs == NULL) {
    fprintf(stderr, "Erro: não foi possível alocar memória suficiente!\n");
    return 1;
  }
  bf_options.crs[0] = 0; // Inicializa o conjunto de caracteres

  // Adiciona caracteres ao conjunto com base na string fornecida
  for (; tmp[i]; i++) {
    if (bf_options.disable_symbols) {
      if (add_single_char(tmp[i], flags, &crs_len) == -1)
        return 1;
    } else {
      switch (tmp[i]) {
      case 'a':
        crs_len += 26;
        if (BF_CHARSMAX - crs_len < 1) {
          free(bf_options.crs);
          fprintf(stderr, "Erro: especificação do conjunto de caracteres excede %d caracteres.\n", BF_CHARSMAX);
          return 1;
        } else if (flags & BF_LOWER) {
          free(bf_options.crs);
          fprintf(stderr, "Erro: 'a' especificado mais de uma vez no conjunto de caracteres!\n");
          return 1;
        } else {
          strcat(bf_options.crs, "abcdefghijklmnopqrstuvwxyz"); // Adiciona todas as letras minúsculas
          flags |= BF_LOWER;
        }
        break;

      case 'A':
        crs_len += 26;
        if (BF_CHARSMAX - crs_len < 1) {
          free(bf_options.crs);
          fprintf(stderr, "Erro: especificação do conjunto de caracteres excede %d caracteres.\n", BF_CHARSMAX);
          return 1;
        } else if (flags & BF_UPPER) {
          free(bf_options.crs);
          fprintf(stderr, "Erro: 'A' especificado mais de uma vez no conjunto de caracteres!\n");
          return 1;
        } else {
          strcat(bf_options.crs, "ABCDEFGHIJKLMNOPQRSTUVWXYZ"); // Adiciona todas as letras maiúsculas
          flags |= BF_UPPER;
        }
        break;

      case '1':
        crs_len += 10;
        if (BF_CHARSMAX - crs_len < 1) {
          free(bf_options.crs);
          fprintf(stderr, "Erro: especificação do conjunto de caracteres excede %d caracteres.\n", BF_CHARSMAX);
          return 1;
        } else if (flags & BF_NUMS) {
          free(bf_options.crs);
          fprintf(stderr, "Erro: '1' especificado mais de uma vez no conjunto de caracteres!\n");
          return 1;
        } else {
          strcat(bf_options.crs, "0123456789"); // Adiciona todos os dígitos
          flags |= BF_NUMS;
        }
        break;

      default:
        if (add_single_char(tmp[i], flags, &crs_len) == -1)
          return 1;
        break;
      }
    }
  }

  bf_options.crs_len = crs_len; // Define o comprimento do conjunto de caracteres
  bf_options.current = bf_options.from; // Define o comprimento atual

  memset((char *)bf_options.state, 0, sizeof(bf_options.state)); // Inicializa o estado

  if (debug)
    printf("[DEBUG] bfg INIT: from %u, to %u, len: %u, set: %s\n", bf_options.from, bf_options.to, bf_options.crs_len, bf_options.crs);

  return 0;
}

// Função para calcular o número total de combinações possíveis
uint64_t bf_get_pcount() {
  int32_t i;
  double count = 0;
  uint64_t foo;

  // Calcula o número total de combinações possíveis
  for (i = bf_options.from; i <= bf_options.to; i++)
    count += (pow((double)bf_options.crs_len, (double)i));
  if (count >= 0xffffffff) {
    fprintf(stderr, "\n[ERROR] definição para brutef
